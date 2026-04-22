import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import {
  calculateGST,
  extractStateCodeFromGSTIN,
  BUSINESS_STATE_CODE,
  STATE_CODES,
} from "@/lib/gst";

interface CartItem {
  productId: string;
  quantity: number;
}

interface ShippingAddress {
  state: string;
}

/**
 * Get state code from state name
 */
function getStateCodeFromName(stateName: string): string {
  const normalizedState = stateName.toLowerCase().trim();
  
  for (const [code, name] of Object.entries(STATE_CODES)) {
    if (name.toLowerCase() === normalizedState) {
      return code;
    }
  }
  
  // Common variations
  const stateVariations: { [key: string]: string } = {
    "karnataka": "29",
    "bangalore": "29",
    "bengaluru": "29",
    "maharashtra": "27",
    "mumbai": "27",
    "delhi": "07",
    "new delhi": "07",
    "tamil nadu": "33",
    "chennai": "33",
    "telangana": "36",
    "hyderabad": "36",
    "kerala": "32",
    "gujarat": "24",
    "rajasthan": "08",
    "uttar pradesh": "09",
    "west bengal": "19",
    "kolkata": "19",
    "punjab": "03",
    "haryana": "06",
    "madhya pradesh": "23",
    "andhra pradesh": "37",
    "bihar": "10",
    "odisha": "21",
    "jharkhand": "20",
    "assam": "18",
    "goa": "30",
  };
  
  return stateVariations[normalizedState] || BUSINESS_STATE_CODE;
}

/**
 * Calculate tax without creating a Razorpay order
 * This is a lightweight endpoint for displaying tax breakdown on checkout
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { items, shippingAddress } = body as {
      items: CartItem[];
      shippingAddress: ShippingAddress;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.state) {
      return NextResponse.json(
        { error: "Shipping state is required" },
        { status: 400 }
      );
    }

    // 3. Connect to database
    await dbConnect();

    // 4. Get user details for GST
    const user = await User.findById(session.user.id).lean();
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 5. Determine customer state code
    let customerStateCode: string;
    
    if (user.gstNumber && user.isGstVerified) {
      const gstStateCode = extractStateCodeFromGSTIN(user.gstNumber);
      customerStateCode = gstStateCode || getStateCodeFromName(shippingAddress.state);
    } else {
      customerStateCode = getStateCodeFromName(shippingAddress.state);
    }

    // 6. Fetch products and calculate subtotal
    const productIds = items.map(item => item.productId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = await Product.find({ _id: { $in: productIds } }).lean() as any[];

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "One or more products not found" },
        { status: 400 }
      );
    }

    let subtotal = 0;
    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId);
      if (product) {
        subtotal += product.price * item.quantity;
      }
    }

    // 7. Calculate shipping
    const shippingCost = subtotal >= 5000 ? 0 : 99;

    // 8. Calculate GST
    const taxableAmount = subtotal + shippingCost;
    const gstBreakdown = calculateGST(taxableAmount, customerStateCode);

    // 9. Return tax breakdown
    return NextResponse.json({
      success: true,
      breakdown: {
        subtotal,
        shippingCost,
        taxBreakdown: {
          taxType: gstBreakdown.taxType,
          cgst: gstBreakdown.cgst,
          sgst: gstBreakdown.sgst,
          igst: gstBreakdown.igst,
          totalTax: gstBreakdown.totalTax,
          customerState: gstBreakdown.customerStateName,
          isIntraState: gstBreakdown.isIntraState,
        },
        total: gstBreakdown.grandTotal,
      },
    });
  } catch (error) {
    console.error("Tax calculation error:", error);
    
    return NextResponse.json(
      { error: "Failed to calculate tax" },
      { status: 500 }
    );
  }
}

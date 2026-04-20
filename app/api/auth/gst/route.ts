import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// GST Number validation regex
// Format: 2 digits (state code) + 10 chars (PAN) + 1 digit (entity number) + Z + 1 check digit
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// State codes mapping for GST
const STATE_CODES: { [key: string]: string } = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "26": "Dadra & Nagar Haveli and Daman & Diu",
  "27": "Maharashtra",
  "28": "Andhra Pradesh (Old)",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
};

function validateGSTNumber(gst: string): { valid: boolean; error?: string; state?: string } {
  if (!gst) {
    return { valid: false, error: "GST number is required" };
  }

  const upperGST = gst.toUpperCase().trim();

  if (upperGST.length !== 15) {
    return { valid: false, error: "GST number must be exactly 15 characters" };
  }

  if (!GST_REGEX.test(upperGST)) {
    return { valid: false, error: "Invalid GST number format" };
  }

  const stateCode = upperGST.substring(0, 2);
  const stateName = STATE_CODES[stateCode];

  if (!stateName) {
    return { valid: false, error: "Invalid state code in GST number" };
  }

  return { valid: true, state: stateName };
}

// POST - Submit GST number
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { gstNumber, businessName, businessType } = await request.json();

    // Validate GST number format
    const validation = validateGSTNumber(gstNumber);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if GST is already registered to another user
    const existingGST = await User.findOne({
      gstNumber: gstNumber.toUpperCase(),
      _id: { $ne: session.user.id },
    });

    if (existingGST) {
      return NextResponse.json(
        { error: "This GST number is already registered to another account" },
        { status: 400 }
      );
    }

    // Update user with GST details
    user.gstNumber = gstNumber.toUpperCase();
    user.businessName = businessName;
    user.businessType = businessType || "other";
    user.isGstVerified = true;
    user.isOnboardingComplete = true;
    await user.save();

    return NextResponse.json({
      message: "GST details saved successfully",
      gstNumber: user.gstNumber,
      businessName: user.businessName,
      state: validation.state,
      isGstVerified: true,
      isOnboardingComplete: true,
    });
  } catch (error) {
    console.error("GST submission error:", error);
    return NextResponse.json(
      { error: "Failed to save GST details" },
      { status: 500 }
    );
  }
}

// PUT - Skip GST (complete onboarding without GST)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Complete onboarding without GST
    user.isOnboardingComplete = true;
    user.isGstVerified = false;
    await user.save();

    return NextResponse.json({
      message: "Onboarding completed",
      isOnboardingComplete: true,
      isGstVerified: false,
    });
  } catch (error) {
    console.error("Skip GST error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}

// GET - Validate GST number format (public endpoint for real-time validation)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gstNumber = searchParams.get("gst");

  if (!gstNumber) {
    return NextResponse.json(
      { error: "GST number is required" },
      { status: 400 }
    );
  }

  const validation = validateGSTNumber(gstNumber);

  return NextResponse.json({
    valid: validation.valid,
    error: validation.error,
    state: validation.state,
  });
}

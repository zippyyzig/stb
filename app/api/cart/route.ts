import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import User from "@/models/User";

// GET user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const cart = await Cart.findOne({ user: session.user.id }).populate({
      path: "items.product",
      select: "name slug images priceB2C priceB2B mrp stock brand",
    });

    if (!cart) {
      return NextResponse.json({ items: [], total: 0, isB2B: false });
    }

    // Get user's GST verification status for pricing
    const user = await User.findById(session.user.id);
    const isB2B = user?.isGstVerified === true;
    
    type PopulatedCartItem = {
      product: {
        _id: string;
        name: string;
        slug: string;
        images?: string[];
        priceB2C: number;
        priceB2B: number;
        mrp: number;
        stock: number;
        brand?: string;
      };
      quantity: number;
      addedAt: Date;
    };

    const items = (cart.items as unknown as PopulatedCartItem[]).map((item) => {
      const price = isB2B ? item.product.priceB2B : item.product.priceB2C;
      return {
        product: item.product,
        quantity: item.quantity,
        price,
        total: price * item.quantity,
      };
    });

    const total = items.reduce((sum: number, item: { total: number }) => sum + item.total, 0);

    return NextResponse.json({ items, total, isB2B });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: session.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        (item: { product: { toString: () => string } }) => item.product.toString() === productId
      );

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          return NextResponse.json(
            { error: "Cannot add more than available stock" },
            { status: 400 }
          );
        }
        existingItem.quantity = newQuantity;
      } else {
        // Add new item
        cart.items.push({ product: productId, quantity, addedAt: new Date() });
      }

      await cart.save();
    }

    return NextResponse.json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

// PUT update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (quantity <= 0) {
      // Remove item from cart
      cart.items = cart.items.filter(
        (item: { product: { toString: () => string } }) => item.product.toString() !== productId
      );
    } else {
      // Update quantity
      const product = await Product.findById(productId);
      if (!product || product.stock < quantity) {
        return NextResponse.json(
          { error: "Insufficient stock" },
          { status: 400 }
        );
      }

      const item = cart.items.find(
        (item: { product: { toString: () => string } }) => item.product.toString() === productId
      );
      if (item) {
        item.quantity = quantity;
      }
    }

    await cart.save();

    return NextResponse.json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE clear cart or remove item
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    await dbConnect();

    const cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (productId) {
      // Remove specific item
      cart.items = cart.items.filter(
        (item: { product: { toString: () => string } }) => item.product.toString() !== productId
      );
      await cart.save();
      return NextResponse.json({ message: "Item removed from cart" });
    } else {
      // Clear entire cart
      await Cart.deleteOne({ user: session.user.id });
      return NextResponse.json({ message: "Cart cleared" });
    }
  } catch (error) {
    console.error("Error deleting from cart:", error);
    return NextResponse.json(
      { error: "Failed to delete from cart" },
      { status: 500 }
    );
  }
}

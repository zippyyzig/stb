import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Cart from "@/models/Cart";
import User from "@/models/User";
import { sendEmail, COMPANY_EMAIL } from "@/lib/email";
import { orderConfirmationTemplate, newOrderNotificationTemplate } from "@/lib/email-templates";

// GET user's orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST create order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      items,
      shippingAddress,
      billingAddress,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      notes,
    } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify stock availability and update stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.name}` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name}` },
          { status: 400 }
        );
      }
    }

    // Create order items with SKU
    const orderItems = await Promise.all(
      items.map(async (item: {
        product: string;
        name: string;
        price: number;
        quantity: number;
        total: number;
        image?: string;
      }) => {
        const product = await Product.findById(item.product);
        return {
          product: item.product,
          name: item.name,
          sku: product?.sku || "N/A",
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
        };
      })
    );

    // Create order
    const order = await Order.create({
      user: session.user.id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      subtotal,
      shippingCost,
      tax: 0,
      discount: 0,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      status: "pending",
      notes,
    });

    // Update product stock and sold count
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      });
    }

    // Clear user's cart
    await Cart.deleteOne({ user: session.user.id });

    // Send order confirmation email to customer
    const customer = await User.findById(session.user.id);
    if (customer) {
      const orderDate = new Date().toLocaleDateString("en-IN", { dateStyle: "full" });
      const shippingAddressStr = `${shippingAddress.fullName}\n${shippingAddress.address}\n${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}\n${shippingAddress.country}\nPhone: ${shippingAddress.phone}`;
      
      const confirmationEmail = orderConfirmationTemplate(
        customer.name,
        order.orderNumber,
        orderDate,
        orderItems.map((item: { name: string; quantity: number; price: number }) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shippingCost,
        0, // tax
        total,
        shippingAddressStr
      );
      
      await sendEmail({
        to: customer.email,
        subject: `Order Confirmed - ${order.orderNumber}`,
        html: confirmationEmail,
      });

      // Send new order notification to admin
      const adminNotification = newOrderNotificationTemplate(
        order.orderNumber,
        customer.name,
        customer.email,
        total,
        orderItems.length,
        orderDate
      );
      
      await sendEmail({
        to: COMPANY_EMAIL,
        subject: `New Order Received - ${order.orderNumber}`,
        html: adminNotification,
      });
    }

    // If Razorpay, create order and return orderId
    if (paymentMethod === "razorpay") {
      // TODO: Initialize Razorpay payment
      // For now, just return the order
    }

    return NextResponse.json(
      { message: "Order placed successfully", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

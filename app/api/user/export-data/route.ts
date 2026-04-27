import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import Review from "@/models/Review";
import Ticket from "@/models/Ticket";

// GET - Export all user data (GDPR / App Store compliance)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userId = session.user.id;

    // Fetch all user data in parallel
    const [user, orders, reviews, tickets] = await Promise.all([
      User.findById(userId)
        .select("-password -__v")
        .lean(),
      Order.find({ user: userId })
        .select("-__v")
        .lean(),
      Review.find({ user: userId })
        .select("-__v")
        .lean(),
      Ticket.find({ user: userId })
        .select("-__v")
        .lean(),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Construct data export
    const exportData = {
      exportDate: new Date().toISOString(),
      exportVersion: "1.0",
      user: {
        profile: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isB2B: user.isB2B,
          businessName: user.businessName,
          businessType: user.businessType,
          gstin: user.gstin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        addresses: user.addresses || [],
        notificationPreferences: user.notificationPreferences || {},
      },
      orders: orders.map((order) => ({
        id: order._id,
        orderId: order.orderId,
        status: order.status,
        items: order.items,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      reviews: reviews.map((review) => ({
        id: review._id,
        productId: review.product,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        createdAt: review.createdAt,
      })),
      supportTickets: tickets.map((ticket) => ({
        id: ticket._id,
        ticketId: ticket.ticketId,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status,
        messages: ticket.messages,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      })),
      dataCategories: {
        personalInfo: ["name", "email", "phone", "addresses"],
        orderHistory: ["orders", "payments", "shipping"],
        userContent: ["reviews", "support tickets"],
        preferences: ["notification settings"],
      },
    };

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="smarttechbazaar-data-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting user data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}

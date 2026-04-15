import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const assignedTo = searchParams.get("assignedTo");

    const query: Record<string, unknown> = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (category) {
      query.category = category;
    }

    if (assignedTo === "me") {
      query.assignedTo = session.user.id;
    } else if (assignedTo === "unassigned") {
      query.assignedTo = { $exists: false };
    }

    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      Ticket.find(query)
        .populate("user", "name email avatar")
        .populate("assignedTo", "name email avatar")
        .populate("order", "orderNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Ticket.countDocuments(query),
    ]);

    // Get status counts
    const statusCounts = await Ticket.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const counts = {
      all: total,
      open: 0,
      in_progress: 0,
      waiting_customer: 0,
      resolved: 0,
      closed: 0,
    };

    statusCounts.forEach((s) => {
      counts[s._id as keyof typeof counts] = s.count;
    });

    return NextResponse.json({
      tickets,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      counts,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

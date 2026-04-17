import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import User from "@/models/User";

// GET all tickets
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || !["admin", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const assignedTo = searchParams.get("assignedTo") || "";

    const query: Record<string, unknown> = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (priority && priority !== "all") {
      query.priority = priority;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (assignedTo && assignedTo !== "all") {
      if (assignedTo === "unassigned") {
        query.assignedTo = { $exists: false };
      } else {
        query.assignedTo = assignedTo;
      }
    }

    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [tickets, total, statusCounts] = await Promise.all([
      Ticket.find(query)
        .populate("customer", "name email")
        .populate("assignedTo", "name email")
        .populate("order", "orderNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Ticket.countDocuments(query),
      Ticket.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const stats = {
      total: await Ticket.countDocuments(),
      open: statusCounts.find((s) => s._id === "open")?.count || 0,
      inProgress: statusCounts.find((s) => s._id === "in_progress")?.count || 0,
      resolved: statusCounts.find((s) => s._id === "resolved")?.count || 0,
      closed: statusCounts.find((s) => s._id === "closed")?.count || 0,
    };

    return NextResponse.json({
      tickets,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

// POST create new ticket (admin creating on behalf of customer)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || !["admin", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    await dbConnect();

    // Generate ticket number
    const lastTicket = await Ticket.findOne().sort({ createdAt: -1 });
    const ticketNumber = lastTicket
      ? `TKT-${String(parseInt(lastTicket.ticketNumber.split("-")[1]) + 1).padStart(6, "0")}`
      : "TKT-000001";

    const ticket = await Ticket.create({
      ticketNumber,
      customer: data.customer,
      subject: data.subject,
      description: data.description,
      category: data.category,
      priority: data.priority || "medium",
      status: "open",
      order: data.order || undefined,
      assignedTo: data.assignedTo || undefined,
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("customer", "name email")
      .populate("assignedTo", "name email")
      .lean();

    return NextResponse.json({
      message: "Ticket created successfully",
      ticket: populatedTicket,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}

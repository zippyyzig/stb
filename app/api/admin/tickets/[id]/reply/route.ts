import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST add reply to ticket
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || !["admin", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, isInternal } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const reply = {
      user: session.user.id,
      message: message.trim(),
      isInternal: isInternal || false,
      createdAt: new Date(),
    };

    ticket.replies.push(reply);
    ticket.lastReplyAt = new Date();
    ticket.updatedAt = new Date();

    // If ticket is open and admin replies, change to in_progress
    if (ticket.status === "open") {
      ticket.status = "in_progress";
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(id)
      .populate("customer", "name email phone")
      .populate("assignedTo", "name email")
      .populate("replies.user", "name email role")
      .lean();

    return NextResponse.json({
      message: "Reply added successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
}

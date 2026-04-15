import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const ticket = await Ticket.findById(id)
      .populate("user", "name email phone avatar")
      .populate("assignedTo", "name email avatar")
      .populate("order", "orderNumber total status")
      .lean();

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Prepare update object
    const updateData: Record<string, unknown> = {};

    if (body.status) {
      updateData.status = body.status;
      
      if (body.status === "resolved") {
        updateData.resolvedAt = new Date();
      } else if (body.status === "closed") {
        updateData.closedAt = new Date();
      }
    }

    if (body.priority) {
      updateData.priority = body.priority;
    }

    if (body.category) {
      updateData.category = body.category;
    }

    if (body.assignedTo !== undefined) {
      updateData.assignedTo = body.assignedTo || null;
    }

    if (body.tags) {
      updateData.tags = body.tags;
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    )
      .populate("user", "name email phone avatar")
      .populate("assignedTo", "name email avatar")
      .populate("order", "orderNumber total status");

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}

// Add a reply to the ticket
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    if (!body.message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      sender: session.user.id,
      senderRole: session.user.role,
      senderName: session.user.name,
      message: body.message,
      attachments: body.attachments || [],
      isInternal: body.isInternal || false,
      createdAt: new Date(),
    };

    ticket.messages.push(newMessage);
    ticket.lastReplyAt = new Date();
    ticket.lastReplyBy = "admin";

    // Auto-update status if it's 'open' and admin replies
    if (ticket.status === "open") {
      ticket.status = "in_progress";
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(id)
      .populate("user", "name email phone avatar")
      .populate("assignedTo", "name email avatar")
      .populate("order", "orderNumber total status");

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admins can delete tickets" },
        { status: 403 }
      );
    }

    await dbConnect();
    const { id } = await params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    await Ticket.findByIdAndDelete(id);

    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}

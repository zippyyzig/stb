import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single ticket
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || !["admin", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const ticket = await Ticket.findById(id)
      .populate("customer", "name email phone")
      .populate("assignedTo", "name email")
      .populate("order", "orderNumber total status")
      .populate("replies.user", "name email role")
      .lean();

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

// PUT update ticket
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || !["admin", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    await dbConnect();

    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    };

    // Track status changes
    if (data.status) {
      const ticket = await Ticket.findById(id);
      if (ticket && ticket.status !== data.status) {
        if (data.status === "resolved" && !ticket.resolvedAt) {
          updateData.resolvedAt = new Date();
        }
        if (data.status === "closed" && !ticket.closedAt) {
          updateData.closedAt = new Date();
        }
      }
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate("customer", "name email")
      .populate("assignedTo", "name email")
      .lean();

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}

// DELETE ticket (super_admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}

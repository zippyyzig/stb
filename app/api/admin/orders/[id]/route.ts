import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import InventoryLog from "@/models/Inventory";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const order = await Order.findById(id)
      .populate("user", "name email phone avatar createdAt")
      .lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    await dbConnect();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const {
      status,
      paymentStatus,
      trackingNumber,
      trackingUrl,
      estimatedDelivery,
      notes,
      cancellationReason,
    } = body;

    // Handle status transitions
    if (status && status !== order.status) {
      // Validate status transition
      const validTransitions: Record<string, string[]> = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["processing", "cancelled"],
        processing: ["shipped", "cancelled"],
        shipped: ["delivered", "returned"],
        delivered: ["returned"],
        cancelled: [],
        returned: [],
      };

      if (!validTransitions[order.status]?.includes(status)) {
        return NextResponse.json(
          { error: `Cannot transition from ${order.status} to ${status}` },
          { status: 400 }
        );
      }

      order.status = status;

      // Handle specific status changes
      if (status === "delivered") {
        order.deliveredAt = new Date();
      }

      if (status === "cancelled") {
        order.cancelledAt = new Date();
        order.cancellationReason = cancellationReason || "Cancelled by admin";

        // Restore inventory for cancelled orders
        const dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        try {
          for (const item of order.items) {
            await Product.findByIdAndUpdate(
              item.product,
              { $inc: { stock: item.quantity } },
              { session: dbSession }
            );

            await InventoryLog.create(
              [
                {
                  product: item.product,
                  type: "adjustment",
                  quantity: item.quantity,
                  reason: `Order ${order.orderNumber} cancelled - inventory restored`,
                  reference: order._id,
                  performedBy: new mongoose.Types.ObjectId(session.user.id),
                },
              ],
              { session: dbSession }
            );
          }

          await dbSession.commitTransaction();
        } catch (err) {
          await dbSession.abortTransaction();
          throw err;
        } finally {
          dbSession.endSession();
        }
      }
    }

    // Update payment status
    if (paymentStatus && paymentStatus !== order.paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    // Update tracking info
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (trackingUrl !== undefined) order.trackingUrl = trackingUrl;
    if (estimatedDelivery !== undefined)
      order.estimatedDelivery = new Date(estimatedDelivery);
    if (notes !== undefined) order.notes = notes;

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("user", "name email phone avatar")
      .lean();

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only super_admin can delete orders
    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admin can delete orders" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await dbConnect();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Don't allow deleting orders that are shipped or delivered
    if (["shipped", "delivered"].includes(order.status)) {
      return NextResponse.json(
        { error: "Cannot delete shipped or delivered orders" },
        { status: 400 }
      );
    }

    await Order.findByIdAndDelete(id);

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import InventoryLog from "@/models/InventoryLog";
import Notification from "@/models/Notification";
import { sendEmail } from "@/lib/email";
import { orderStatusUpdateTemplate, refundProcessedTemplate } from "@/lib/email-templates";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single order
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const order = await Order.findById(id)
      .populate("user", "name email phone avatar createdAt")
      .populate("items.product", "name images slug")
      .lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      order: JSON.parse(JSON.stringify(order)),
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT update order
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    await dbConnect();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const previousStatus = order.status;
    const previousPaymentStatus = order.paymentStatus;

    // Update order fields
    if (data.status) {
      order.status = data.status;

      if (data.status === "delivered" && !order.deliveredAt) {
        order.deliveredAt = new Date();
      }

      if (data.status === "cancelled" && !order.cancelledAt) {
        order.cancelledAt = new Date();
        order.cancellationReason = data.cancellationReason || "Cancelled by admin";

        // Restore stock for cancelled orders
        if (previousStatus !== "cancelled") {
          for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
              const previousStock = product.stock;
              product.stock += item.quantity;
              await product.save();

              await InventoryLog.create({
                product: product._id,
                productName: product.name,
                productSku: product.sku,
                actionType: "return",
                quantityChange: item.quantity,
                previousStock,
                newStock: product.stock,
                reason: `Order ${order.orderNumber} cancelled`,
                order: order._id,
                performedBy: session.user.id,
                performedByName: session.user.name,
              });
            }
          }
        }
      }
    }

    if (data.paymentStatus) {
      order.paymentStatus = data.paymentStatus;

      // Create notification for payment status changes
      if (data.paymentStatus !== previousPaymentStatus) {
        await Notification.create({
          user: order.user,
          type: "payment",
          title: "Payment Status Updated",
          message: `Payment for order #${order.orderNumber} is now ${data.paymentStatus}`,
          link: `/dashboard/orders/${order._id}`,
        });
      }
    }

    if (data.trackingNumber !== undefined) {
      order.trackingNumber = data.trackingNumber;
    }

    if (data.trackingUrl !== undefined) {
      order.trackingUrl = data.trackingUrl;
    }

    if (data.estimatedDelivery) {
      order.estimatedDelivery = new Date(data.estimatedDelivery);
    }

    if (data.notes !== undefined) {
      order.notes = data.notes;
    }

    order.updatedAt = new Date();
    await order.save();

    // Create notification for status changes
    if (data.status && data.status !== previousStatus) {
      await Notification.create({
        user: order.user,
        type: "order",
        title: "Order Status Updated",
        message: `Your order #${order.orderNumber} is now ${data.status}`,
        link: `/dashboard/orders/${order._id}`,
      });

      // Send email notification for status change
      const customer = await User.findById(order.user);
      if (customer) {
        const emailHtml = orderStatusUpdateTemplate(
          customer.name,
          order.orderNumber,
          data.status,
          order.trackingNumber || undefined,
          order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { dateStyle: "full" }) : undefined,
          data.notes || undefined
        );
        await sendEmail({
          to: customer.email,
          subject: `Order ${order.orderNumber} - ${data.status.replace("_", " ").toUpperCase()}`,
          html: emailHtml,
        });

        // If order is refunded, send refund email
        if (data.status === "refunded" || data.paymentStatus === "refunded") {
          const refundEmail = refundProcessedTemplate(
            customer.name,
            order.orderNumber,
            order.total,
            data.cancellationReason || "Customer request",
            "Original payment method"
          );
          await sendEmail({
            to: customer.email,
            subject: `Refund Processed - Order ${order.orderNumber}`,
            html: refundEmail,
          });
        }
      }
    }

    return NextResponse.json({
      message: "Order updated successfully",
      order: JSON.parse(JSON.stringify(order)),
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE order (super_admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only Super Admin can delete orders" },
        { status: 403 }
      );
    }

    await dbConnect();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only allow deletion of cancelled orders
    if (order.status !== "cancelled") {
      return NextResponse.json(
        { error: "Only cancelled orders can be deleted" },
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

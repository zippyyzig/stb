import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import bcrypt from "bcryptjs";

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

    const customer = await User.findOne({ _id: id, role: "customer" })
      .select("-password")
      .lean();

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Get order stats
    const orderStats = await Order.aggregate([
      { $match: { user: customer._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$total" },
        },
      },
    ]);

    return NextResponse.json({
      ...customer,
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalSpent: orderStats[0]?.totalSpent || 0,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
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

    const customer = await User.findOne({ _id: id, role: "customer" });
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Prepare update object
    const updateData: Record<string, unknown> = {};

    // Only super_admin can update password
    if (body.password && session.user.role === "super_admin") {
      if (customer.googleId) {
        return NextResponse.json(
          { error: "Cannot reset password for Google-authenticated users" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    // Update status
    if (typeof body.isActive === "boolean") {
      updateData.isActive = body.isActive;
    }

    // Update basic info
    if (body.name) updateData.name = body.name;
    if (body.phone !== undefined) updateData.phone = body.phone;

    const updatedCustomer = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
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
        { error: "Only super admins can delete customers" },
        { status: 403 }
      );
    }

    await dbConnect();
    const { id } = await params;

    const customer = await User.findOne({ _id: id, role: "customer" });
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Check if customer has orders
    const orderCount = await Order.countDocuments({ user: id });
    if (orderCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete customer with existing orders" },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}

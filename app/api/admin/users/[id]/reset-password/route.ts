import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST - Generate password reset or set new password
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Only super_admin can reset passwords
    if (session?.user?.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, newPassword } = await request.json();

    await dbConnect();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "generate_temp") {
      // Generate a temporary password
      const tempPassword = crypto.randomBytes(8).toString("hex");
      const hashedPassword = await bcrypt.hash(tempPassword, 12);

      await User.findByIdAndUpdate(id, {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date(),
      });

      return NextResponse.json({
        message: "Temporary password generated",
        tempPassword,
      });
    } else if (action === "set_password" && newPassword) {
      // Set a specific new password
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await User.findByIdAndUpdate(id, {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date(),
      });

      return NextResponse.json({
        message: "Password updated successfully",
      });
    } else if (action === "generate_link") {
      // Generate a password reset token/link
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      await User.findByIdAndUpdate(id, {
        passwordResetToken: hashedToken,
        passwordResetExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        updatedAt: new Date(),
      });

      // In production, you would send this via email
      const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

      return NextResponse.json({
        message: "Password reset link generated",
        resetLink,
        expiresIn: "24 hours",
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}

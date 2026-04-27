import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// DELETE user account (Apple Guideline 5.1.1 compliance)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password, confirmDeletion } = await request.json();

    if (!confirmDeletion) {
      return NextResponse.json(
        { error: "Please confirm account deletion" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // For users who signed up with email/password, verify password
    if (user.password && !user.googleId) {
      if (!password) {
        return NextResponse.json(
          { error: "Password is required to delete your account" },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Incorrect password" },
          { status: 400 }
        );
      }
    }

    // Soft delete - deactivate account and anonymize personal data
    // This approach is preferred for legal/compliance reasons while still
    // honoring the user's deletion request
    await User.findByIdAndUpdate(session.user.id, {
      isActive: false,
      email: `deleted_${session.user.id}@deleted.local`,
      name: "Deleted User",
      phone: null,
      avatar: null,
      googleId: null,
      password: null,
      addresses: [],
      gstNumber: null,
      businessName: null,
      businessType: null,
      isEmailVerified: false,
      isOnboardingComplete: false,
      deletedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Your account has been deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again or contact support." },
      { status: 500 }
    );
  }
}

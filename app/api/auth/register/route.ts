import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail, COMPANY_EMAIL } from "@/lib/email";
import { welcomeEmailTemplate, newUserNotificationTemplate } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: "customer",
      isActive: true,
    });

    // Send welcome email to customer
    const welcomeEmail = welcomeEmailTemplate(name);
    await sendEmail({
      to: email.toLowerCase(),
      subject: `Welcome to SabKaTechBazar, ${name}!`,
      html: welcomeEmail,
    });

    // Send notification email to admin
    const registrationDate = new Date().toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
    });
    const adminNotification = newUserNotificationTemplate(name, email.toLowerCase(), registrationDate);
    await sendEmail({
      to: COMPANY_EMAIL,
      subject: `New User Registration: ${name}`,
      html: adminNotification,
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}

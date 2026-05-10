import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sign } from "jsonwebtoken";

/**
 * Median.co Social Login Server-Side Redirect Handler
 * 
 * When using redirectUri mode, Median POSTs the Google tokens to this endpoint.
 * We verify the token and create/update the user, then redirect back to the app.
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    
    let data: Record<string, string>;
    
    // Median may send as form data or JSON
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries()) as Record<string, string>;
    } else {
      data = await request.json();
    }
    
    console.log("[Median Google Auth] Received data:", JSON.stringify(data, null, 2));
    
    // Extract user info from the token data
    // Median sends: idToken, accessToken, email, name, etc.
    const { 
      idToken, 
      accessToken, 
      email, 
      name, 
      givenName, 
      familyName,
      picture,
      userId,
      id,
      sub 
    } = data;
    
    if (!email) {
      console.error("[Median Google Auth] No email in response");
      return NextResponse.redirect(
        new URL("/auth/login?error=NoEmail", request.url)
      );
    }
    
    const googleId = userId || id || sub || email;
    const displayName = name || `${givenName || ""} ${familyName || ""}`.trim() || email.split("@")[0];
    
    await dbConnect();
    
    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (user) {
      // Update existing user with Google info if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = user.avatar || picture;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        email: email.toLowerCase(),
        name: displayName,
        googleId: googleId,
        avatar: picture,
        isVerified: true, // Google accounts are verified
        role: "customer",
      });
    }
    
    // Create a session token
    const token = sign(
      { 
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );
    
    // Redirect back to the app with the token
    // The app will then use this token to create a NextAuth session
    const redirectUrl = new URL("/auth/callback", request.url);
    redirectUrl.searchParams.set("token", token);
    redirectUrl.searchParams.set("email", user.email);
    redirectUrl.searchParams.set("name", user.name);
    redirectUrl.searchParams.set("userId", user._id.toString());
    
    console.log("[Median Google Auth] Success, redirecting:", redirectUrl.pathname);
    
    return NextResponse.redirect(redirectUrl);
    
  } catch (error) {
    console.error("[Median Google Auth] Error:", error);
    return NextResponse.redirect(
      new URL("/auth/login?error=ServerError", request.url)
    );
  }
}

// Also handle GET for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get("error");
  
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
  
  return NextResponse.json({ 
    message: "Median Google Auth endpoint. Use POST to authenticate.",
    usage: "Configure redirectUri in Median Social Login to point here."
  });
}

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./mongodb";
import User, { type UserRole } from "@/models/User";

declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.password) {
          throw new Error("Please sign in with Google");
        }

        if (!user.isActive) {
          throw new Error("Your account has been deactivated");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar,
        };
      },
    }),
    CredentialsProvider({
      id: "google-firebase",
      name: "Google",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
        googleId: { label: "Google ID", type: "text" },
        avatar: { label: "Avatar", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.googleId) {
          throw new Error("Google authentication failed");
        }

        await dbConnect();

        let user = await User.findOne({
          $or: [
            { googleId: credentials.googleId },
            { email: credentials.email.toLowerCase() },
          ],
        });

        if (!user) {
          // Create new customer account for Google sign-in
          user = await User.create({
            email: credentials.email.toLowerCase(),
            name: credentials.name || credentials.email.split("@")[0],
            googleId: credentials.googleId,
            avatar: credentials.avatar,
            role: "customer",
            isActive: true,
          });
        } else if (!user.googleId) {
          // Link Google account to existing email account
          user.googleId = credentials.googleId;
          if (credentials.avatar && !user.avatar) {
            user.avatar = credentials.avatar;
          }
          await user.save();
        }

        if (!user.isActive) {
          throw new Error("Your account has been deactivated");
        }

        // Only customers can use Google sign-in
        if (user.role !== "customer") {
          throw new Error("Admins must use email/password to sign in");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

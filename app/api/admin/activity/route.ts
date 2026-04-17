import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";

// GET activity logs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only super_admin can view all activity logs
    if (session?.user?.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const action = searchParams.get("action") || "";
    const resource = searchParams.get("resource") || "";
    const userId = searchParams.get("user") || "";

    const query: Record<string, unknown> = {};

    if (action && action !== "all") {
      query.action = action;
    }

    if (resource && resource !== "all") {
      query.resource = resource;
    }

    if (userId && userId !== "all") {
      query.user = userId;
    }

    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      ActivityLog.find(query)
        .populate("user", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(query),
    ]);

    // Get unique actions and resources for filters
    const [actions, resources] = await Promise.all([
      ActivityLog.distinct("action"),
      ActivityLog.distinct("resource"),
    ]);

    return NextResponse.json({
      activities,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      filters: {
        actions,
        resources,
      },
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
}

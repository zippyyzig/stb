import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import User from "@/models/User";
import TicketsClient from "./TicketsClient";

interface TicketsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getTickets(searchParams: { [key: string]: string | string[] | undefined }, userId: string) {
  try {
    await dbConnect();

    const page = Number(searchParams.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const status = searchParams.status as string;
    const priority = searchParams.priority as string;
    const category = searchParams.category as string;
    const assignedTo = searchParams.assignedTo as string;
    const search = searchParams.search as string;

    const query: Record<string, unknown> = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (category) {
      query.category = category;
    }

    if (assignedTo === "me") {
      query.assignedTo = userId;
    } else if (assignedTo === "unassigned") {
      query.assignedTo = { $exists: false };
    }

    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const [tickets, total, statusCounts] = await Promise.all([
      Ticket.find(query)
        .populate("user", "name email avatar")
        .populate("assignedTo", "name email avatar")
        .populate("order", "orderNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Ticket.countDocuments(query),
      Ticket.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const counts = {
      all: await Ticket.countDocuments(),
      open: 0,
      in_progress: 0,
      waiting_customer: 0,
      resolved: 0,
      closed: 0,
    };

    statusCounts.forEach((s) => {
      counts[s._id as keyof typeof counts] = s.count;
    });

    return {
      tickets: JSON.parse(JSON.stringify(tickets)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      counts,
    };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return { tickets: [], total: 0, page: 1, totalPages: 1, counts: { all: 0, open: 0, in_progress: 0, waiting_customer: 0, resolved: 0, closed: 0 } };
  }
}

async function getAdminUsers() {
  try {
    await dbConnect();
    const admins = await User.find({ role: { $in: ["admin", "super_admin"] }, isActive: true })
      .select("name email")
      .lean();
    return JSON.parse(JSON.stringify(admins));
  } catch {
    return [];
  }
}

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;
  const data = await getTickets(params, session?.user.id || "");
  const adminUsers = await getAdminUsers();

  return (
    <TicketsClient
      {...data}
      adminUsers={adminUsers}
      currentUserId={session?.user.id || ""}
      currentFilters={{
        status: (params.status as string) || "all",
        priority: params.priority as string,
        category: params.category as string,
        assignedTo: params.assignedTo as string,
        search: params.search as string,
      }}
    />
  );
}

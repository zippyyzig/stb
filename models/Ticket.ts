import mongoose, { Schema, Document, Model } from "mongoose";

export type TicketStatus = "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory = "order" | "product" | "payment" | "shipping" | "return" | "technical" | "other";

export interface ITicketMessage {
  _id: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  senderRole: "customer" | "admin" | "super_admin";
  senderName: string;
  message: string;
  attachments?: string[];
  isInternal: boolean; // Internal notes only visible to admins
  createdAt: Date;
}

export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId;
  ticketNumber: string;
  user: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  messages: ITicketMessage[];
  assignedTo?: mongoose.Types.ObjectId;
  tags: string[];
  lastReplyAt?: Date;
  lastReplyBy?: "customer" | "admin";
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TicketMessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderRole: {
    type: String,
    enum: ["customer", "admin", "super_admin"],
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  attachments: [{
    type: String,
  }],
  isInternal: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TicketSchema = new Schema<ITicket>(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["order", "product", "payment", "shipping", "return", "technical", "other"],
      default: "other",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "waiting_customer", "resolved", "closed"],
      default: "open",
    },
    messages: [TicketMessageSchema],
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tags: [{
      type: String,
      lowercase: true,
      trim: true,
    }],
    lastReplyAt: Date,
    lastReplyBy: {
      type: String,
      enum: ["customer", "admin"],
    },
    resolvedAt: Date,
    closedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Create indexes
TicketSchema.index({ ticketNumber: 1 });
TicketSchema.index({ user: 1 });
TicketSchema.index({ order: 1 });
TicketSchema.index({ status: 1 });
TicketSchema.index({ priority: 1 });
TicketSchema.index({ category: 1 });
TicketSchema.index({ assignedTo: 1 });
TicketSchema.index({ createdAt: -1 });

// Generate ticket number before saving
TicketSchema.pre("save", async function (next) {
  if (this.isNew && !this.ticketNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");
    this.ticketNumber = `TKT${year}${month}${random}`;
  }
  next();
});

const Ticket: Model<ITicket> =
  mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);

export default Ticket;

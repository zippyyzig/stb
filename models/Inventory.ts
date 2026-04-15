import mongoose, { Schema, Document, Model } from "mongoose";

export type InventoryChangeType = 
  | "stock_in" 
  | "stock_out" 
  | "adjustment" 
  | "order_placed" 
  | "order_cancelled" 
  | "return" 
  | "damaged" 
  | "expired";

export interface IInventoryLog extends Document {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  type: InventoryChangeType;
  quantity: number; // Positive for additions, negative for deductions
  previousStock: number;
  newStock: number;
  reason?: string;
  reference?: string; // Order ID or other reference
  performedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const InventoryLogSchema = new Schema<IInventoryLog>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "stock_in",
        "stock_out",
        "adjustment",
        "order_placed",
        "order_cancelled",
        "return",
        "damaged",
        "expired",
      ],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    reference: {
      type: String,
      trim: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
InventoryLogSchema.index({ product: 1 });
InventoryLogSchema.index({ type: 1 });
InventoryLogSchema.index({ performedBy: 1 });
InventoryLogSchema.index({ createdAt: -1 });

const InventoryLog: Model<IInventoryLog> =
  mongoose.models.InventoryLog ||
  mongoose.model<IInventoryLog>("InventoryLog", InventoryLogSchema);

export default InventoryLog;

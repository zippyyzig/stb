export type FkVariant = "blue" | "purple" | "festive";

export const FK_GRADIENTS: Record<FkVariant, string> = {
  blue: "bg-gradient-to-b from-[#2F67EE] to-[#5F86F7]",
  purple: "bg-gradient-to-b from-[#7A35F0] to-[#A15BF6]",
  festive: "bg-gradient-to-br from-[#3B0F5C] via-[#7A1FA2] to-[#E0661A]",
};

export const FK_PILLS: Record<FkVariant, string> = {
  blue: "bg-[#2A55D8]",
  purple: "bg-[#6425D8]",
  festive: "bg-[#4A1470]",
};

export const formatInr = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

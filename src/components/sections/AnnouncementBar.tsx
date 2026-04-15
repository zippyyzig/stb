const announcements = [
  "🚀 Free Shipping on orders above ₹5,000",
  "📦 Same Day Dispatch | Orders before 4 PM",
  "🏷️ GST Invoice Available on all orders",
  "💼 B2B & B2C Orders Welcome",
  "🌟 10,000+ Products In Stock",
  "🔒 100% Secure Payment Gateway",
  "🎯 Dealer & Reseller Pricing Available",
  "⚡ Next Day Delivery in Jaipur",
];

export default function AnnouncementBar() {
  const text = announcements.join("   ✦   ");
  // Duplicate for seamless loop
  const doubled = `${text}   ✦   ${text}`;

  return (
    <div className="overflow-hidden bg-primary py-2 text-white">
      <div className="announcement-track whitespace-nowrap">
        <span className="body-sm inline-block font-medium tracking-wide">
          {doubled}
        </span>
      </div>
    </div>
  );
}

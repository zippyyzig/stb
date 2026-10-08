const BULB_COLORS = ["#FF3B30", "#FFD60A", "#34C759", "#0A84FF", "#FF9F0A", "#BF5AF2"];

interface FestiveLightsProps {
  count?: number;
  className?: string;
}

export default function FestiveLights({ count = 28, className = "" }: FestiveLightsProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative flex h-4 w-full items-start justify-between overflow-hidden px-2 ${className}`}
    >
      <span className="absolute inset-x-0 top-0 h-px bg-[#8A6A1F]/40" />
      {Array.from({ length: count }).map((_, i) => {
        const color = BULB_COLORS[i % BULB_COLORS.length];
        return (
          <span
            key={i}
            className="fk-twinkle block h-2.5 w-1.5 rounded-b-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 2px 6px ${color}`,
              marginTop: i % 2 === 0 ? 1 : 3,
              animationDelay: `${(i % 6) * 0.3}s`,
            }}
          />
        );
      })}
    </div>
  );
}

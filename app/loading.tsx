import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Animated loader */}
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        </div>
        
        {/* Loading text */}
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}

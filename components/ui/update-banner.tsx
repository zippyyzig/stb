"use client";

import { RefreshCw, Loader2 } from "lucide-react";
import { useAppVersion } from "@/hooks/useAppVersion";
import { useState, useEffect } from "react";

/**
 * A banner that appears briefly when a new version is available.
 * The app will automatically refresh - this banner just informs the user.
 * Especially useful for mobile app wrappers that cache content aggressively.
 */
export function UpdateBanner() {
  const { updateAvailable, isChecking } = useAppVersion();
  const [show, setShow] = useState(false);

  // Show banner with slight delay for better UX
  useEffect(() => {
    if (updateAvailable) {
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [updateAvailable]);

  if (!show) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[100] animate-slide-down">
      <div className="mx-auto max-w-7xl px-3 py-2 md:px-4">
        <div className="flex items-center justify-center gap-3 rounded-xl bg-primary px-4 py-2.5 text-white shadow-lg">
          <div className="flex items-center gap-2.5">
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 animate-spin-slow" />
            )}
            <span className="text-xs font-medium md:text-sm">
              Updating to the latest version...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateBanner;

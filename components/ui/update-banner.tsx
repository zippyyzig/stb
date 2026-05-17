"use client";

import { RefreshCw, X, Loader2 } from "lucide-react";
import { useAppVersion } from "@/hooks/useAppVersion";
import { useState, useEffect } from "react";

/**
 * A banner that appears when a new version of the app is available.
 * Especially useful for mobile app wrappers that cache content aggressively.
 */
export function UpdateBanner() {
  const { updateAvailable, refresh, dismissUpdate, isChecking } = useAppVersion();
  const [show, setShow] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Show banner with slight delay for better UX
  useEffect(() => {
    if (updateAvailable) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [updateAvailable]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refresh();
  };

  const handleDismiss = () => {
    dismissUpdate();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[100] animate-slide-down">
      <div className="mx-auto max-w-7xl px-3 py-2 md:px-4">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-primary px-4 py-2.5 text-white shadow-lg">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="h-4 w-4 animate-spin-slow" />
            <span className="text-xs font-medium md:text-sm">
              A new version is available
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isChecking}
              className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold transition-colors hover:bg-white/30 press-active disabled:opacity-70"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Now"
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateBanner;

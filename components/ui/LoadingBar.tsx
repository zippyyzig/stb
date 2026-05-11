"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Routes that should show loading bar (major page navigations)
const MAJOR_ROUTE_PATTERNS = [
  /^\/$/,                          // Home page
  /^\/products/,                   // Products listing
  /^\/product\//,                  // Product detail
  /^\/category\//,                 // Category pages
  /^\/brand\//,                    // Brand pages
  /^\/brands$/,                    // Brands listing
  /^\/cart$/,                      // Cart page
  /^\/checkout$/,                  // Checkout page
  /^\/search/,                     // Search page
  /^\/wishlist$/,                  // Wishlist page
  /^\/dashboard/,                  // Dashboard pages
  /^\/admin/,                      // Admin pages
  /^\/auth\//,                     // Auth pages
  /^\/about$/,                     // About page
  /^\/privacy$/,                   // Privacy page
  /^\/terms$/,                     // Terms page
  /^\/shipping$/,                  // Shipping page
  /^\/order-success$/,             // Order success page
];

// Check if a route should trigger loading bar
function shouldShowLoadingBar(href: string, currentPath: string): boolean {
  // Extract the pathname from href (remove query string)
  const [hrefPath] = href.split("?");
  
  // Don't show for same page navigation
  if (hrefPath === currentPath) {
    return false;
  }
  
  // Check if it matches any major route pattern
  return MAJOR_ROUTE_PATTERNS.some(pattern => pattern.test(hrefPath));
}

export function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reset loading state when route changes complete
  useEffect(() => {
    setIsLoading(false);
    setProgress(0);
  }, [pathname, searchParams]);

  // Memoized handler for link clicks
  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");
    
    // Only trigger for internal page navigation links
    if (!link) return;
    
    const href = link.getAttribute("href");
    const targetAttr = link.getAttribute("target");
    
    // Skip if:
    // - No href
    // - External link (starts with http/https or has target="_blank")
    // - Anchor link (starts with #)
    // - Same page anchor (contains #)
    // - JavaScript link
    // - Download link
    // - API routes
    // - Has data-no-loading attribute
    if (!href) return;
    if (href.startsWith("http") || href.startsWith("//")) return;
    if (targetAttr === "_blank") return;
    if (href.startsWith("#")) return;
    if (href.includes("#")) return;
    if (href.startsWith("javascript:")) return;
    if (link.hasAttribute("download")) return;
    if (href.startsWith("/api/")) return;
    if (link.hasAttribute("data-no-loading")) return;
    
    // Only internal navigation starting with /
    if (!href.startsWith("/")) return;
    
    // Check if this is a major route that should show loading
    if (!shouldShowLoadingBar(href, pathname)) return;
    
    // Start loading for actual page navigation
    setIsLoading(true);
    setProgress(0);
  }, [pathname]);

  // Listen for click events
  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [handleClick]);

  // Animate progress while loading
  useEffect(() => {
    if (!isLoading) return;

    // Fast initial progress, then slow down
    const intervals = [
      { delay: 50, increment: 15 },   // 0-15% fast
      { delay: 100, increment: 10 },  // 15-25% 
      { delay: 150, increment: 8 },   // 25-33%
      { delay: 200, increment: 5 },   // 33-38%
      { delay: 300, increment: 3 },   // slower progress
      { delay: 500, increment: 2 },   // even slower
      { delay: 1000, increment: 1 },  // very slow near end
    ];

    let currentProgress = 0;
    let intervalIndex = 0;

    const updateProgress = () => {
      if (currentProgress >= 90) {
        // Stop at 90%, will complete when route changes
        return;
      }

      const { increment } = intervals[Math.min(intervalIndex, intervals.length - 1)];
      currentProgress = Math.min(currentProgress + increment, 90);
      setProgress(currentProgress);
      intervalIndex++;

      const nextDelay = intervals[Math.min(intervalIndex, intervals.length - 1)].delay;
      setTimeout(updateProgress, nextDelay);
    };

    const timer = setTimeout(updateProgress, 50);

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Complete animation when loading finishes
  useEffect(() => {
    if (!isLoading && progress > 0) {
      setProgress(100);
      const timer = setTimeout(() => {
        setProgress(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isLoading, progress]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
      <div
        className="h-full bg-primary transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 10px var(--primary), 0 0 5px var(--primary)",
        }}
      />
    </div>
  );
}

// Hook to manually trigger loading bar for programmatic navigation
export function useLoadingBar() {
  const [, setTrigger] = useState(0);
  
  const startLoading = useCallback(() => {
    // Dispatch a custom event that the LoadingBar can listen to
    window.dispatchEvent(new CustomEvent("loadingbar:start"));
  }, []);
  
  const stopLoading = useCallback(() => {
    window.dispatchEvent(new CustomEvent("loadingbar:stop"));
  }, []);
  
  return { startLoading, stopLoading, forceUpdate: () => setTrigger(n => n + 1) };
}

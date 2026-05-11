"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

// Routes that should show loading bar (major page navigations only)
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
  // Extract the pathname from href (remove query string and hash)
  const [hrefPath] = href.split(/[?#]/);
  
  // Don't show for same page navigation
  if (hrefPath === currentPath) {
    return false;
  }
  
  // Check if it matches any major route pattern
  return MAJOR_ROUTE_PATTERNS.some(pattern => pattern.test(hrefPath));
}

export function LoadingBar() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Refs to track state and prevent multiple triggers
  const isNavigatingRef = useRef(false);
  const lastPathnameRef = useRef(pathname);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function for timers
  const clearTimers = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Complete the loading bar and hide it
  const completeLoading = useCallback(() => {
    clearTimers();
    setProgress(100);
    
    // Hide after completion animation
    animationTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsLoading(false);
      setProgress(0);
      isNavigatingRef.current = false;
    }, 300);
  }, [clearTimers]);

  // Reset loading state when route actually changes
  useEffect(() => {
    // Only complete if the pathname actually changed
    if (lastPathnameRef.current !== pathname) {
      lastPathnameRef.current = pathname;
      
      // If we were loading, complete the animation
      if (isNavigatingRef.current || isLoading) {
        completeLoading();
      }
    }
  }, [pathname, isLoading, completeLoading]);

  // Handle link clicks
  const handleClick = useCallback((e: MouseEvent) => {
    // Prevent multiple triggers
    if (isNavigatingRef.current) return;
    
    const target = e.target as HTMLElement;
    const link = target.closest("a");
    
    if (!link) return;
    
    const href = link.getAttribute("href");
    const targetAttr = link.getAttribute("target");
    
    // Skip conditions
    if (!href) return;
    if (href.startsWith("http") || href.startsWith("//")) return;
    if (targetAttr === "_blank") return;
    if (href.startsWith("#")) return;
    if (href.includes("#") && href.split("#")[0] === pathname) return;
    if (href.startsWith("javascript:")) return;
    if (link.hasAttribute("download")) return;
    if (href.startsWith("/api/")) return;
    if (link.hasAttribute("data-no-loading")) return;
    if (!href.startsWith("/")) return;
    
    // Check if this is a major route
    if (!shouldShowLoadingBar(href, pathname)) return;
    
    // Start loading
    isNavigatingRef.current = true;
    clearTimers();
    setProgress(0);
    setIsVisible(true);
    setIsLoading(true);
  }, [pathname, clearTimers]);

  // Listen for click events
  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [handleClick]);

  // Animate progress while loading - single interval approach
  useEffect(() => {
    if (!isLoading) return;

    let currentProgress = 10;
    setProgress(currentProgress);

    // Use single interval with decreasing increments
    progressIntervalRef.current = setInterval(() => {
      if (currentProgress >= 90) {
        // Stop at 90%, will complete when route changes
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        return;
      }

      // Slow down as we progress
      const increment = currentProgress < 30 ? 8 : 
                        currentProgress < 50 ? 5 : 
                        currentProgress < 70 ? 3 : 1;
      
      currentProgress = Math.min(currentProgress + increment, 90);
      setProgress(currentProgress);
    }, 200);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // Safety timeout - if navigation takes too long, complete anyway
  useEffect(() => {
    if (!isLoading) return;
    
    const safetyTimeout = setTimeout(() => {
      if (isNavigatingRef.current) {
        completeLoading();
      }
    }, 8000); // 8 second max

    return () => clearTimeout(safetyTimeout);
  }, [isLoading, completeLoading]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent pointer-events-none">
      <div
        className="h-full bg-primary transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "200ms" : "300ms",
          boxShadow: "0 0 10px var(--primary), 0 0 5px var(--primary)",
        }}
      />
    </div>
  );
}

// Hook to manually trigger loading bar for programmatic navigation
export function useLoadingBar() {
  const startLoading = useCallback(() => {
    window.dispatchEvent(new CustomEvent("loadingbar:start"));
  }, []);
  
  const stopLoading = useCallback(() => {
    window.dispatchEvent(new CustomEvent("loadingbar:stop"));
  }, []);
  
  return { startLoading, stopLoading };
}

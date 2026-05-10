"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

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

  // Listen for click events on links and buttons
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      const button = target.closest("button");
      
      // Check if it's an internal link navigation
      if (link) {
        const href = link.getAttribute("href");
        // Only show loading for internal navigation, not external links or anchors
        if (href && href.startsWith("/") && !href.startsWith("/#")) {
          // Don't trigger for the same page
          if (href !== pathname && !href.startsWith(pathname + "#")) {
            startLoading();
          }
        }
      }
      
      // Check for buttons that might trigger loading (forms, actions)
      if (button && !button.disabled) {
        const type = button.getAttribute("type");
        const isSubmit = type === "submit";
        const hasLoadingClass = button.classList.contains("loading") || 
                               button.getAttribute("aria-busy") === "true";
        
        // Only show for submit buttons or buttons with loading state
        if (isSubmit && !hasLoadingClass) {
          startLoading();
        }
      }
    };

    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);
    };

    document.addEventListener("click", handleClick, true);
    
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname]);

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

"use client";

import { useEffect, useCallback, useState, useRef } from "react";

const STORAGE_KEY = "stb_app_version";
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes (reduced from 10)

/**
 * Hook to detect and automatically handle app version updates.
 * When a new version is detected, it automatically refreshes the page.
 */
export function useAppVersion() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const hasChecked = useRef(false);
  const isFirstLoad = useRef(true);
  const autoRefreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get the current version from the page's meta tag
  const getCurrentVersion = useCallback((): string | null => {
    if (typeof document === "undefined") return null;
    const meta = document.querySelector('meta[name="app-version"]');
    return meta?.getAttribute("content") || null;
  }, []);

  // Clear any cached data before refresh
  const clearCachesAndRefresh = useCallback(async () => {
    if (typeof window === "undefined") return;
    
    setIsChecking(true);
    
    const currentVersion = getCurrentVersion();
    if (currentVersion) {
      // Update stored version to current before reloading
      localStorage.setItem(STORAGE_KEY, currentVersion);
    }
    
    // Clear service worker caches
    if ("caches" in window) {
      try {
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      } catch {
        // Ignore cache clearing errors
      }
    }
    
    // Clear the update available state
    setUpdateAvailable(false);
    
    // Force hard reload - use clean base URL without query params
    const baseUrl = window.location.origin + window.location.pathname;
    const cleanUrl = baseUrl.endsWith("/") && baseUrl !== window.location.origin + "/" 
      ? baseUrl.slice(0, -1) 
      : baseUrl;
    window.location.replace(cleanUrl);
  }, [getCurrentVersion]);

  // Check if there's a new version available
  const checkForUpdate = useCallback(() => {
    if (typeof window === "undefined") return;
    
    const currentVersion = getCurrentVersion();
    if (!currentVersion) return;
    
    const storedVersion = localStorage.getItem(STORAGE_KEY);
    
    // If no stored version, this is first visit - store current and don't show banner
    if (!storedVersion) {
      localStorage.setItem(STORAGE_KEY, currentVersion);
      hasChecked.current = true;
      isFirstLoad.current = false;
      return;
    }
    
    // Compare versions - if different, trigger update
    if (storedVersion !== currentVersion) {
      // If it's the first load after a deployment, auto-refresh immediately
      // Otherwise, show the update banner briefly then auto-refresh
      if (isFirstLoad.current) {
        // First load with different version - auto-refresh after a brief delay
        // This gives the user a moment to see the update is happening
        setUpdateAvailable(true);
        
        // Auto-refresh after 2 seconds
        autoRefreshTimeoutRef.current = setTimeout(() => {
          clearCachesAndRefresh();
        }, 2000);
      } else {
        // Version changed while user was browsing - auto-refresh immediately
        // but only on visibility change or interval check (handled below)
        setUpdateAvailable(true);
        
        // Auto-refresh after 3 seconds
        autoRefreshTimeoutRef.current = setTimeout(() => {
          clearCachesAndRefresh();
        }, 3000);
      }
    }
    
    hasChecked.current = true;
    isFirstLoad.current = false;
  }, [getCurrentVersion, clearCachesAndRefresh]);

  // Manual refresh trigger
  const refresh = useCallback(() => {
    // Clear any pending auto-refresh
    if (autoRefreshTimeoutRef.current) {
      clearTimeout(autoRefreshTimeoutRef.current);
    }
    clearCachesAndRefresh();
  }, [clearCachesAndRefresh]);

  // Dismiss the update banner (will still auto-refresh)
  const dismissUpdate = useCallback(() => {
    const currentVersion = getCurrentVersion();
    if (currentVersion) {
      localStorage.setItem(STORAGE_KEY, currentVersion);
    }
    setUpdateAvailable(false);
    // Clear any pending auto-refresh
    if (autoRefreshTimeoutRef.current) {
      clearTimeout(autoRefreshTimeoutRef.current);
    }
  }, [getCurrentVersion]);

  // Initial check on mount
  useEffect(() => {
    // Delay check to ensure page is fully loaded
    const timer = setTimeout(checkForUpdate, 1500);
    return () => {
      clearTimeout(timer);
      // Clean up auto-refresh timeout on unmount
      if (autoRefreshTimeoutRef.current) {
        clearTimeout(autoRefreshTimeoutRef.current);
      }
    };
  }, [checkForUpdate]);

  // Periodic check for updates (for long-lived sessions)
  useEffect(() => {
    const interval = setInterval(() => {
      hasChecked.current = false;
      checkForUpdate();
    }, CHECK_INTERVAL);
    
    return () => clearInterval(interval);
  }, [checkForUpdate]);

  // Check for updates when app becomes visible (e.g., user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Reset and check again when user returns to the tab
        hasChecked.current = false;
        checkForUpdate();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [checkForUpdate]);

  return {
    updateAvailable,
    isChecking,
    refresh,
    dismissUpdate,
    checkForUpdate,
  };
}

export default useAppVersion;

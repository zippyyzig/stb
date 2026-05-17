"use client";

import { useEffect, useCallback, useState, useRef } from "react";

const STORAGE_KEY = "stb_app_version";
const CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes

/**
 * Hook to detect when a new version of the app is available.
 * Uses localStorage to persist the last known version and compare with current.
 */
export function useAppVersion() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const hasChecked = useRef(false);

  // Get the current version from the page's meta tag
  const getCurrentVersion = useCallback((): string | null => {
    if (typeof document === "undefined") return null;
    const meta = document.querySelector('meta[name="app-version"]');
    return meta?.getAttribute("content") || null;
  }, []);

  // Check if there's a new version available
  const checkForUpdate = useCallback(() => {
    if (typeof window === "undefined" || hasChecked.current) return;
    
    const currentVersion = getCurrentVersion();
    if (!currentVersion) return;
    
    const storedVersion = localStorage.getItem(STORAGE_KEY);
    
    // If no stored version, this is first visit - store current and don't show banner
    if (!storedVersion) {
      localStorage.setItem(STORAGE_KEY, currentVersion);
      hasChecked.current = true;
      return;
    }
    
    // Compare versions - if different, show update banner
    if (storedVersion !== currentVersion) {
      setUpdateAvailable(true);
    }
    
    hasChecked.current = true;
  }, [getCurrentVersion]);

  // Refresh and update stored version
  const refresh = useCallback(() => {
    if (typeof window === "undefined") return;
    
    setIsChecking(true);
    
    const currentVersion = getCurrentVersion();
    if (currentVersion) {
      // Update stored version to current before reloading
      localStorage.setItem(STORAGE_KEY, currentVersion);
    }
    
    // Clear service worker caches
    if ("caches" in window) {
      caches.keys().then((names) => {
        Promise.all(names.map((name) => caches.delete(name)));
      });
    }
    
    // Clear the update available state
    setUpdateAvailable(false);
    
    // Force hard reload - use clean base URL without query params
    const baseUrl = window.location.origin + window.location.pathname;
    // Remove trailing slash for consistency, then reload
    const cleanUrl = baseUrl.endsWith("/") && baseUrl !== window.location.origin + "/" 
      ? baseUrl.slice(0, -1) 
      : baseUrl;
    window.location.replace(cleanUrl);
  }, [getCurrentVersion]);

  // Dismiss the update banner without refreshing (stores current version)
  const dismissUpdate = useCallback(() => {
    const currentVersion = getCurrentVersion();
    if (currentVersion) {
      localStorage.setItem(STORAGE_KEY, currentVersion);
    }
    setUpdateAvailable(false);
  }, [getCurrentVersion]);

  // Initial check on mount
  useEffect(() => {
    // Delay check to ensure page is fully loaded
    const timer = setTimeout(checkForUpdate, 2000);
    return () => clearTimeout(timer);
  }, [checkForUpdate]);

  // Periodic check for updates
  useEffect(() => {
    const interval = setInterval(() => {
      hasChecked.current = false;
      checkForUpdate();
    }, CHECK_INTERVAL);
    
    return () => clearInterval(interval);
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

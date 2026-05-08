"use client";

import { useEffect, useCallback, useState } from "react";

/**
 * Hook to detect when a new version of the app is available.
 * This is especially important for mobile app wrappers that aggressively cache content.
 * 
 * How it works:
 * 1. On mount, it checks for a version meta tag in the document head
 * 2. Periodically (every 5 minutes) checks if the server has a newer version
 * 3. When the app comes back from background, it also checks
 * 4. If a new version is detected, returns updateAvailable: true
 */
export function useAppVersion() {
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [serverVersion, setServerVersion] = useState<string | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Get current version from meta tag
  useEffect(() => {
    if (typeof document !== "undefined") {
      const meta = document.querySelector('meta[name="app-version"]');
      if (meta) {
        const version = meta.getAttribute("content");
        setCurrentVersion(version);
      }
    }
  }, []);

  // Check for updates
  const checkForUpdate = useCallback(async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    try {
      // Fetch the homepage with cache-busting to get the latest version
      const response = await fetch("/?_check=version", {
        method: "HEAD",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      });
      
      const newVersion = response.headers.get("X-App-Version");
      
      if (newVersion) {
        setServerVersion(newVersion);
        
        if (currentVersion && newVersion !== currentVersion) {
          setUpdateAvailable(true);
        }
      }
    } catch (error) {
      console.error("Failed to check for updates:", error);
    } finally {
      setIsChecking(false);
    }
  }, [currentVersion, isChecking]);

  // Force refresh the page
  const refresh = useCallback(() => {
    if (typeof window !== "undefined") {
      // Clear any cached data
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
      
      // Force reload without cache
      window.location.reload();
    }
  }, []);

  // Set up periodic checks and visibility change listener
  useEffect(() => {
    // Check on mount
    const initialCheck = setTimeout(checkForUpdate, 5000);
    
    // Check periodically (every 5 minutes)
    const interval = setInterval(checkForUpdate, 5 * 60 * 1000);
    
    // Check when app resumes from background
    const handleAppResumed = () => {
      checkForUpdate();
    };
    
    // Check when coming back online
    const handleOnline = () => {
      checkForUpdate();
    };
    
    window.addEventListener("app-resumed", handleAppResumed);
    window.addEventListener("online", handleOnline);
    
    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
      window.removeEventListener("app-resumed", handleAppResumed);
      window.removeEventListener("online", handleOnline);
    };
  }, [checkForUpdate]);

  return {
    currentVersion,
    serverVersion,
    updateAvailable,
    isChecking,
    checkForUpdate,
    refresh,
  };
}

export default useAppVersion;

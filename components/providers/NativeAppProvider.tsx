"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  isMedianApp, 
  isPWA, 
  getPlatform, 
  isMobile,
  setBadgeCount,
  setStatusBarStyle 
} from "@/lib/native-app";

interface NativeAppContextType {
  isNativeApp: boolean;
  isPWA: boolean;
  platform: "ios" | "android" | "web";
  isMobile: boolean;
  isReady: boolean;
}

const NativeAppContext = createContext<NativeAppContextType>({
  isNativeApp: false,
  isPWA: false,
  platform: "web",
  isMobile: false,
  isReady: false,
});

export function useNativeApp() {
  const context = useContext(NativeAppContext);
  if (!context) {
    throw new Error("useNativeApp must be used within NativeAppProvider");
  }
  return context;
}

interface NativeAppProviderProps {
  children: ReactNode;
}

export function NativeAppProvider({ children }: NativeAppProviderProps) {
  const [state, setState] = useState<NativeAppContextType>({
    isNativeApp: false,
    isPWA: false,
    platform: "web",
    isMobile: false,
    isReady: false,
  });

  useEffect(() => {
    // Detect app context
    const nativeApp = isMedianApp();
    const pwa = isPWA();
    const platform = getPlatform();
    const mobile = isMobile();

    setState({
      isNativeApp: nativeApp,
      isPWA: pwa,
      platform,
      isMobile: mobile,
      isReady: true,
    });

    // Set status bar style based on platform
    if (nativeApp) {
      setStatusBarStyle("dark");
      
      // Add class to body for CSS targeting
      document.body.classList.add("native-app");
      
      if (platform === "ios") {
        document.body.classList.add("ios-app");
      } else if (platform === "android") {
        document.body.classList.add("android-app");
      }
    }

    // Initialize badge count
    if (nativeApp) {
      setBadgeCount(0);
    }

    // Handle visibility change for app resume
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && nativeApp) {
        // App resumed - could refresh data here
        // This is a good place to check for new notifications
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Add CSS custom properties for safe areas
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--sat", "env(safe-area-inset-top)");
      root.style.setProperty("--sab", "env(safe-area-inset-bottom)");
      root.style.setProperty("--sal", "env(safe-area-inset-left)");
      root.style.setProperty("--sar", "env(safe-area-inset-right)");
    }
  }, []);

  return (
    <NativeAppContext.Provider value={state}>
      {children}
    </NativeAppContext.Provider>
  );
}

export default NativeAppProvider;

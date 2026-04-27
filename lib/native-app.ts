/**
 * Native App Detection and Utilities for Median.co wrapper
 * This module provides utilities to detect when the app is running inside
 * a Median.co native app wrapper and provides app-specific functionality.
 */

// Check if running inside Median.co native app
export function isMedianApp(): boolean {
  if (typeof window === "undefined") return false;
  
  // Median.co injects 'median' object into window
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(window as any).median || 
         !!(window as any).gonative ||
         // Check user agent for Median/GoNative apps
         /median|gonative/i.test(navigator.userAgent);
}

// Check if running as PWA (standalone mode)
export function isPWA(): boolean {
  if (typeof window === "undefined") return false;
  
  return window.matchMedia("(display-mode: standalone)").matches ||
         // iOS Safari specific
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         (window.navigator as any).standalone === true;
}

// Check if running in any native context (app or PWA)
export function isNativeContext(): boolean {
  return isMedianApp() || isPWA();
}

// Get the platform (ios, android, or web)
export function getPlatform(): "ios" | "android" | "web" {
  if (typeof window === "undefined") return "web";
  
  const ua = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "web";
}

// Check if device is mobile
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  );
}

// Get safe area insets (for notched devices)
export function getSafeAreaInsets(): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  if (typeof window === "undefined") {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  const computedStyle = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(computedStyle.getPropertyValue("--sat") || "0", 10) || 
         parseInt(computedStyle.getPropertyValue("env(safe-area-inset-top)") || "0", 10),
    bottom: parseInt(computedStyle.getPropertyValue("--sab") || "0", 10) ||
            parseInt(computedStyle.getPropertyValue("env(safe-area-inset-bottom)") || "0", 10),
    left: parseInt(computedStyle.getPropertyValue("--sal") || "0", 10) ||
          parseInt(computedStyle.getPropertyValue("env(safe-area-inset-left)") || "0", 10),
    right: parseInt(computedStyle.getPropertyValue("--sar") || "0", 10) ||
           parseInt(computedStyle.getPropertyValue("env(safe-area-inset-right)") || "0", 10),
  };
}

// Median.co specific functions

// Register device for push notifications
export async function registerForPushNotifications(): Promise<string | null> {
  if (!isMedianApp()) return null;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const median = (window as any).median;
    if (median?.onesignal?.register) {
      return await median.onesignal.register();
    }
    if (median?.push?.register) {
      return await median.push.register();
    }
  } catch (error) {
    console.error("Failed to register for push notifications:", error);
  }
  return null;
}

// Request push notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isMedianApp()) {
    // For web, use standard Notification API
    if (typeof Notification !== "undefined") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  }
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const median = (window as any).median;
    if (median?.onesignal?.promptPermission) {
      await median.onesignal.promptPermission();
      return true;
    }
  } catch (error) {
    console.error("Failed to request notification permission:", error);
  }
  return false;
}

// Share content using native share
export async function shareContent(options: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<boolean> {
  if (isMedianApp()) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const median = (window as any).median;
      if (median?.share) {
        await median.share(options);
        return true;
      }
    } catch (error) {
      console.error("Native share failed:", error);
    }
  }
  
  // Fallback to Web Share API
  if (navigator.share) {
    try {
      await navigator.share(options);
      return true;
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Web share failed:", error);
      }
    }
  }
  
  return false;
}

// Trigger haptic feedback
export function triggerHapticFeedback(type: "light" | "medium" | "heavy" = "medium"): void {
  if (!isMedianApp()) return;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const median = (window as any).median;
    if (median?.haptics) {
      median.haptics.impact(type);
    }
  } catch (error) {
    console.error("Haptic feedback failed:", error);
  }
}

// Set status bar style
export function setStatusBarStyle(style: "light" | "dark"): void {
  if (!isMedianApp()) return;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const median = (window as any).median;
    if (median?.statusbar?.set) {
      median.statusbar.set({
        style: style === "light" ? "lightContent" : "darkContent",
      });
    }
  } catch (error) {
    console.error("Failed to set status bar style:", error);
  }
}

// Show/hide native navigation bar
export function setNativeNavVisibility(visible: boolean): void {
  if (!isMedianApp()) return;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const median = (window as any).median;
    if (median?.navigationTitles?.setVisibility) {
      median.navigationTitles.setVisibility(visible);
    }
  } catch (error) {
    console.error("Failed to set navigation visibility:", error);
  }
}

// Set badge count (for app icon)
export function setBadgeCount(count: number): void {
  if (!isMedianApp()) return;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const median = (window as any).median;
    if (median?.badge?.set) {
      median.badge.set(count);
    }
  } catch (error) {
    console.error("Failed to set badge count:", error);
  }
}

// Open external URL in system browser
export function openExternalUrl(url: string): void {
  if (isMedianApp()) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const median = (window as any).median;
      if (median?.open?.external) {
        median.open.external(url);
        return;
      }
    } catch (error) {
      console.error("Failed to open external URL:", error);
    }
  }
  
  // Fallback
  window.open(url, "_blank", "noopener,noreferrer");
}

// Check if biometric authentication is available
export async function isBiometricAvailable(): Promise<boolean> {
  if (!isMedianApp()) return false;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const median = (window as any).median;
    if (median?.auth?.status) {
      const status = await median.auth.status();
      return status.hasBiometrics;
    }
  } catch (error) {
    console.error("Failed to check biometric availability:", error);
  }
  return false;
}

// Store data securely using Keychain/Keystore
export async function secureStore(key: string, value: string): Promise<boolean> {
  if (!isMedianApp()) {
    // Fallback to localStorage (not secure, but works)
    try {
      localStorage.setItem(`secure_${key}`, value);
      return true;
    } catch {
      return false;
    }
  }
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const median = (window as any).median;
    if (median?.keychainFacade?.save) {
      await median.keychainFacade.save(key, value);
      return true;
    }
  } catch (error) {
    console.error("Secure store failed:", error);
  }
  return false;
}

// Retrieve securely stored data
export async function secureRetrieve(key: string): Promise<string | null> {
  if (!isMedianApp()) {
    // Fallback to localStorage
    return localStorage.getItem(`secure_${key}`);
  }
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const median = (window as any).median;
    if (median?.keychainFacade?.get) {
      return await median.keychainFacade.get(key);
    }
  } catch (error) {
    console.error("Secure retrieve failed:", error);
  }
  return null;
}

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

// Register device for push notifications and get the player ID
export async function registerForPushNotifications(): Promise<string | null> {
  if (!isMedianApp()) return null;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const median = (window as any).median;
    
    // Try OneSignal info first to get existing player ID
    if (median?.onesignal?.info) {
      return new Promise((resolve) => {
        median.onesignal.info({
          callback: (info: { oneSignalUserId?: string; oneSignalPushToken?: string; subscribed?: boolean }) => {
            console.log("[v0] OneSignal info callback:", info);
            if (info?.oneSignalUserId) {
              resolve(info.oneSignalUserId);
            } else {
              resolve(null);
            }
          }
        });
        // Timeout fallback
        setTimeout(() => resolve(null), 5000);
      });
    }
    
    // Fallback to register methods
    if (median?.onesignal?.register) {
      const result = await median.onesignal.register();
      console.log("[v0] OneSignal register result:", result);
      return result;
    }
    if (median?.push?.register) {
      const result = await median.push.register();
      console.log("[v0] Push register result:", result);
      return result;
    }
  } catch (error) {
    console.error("Failed to register for push notifications:", error);
  }
  return null;
}

// Request push notification permission for Median app
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
    
    if (!median?.onesignal) {
      console.warn("OneSignal not available in Median app");
      return false;
    }
    
    // For Median.co apps, we need to:
    // 1. First check if already subscribed
    // 2. If not, trigger the native permission prompt + subscription
    
    // Check current subscription status first
    const alreadySubscribed = await checkOneSignalSubscription();
    if (alreadySubscribed) {
      return true;
    }
    
    // Method 1: Use onesignal.optIn() - this opts the user into push notifications
    // This is the primary method for Median apps
    if (median.onesignal.optIn) {
      return new Promise((resolve) => {
        let resolved = false;
        
        median.onesignal.optIn({
          callback: (result: { success?: boolean; subscribed?: boolean; error?: string }) => {
            if (resolved) return;
            resolved = true;
            
            if (result?.error) {
              console.error("OneSignal optIn error:", result.error);
              resolve(false);
              return;
            }
            
            resolve(result?.success === true || result?.subscribed === true);
          }
        });
        
        // Timeout fallback
        setTimeout(async () => {
          if (resolved) return;
          resolved = true;
          // Check if subscription was successful
          const isSubscribed = await checkOneSignalSubscription();
          resolve(isSubscribed);
        }, 8000);
      });
    }
    
    // Method 2: Use register which should trigger permission + subscription
    if (median.onesignal.register) {
      return new Promise((resolve) => {
        let resolved = false;
        
        median.onesignal.register({
          callback: (result: { oneSignalUserId?: string; error?: string }) => {
            if (resolved) return;
            resolved = true;
            
            if (result?.error) {
              console.error("OneSignal register error:", result.error);
              resolve(false);
              return;
            }
            
            resolve(!!result?.oneSignalUserId);
          }
        });
        
        setTimeout(async () => {
          if (resolved) return;
          resolved = true;
          const isSubscribed = await checkOneSignalSubscription();
          resolve(isSubscribed);
        }, 8000);
      });
    }
    
    // Method 3: iOS specific - prompt for permission
    if (median.onesignal.promptForPushNotificationsWithUserResponse) {
      return new Promise((resolve) => {
        median.onesignal.promptForPushNotificationsWithUserResponse({
          callback: (accepted: boolean) => {
            resolve(accepted);
          }
        });
        setTimeout(() => resolve(false), 8000);
      });
    }
    
    console.warn("No suitable OneSignal method found");
    return false;
  } catch (error) {
    console.error("Failed to request notification permission:", error);
  }
  return false;
}

// Check OneSignal subscription status
export async function checkOneSignalSubscription(): Promise<boolean> {
  if (!isMedianApp()) return false;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const median = (window as any).median;
    
    if (!median?.onesignal) return false;
    
    // Method 1: Use onesignal.info() - most reliable
    if (median.onesignal.info) {
      return new Promise((resolve) => {
        let resolved = false;
        
        median.onesignal.info({
          callback: (info: { 
            subscribed?: boolean; 
            oneSignalUserId?: string;
            hasPermission?: boolean;
            pushToken?: string;
          }) => {
            if (resolved) return;
            resolved = true;
            
            // User is subscribed if they have a userId or are marked as subscribed
            const isSubscribed = info?.subscribed === true || 
                                 !!info?.oneSignalUserId || 
                                 !!info?.pushToken;
            resolve(isSubscribed);
          }
        });
        
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve(false);
          }
        }, 3000);
      });
    }
    
    // Method 2: getPermissionStatus
    if (median.onesignal.getPermissionStatus) {
      return new Promise((resolve) => {
        let resolved = false;
        
        median.onesignal.getPermissionStatus({
          callback: (status: { status?: string; subscribed?: boolean; granted?: boolean } | string | boolean) => {
            if (resolved) return;
            resolved = true;
            
            if (typeof status === "boolean") {
              resolve(status);
            } else if (typeof status === "string") {
              resolve(status === "granted" || status === "authorized" || status === "subscribed");
            } else if (typeof status === "object") {
              resolve(status?.subscribed === true || status?.granted === true || status?.status === "granted");
            } else {
              resolve(false);
            }
          }
        });
        
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve(false);
          }
        }, 3000);
      });
    }
  } catch (error) {
    console.error("Failed to check OneSignal subscription:", error);
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

// ============================================================================
// SOCIAL LOGIN - Native OAuth for Median.co apps
// ============================================================================

export interface GoogleLoginResult {
  idToken: string;
  accessToken: string;
  email: string;
  name: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  userId: string;
}

export interface AppleLoginResult {
  identityToken: string;
  authorizationCode: string;
  user?: string;
  email?: string;
  fullName?: {
    givenName?: string;
    familyName?: string;
  };
}

export interface SocialLoginError {
  error: string;
  message?: string;
}

// Web Client ID for Google Sign-In (Android & Web OAuth)
// Must match the Web OAuth 2.0 Client ID in Google Cloud Console for the Firebase project
const GOOGLE_WEB_CLIENT_ID =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID) ||
  "393630939714-ccgciu2tmtf7me0souh2vt7a1ctqe1bf.apps.googleusercontent.com";

/**
 * Native Google Sign-In using Median.co's Social Login plugin.
 * Uses the native Google SDK — no external browser, no redirect issues.
 * On Android, Median requires the Web Client ID to be passed so it can
 * exchange the auth code for an ID token server-side.
 *
 * @param callbackUrl - Optional server-side redirect URL for token exchange
 * @returns Promise with user data or null if not in native app
 */
export function nativeGoogleSignIn(callbackUrl?: string): Promise<GoogleLoginResult | null> {
  return new Promise((resolve, reject) => {
    if (!isMedianApp()) {
      // Not in native app — caller should fall back to Firebase web popup
      resolve(null);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const median = (window as any).median;
      
      if (!median?.socialLogin?.google?.login) {
        console.warn("Median Social Login plugin not available");
        resolve(null);
        return;
      }

      // Set up the callback that Median will invoke with the sign-in result
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).googleLoginCallback = (result: GoogleLoginResult | SocialLoginError) => {
        if ("error" in result) {
          reject(new Error(result.message || result.error));
        } else {
          resolve(result);
        }
        // Clean up the global callback
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).googleLoginCallback;
      };

      if (callbackUrl) {
        // Server-side redirect mode — Median posts token to your server
        median.socialLogin.google.login({
          clientId: GOOGLE_WEB_CLIENT_ID,
          redirectUri: callbackUrl,
        });
      } else {
        // JavaScript callback mode — result returned directly to the page
        median.socialLogin.google.login({
          clientId: GOOGLE_WEB_CLIENT_ID,
          callback: "googleLoginCallback",
        });
      }
    } catch (error) {
      console.error("Native Google Sign-In failed:", error);
      reject(error);
    }
  });
}

/**
 * Native Sign In with Apple using Median.co's Social Login plugin
 * 
 * @param callbackUrl - Optional server-side redirect URL for token exchange
 * @returns Promise with user data or null if not in native app
 */
export function nativeAppleSignIn(callbackUrl?: string): Promise<AppleLoginResult | null> {
  return new Promise((resolve, reject) => {
    if (!isMedianApp()) {
      resolve(null);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const median = (window as any).median;
      
      if (!median?.socialLogin?.apple?.login) {
        console.warn("Median Apple Sign In plugin not available");
        resolve(null);
        return;
      }

      // Set up the callback function
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).appleLoginCallback = (result: AppleLoginResult | SocialLoginError) => {
        if ('error' in result) {
          reject(new Error(result.message || result.error));
        } else {
          resolve(result);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).appleLoginCallback;
      };

      if (callbackUrl) {
        median.socialLogin.apple.login({
          redirectUri: callbackUrl,
        });
      } else {
        median.socialLogin.apple.login({
          callback: 'appleLoginCallback',
        });
      }
    } catch (error) {
      console.error("Native Apple Sign-In failed:", error);
      reject(error);
    }
  });
}

/**
 * Check if native social login is available
 */
export function isNativeSocialLoginAvailable(): boolean {
  if (!isMedianApp()) return false;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const median = (window as any).median;
    return !!(median?.socialLogin?.google?.login || median?.socialLogin?.apple?.login);
  } catch {
    return false;
  }
}

/**
 * Logout from native social login
 */
export function nativeSocialLogout(): void {
  if (!isMedianApp()) return;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const median = (window as any).median;
    
    // Logout from Google if available
    if (median?.socialLogin?.google?.logout) {
      median.socialLogin.google.logout();
    }
    
    // Note: Apple Sign In doesn't have a logout method
  } catch (error) {
    console.error("Native social logout failed:", error);
  }
}

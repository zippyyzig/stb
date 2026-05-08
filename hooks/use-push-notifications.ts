"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  isMedianApp, 
  requestNotificationPermission,
  registerForPushNotifications,
  checkOneSignalSubscription 
} from "@/lib/native-app";

interface PushNotificationState {
  isSupported: boolean;
  isEnabled: boolean;
  isLoading: boolean;
  deviceToken: string | null;
  error: string | null;
}

interface UsePushNotificationsReturn extends PushNotificationState {
  requestPermission: () => Promise<boolean>;
  registerDevice: () => Promise<string | null>;
  recheckStatus: () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isEnabled: false,
    isLoading: true,
    deviceToken: null,
    error: null,
  });

  // Check initial support and permission status
  const checkStatus = useCallback(async () => {
    try {
      // Check if we're in Median app or if browser supports notifications
      const inMedianApp = isMedianApp();
      const hasNotificationAPI = typeof Notification !== "undefined";
      const isSupported = inMedianApp || hasNotificationAPI;

      console.log("[v0] Push notification check - isMedianApp:", inMedianApp, "hasNotificationAPI:", hasNotificationAPI);

      let isEnabled = false;
      
      if (inMedianApp) {
        // Use our helper function to check OneSignal subscription
        isEnabled = await checkOneSignalSubscription();
        console.log("[v0] OneSignal subscription status:", isEnabled);
      } else if (hasNotificationAPI) {
        isEnabled = Notification.permission === "granted";
      }

      setState(prev => ({
        ...prev,
        isSupported,
        isEnabled,
        isLoading: false,
      }));
    } catch (error) {
      console.error("[v0] Push notification status check error:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message,
      }));
    }
  }, []);

  useEffect(() => {
    // Small delay to ensure Median SDK is fully loaded
    const timer = setTimeout(() => {
      checkStatus();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [checkStatus]);

  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    console.log("[v0] requestPermission called in hook");
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const granted = await requestNotificationPermission();
      console.log("[v0] Permission request result:", granted);
      
      // Recheck status after requesting permission
      if (granted) {
        // Give some time for the subscription to register
        await new Promise(resolve => setTimeout(resolve, 1000));
        const isSubscribed = await checkOneSignalSubscription();
        console.log("[v0] Post-permission subscription check:", isSubscribed);
        
        setState(prev => ({
          ...prev,
          isEnabled: isSubscribed || granted,
          isLoading: false,
        }));
        
        return isSubscribed || granted;
      }
      
      setState(prev => ({
        ...prev,
        isEnabled: granted,
        isLoading: false,
      }));
      
      return granted;
    } catch (error) {
      console.error("[v0] Permission request error:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message,
      }));
      return false;
    }
  }, []);

  // Register device for push notifications
  const registerDevice = useCallback(async (): Promise<string | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const token = await registerForPushNotifications();
      
      if (token) {
        // Optionally save token to backend
        try {
          await fetch("/api/user/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              deviceToken: token,
              platform: isMedianApp() ? "app" : "web"
            }),
          });
        } catch (saveError) {
          console.error("Failed to save device token:", saveError);
        }
      }
      
      setState(prev => ({
        ...prev,
        deviceToken: token,
        isLoading: false,
      }));
      
      return token;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message,
      }));
      return null;
    }
  }, []);

  return {
    ...state,
    requestPermission,
    registerDevice,
    recheckStatus: checkStatus,
  };
}

export default usePushNotifications;

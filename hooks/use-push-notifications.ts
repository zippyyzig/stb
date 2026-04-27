"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  isMedianApp, 
  requestNotificationPermission,
  registerForPushNotifications 
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
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check if we're in Median app or if browser supports notifications
        const inMedianApp = isMedianApp();
        const hasNotificationAPI = typeof Notification !== "undefined";
        const isSupported = inMedianApp || hasNotificationAPI;

        let isEnabled = false;
        
        if (inMedianApp) {
          // In Median app, check OneSignal status if available
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const median = (window as any).median;
          if (median?.onesignal?.getPermissionStatus) {
            const status = await median.onesignal.getPermissionStatus();
            isEnabled = status === "granted" || status === true;
          }
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
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: (error as Error).message,
        }));
      }
    };

    checkStatus();
  }, []);

  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const granted = await requestNotificationPermission();
      
      setState(prev => ({
        ...prev,
        isEnabled: granted,
        isLoading: false,
      }));
      
      return granted;
    } catch (error) {
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
  };
}

export default usePushNotifications;

"use client";

import { useState, useEffect } from "react";
import { Bell, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNativeApp } from "@/components/providers/NativeAppProvider";
import { usePushNotifications } from "@/hooks/use-push-notifications";

export function PushNotificationBanner() {
  const { isNativeApp, isReady } = useNativeApp();
  const { isSupported, isEnabled, isLoading, requestPermission, registerDevice } = usePushNotifications();
  const [dismissed, setDismissed] = useState(false);
  const [requesting, setRequesting] = useState(false);

  // Check if banner was previously dismissed
  useEffect(() => {
    if (typeof window !== "undefined") {
      const wasDismissed = localStorage.getItem("push_banner_dismissed");
      if (wasDismissed) {
        setDismissed(true);
      }
    }
  }, []);

  // Don't show if:
  // - Not ready yet
  // - Not supported
  // - Already enabled
  // - User dismissed
  // - Still loading
  if (!isReady || !isSupported || isEnabled || dismissed || isLoading) {
    return null;
  }

  const handleEnable = async () => {
    setRequesting(true);
    try {
      const granted = await requestPermission();
      if (granted) {
        await registerDevice();
        // Banner will auto-hide since isEnabled will become true
      }
    } catch (error) {
      console.error("Error enabling push notifications:", error);
    } finally {
      setRequesting(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("push_banner_dismissed", "true");
  };

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">
            {isNativeApp ? "Enable Push Notifications" : "Stay Updated"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Get instant updates about your orders, exclusive deals, and important announcements.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Button
              size="sm"
              onClick={handleEnable}
              disabled={requesting}
              className="h-8 text-xs gap-1.5"
            >
              {requesting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Bell className="h-3.5 w-3.5" />
              )}
              Enable Notifications
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 text-xs text-muted-foreground"
            >
              Not now
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground p-1 -m-1"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default PushNotificationBanner;

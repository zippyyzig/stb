"use client";

import { useState, useEffect } from "react";
import { isMedianApp, nativeGoogleSignIn } from "@/lib/native-app";

export default function GoogleSignInDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isNative, setIsNative] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [medianInfo, setMedianInfo] = useState<any>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    const native = isMedianApp();
    setIsNative(native);
    addLog(`isMedianApp: ${native}`);
    
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const median = (window as any).median;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gonative = (window as any).gonative;
      
      addLog(`window.median exists: ${!!median}`);
      addLog(`window.gonative exists: ${!!gonative}`);
      addLog(`User agent: ${navigator.userAgent}`);
      
      if (median) {
        setMedianInfo({
          socialLogin: !!median.socialLogin,
          google: !!median.socialLogin?.google,
          googleLogin: typeof median.socialLogin?.google?.login,
        });
        addLog(`median.socialLogin exists: ${!!median.socialLogin}`);
        addLog(`median.socialLogin.google exists: ${!!median.socialLogin?.google}`);
        addLog(`median.socialLogin.google.login type: ${typeof median.socialLogin?.google?.login}`);
      }
    }
  }, []);

  const handleTestLogin = async () => {
    if (isLoading) {
      addLog("Already loading, ignoring click");
      return;
    }
    
    setIsLoading(true);
    addLog("Starting Google Sign-In test...");
    
    try {
      const result = await nativeGoogleSignIn();
      
      if (result === null) {
        addLog("Result is null - not in native app or plugin unavailable");
      } else {
        addLog(`SUCCESS! Email: ${result.email}`);
        addLog(`Name: ${result.name}`);
        addLog(`User ID: ${result.userId}`);
        addLog(`Has idToken: ${!!result.idToken}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      addLog(`ERROR: ${errorMsg}`);
    } finally {
      setIsLoading(false);
      addLog("Sign-in flow completed");
    }
  };

  const handleDirectCall = () => {
    // Web Client ID from Google Cloud Console (NOT Android - that's only for SHA-1 config)
    const GOOGLE_WEB_CLIENT_ID = "393630939714-ccgciu2tmtf7me0souh2vt7a1ctqe1bf.apps.googleusercontent.com";
    
    addLog("Testing with Web Client ID (correct for Median)...");
    addLog(`Client ID: ${GOOGLE_WEB_CLIENT_ID}`);
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const median = (window as any).median;
      
      if (!median?.socialLogin?.google?.login) {
        addLog("ERROR: median.socialLogin.google.login not available");
        return;
      }
      
      // IMPORTANT: Median requires callback as a STRING (function name), not a function reference
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).testGoogleCallback = (response: any) => {
        addLog(`Callback received: ${JSON.stringify(response)}`);
      };
      
      addLog("Calling with Web clientId and STRING callback name...");
      
      // Pass callback as STRING - this is required by Median's native bridge
      median.socialLogin.google.login({
        clientId: GOOGLE_WEB_CLIENT_ID,
        callback: "testGoogleCallback",
      });
      
      addLog("Call completed, waiting for callback...");
    } catch (error) {
      addLog(`Direct call error: ${error}`);
    }
  };

  const handleRedirectMode = () => {
    addLog("Testing REDIRECT MODE (no clientId - configured in Median dashboard)...");
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const median = (window as any).median;
      
      if (!median?.socialLogin?.google?.login) {
        addLog("ERROR: median.socialLogin.google.login not available");
        return;
      }
      
      const redirectUri = `${window.location.origin}/api/auth/median-google`;
      addLog(`Redirect URI: ${redirectUri}`);
      addLog("NOTE: clientId should be configured in Median.co dashboard, not passed here");
      
      // IMPORTANT: Do NOT pass clientId when using redirectUri mode
      // The clientId should be configured in Median.co dashboard
      median.socialLogin.google.login({
        redirectUri: redirectUri,
      });
      
      addLog("Redirect initiated - should redirect after auth...");
    } catch (error) {
      addLog(`Redirect error: ${error}`);
    }
  };

  const handleCallbackOnlyMode = () => {
    addLog("Testing CALLBACK ONLY MODE (no clientId - uses Median dashboard config)...");
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const median = (window as any).median;
      
      if (!median?.socialLogin?.google?.login) {
        addLog("ERROR: median.socialLogin.google.login not available");
        return;
      }
      
      // Register global callback
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).testCallbackOnly = (response: any) => {
        addLog(`Callback received: ${JSON.stringify(response)}`);
      };
      
      addLog("Calling with ONLY callback string (no clientId)...");
      
      // Try without clientId - it should use the one configured in Median dashboard
      median.socialLogin.google.login({
        callback: "testCallbackOnly",
      });
      
      addLog("Call completed, waiting for callback...");
    } catch (error) {
      addLog(`Callback-only error: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog("Logs cleared");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold">Google Sign-In Debug</h1>
        
        <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <h2 className="font-semibold text-yellow-800 mb-2">Median.co Configuration</h2>
          <div className="text-sm text-yellow-700 mb-2 space-y-1">
            <p><strong>Web Client ID (use in code):</strong></p>
            <code className="bg-yellow-100 px-1 text-xs break-all block">393630939714-ccgciu2tmtf7me0souh2vt7a1ctqe1bf.apps.googleusercontent.com</code>
            <p className="mt-2"><strong>Android Client ID (for Google Cloud Console SHA-1):</strong></p>
            <code className="bg-yellow-100 px-1 text-xs break-all block">393630939714-kv9uopvubdai15ob74tn0s6ppdd4jip4.apps.googleusercontent.com</code>
          </div>
          <ol className="text-xs text-yellow-700 list-decimal ml-4 space-y-1 mt-3">
            <li>In <strong>Google Cloud Console</strong> → Credentials → Add your app&apos;s SHA-1 fingerprint to the <strong>Android Client ID</strong></li>
            <li>In <strong>Median.co Dashboard</strong> → Native Plugins → Social Login → Enable Google</li>
            <li>In Median, enter the <strong>Web Client ID</strong> (NOT Android ID)</li>
            <li><strong>Rebuild the app</strong> in Median after saving</li>
          </ol>
        </div>
        
        <div className="mb-4 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 font-semibold">Environment</h2>
          <p>Is Native App: <span className={isNative ? "text-green-600" : "text-red-600"}>{String(isNative)}</span></p>
          {medianInfo && (
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(medianInfo, null, 2)}
            </pre>
          )}
        </div>
        
        <div className="mb-4 flex gap-2 flex-wrap">
          <button
            onClick={handleTestLogin}
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Test nativeGoogleSignIn()"}
          </button>
          
          <button
            onClick={handleDirectCall}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Test Web Client ID
          </button>
          
          <button
            onClick={handleRedirectMode}
            className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Test Redirect Mode
          </button>
          
          <button
            onClick={handleCallbackOnlyMode}
            className="rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
          >
            Test Callback Only (No ClientId)
          </button>
          
          <button
            onClick={clearLogs}
            className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Clear Logs
          </button>
        </div>
        
        <div className="rounded-lg bg-black p-4 shadow">
          <h2 className="mb-2 font-semibold text-white">Console Logs</h2>
          <div className="max-h-96 overflow-auto font-mono text-xs text-green-400">
            {logs.map((log, i) => (
              <div key={i} className="whitespace-pre-wrap break-all">
                {log}
              </div>
            ))}
            {logs.length === 0 && <p className="text-gray-500">No logs yet...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

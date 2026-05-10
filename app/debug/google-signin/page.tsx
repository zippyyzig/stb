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
    // The Web Client ID must match what's configured in Google Cloud Console
    const GOOGLE_WEB_CLIENT_ID = "393630939714-ccgciu2tmtf7me0souh2vt7a1ctqe1bf.apps.googleusercontent.com";
    
    addLog("Testing direct median.socialLogin.google.login call...");
    addLog(`Using clientId: ${GOOGLE_WEB_CLIENT_ID}`);
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const median = (window as any).median;
      
      if (!median?.socialLogin?.google?.login) {
        addLog("ERROR: median.socialLogin.google.login not available");
        return;
      }
      
      // Define a simple global callback
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).testGoogleCallback = (response: any) => {
        addLog(`Direct callback received: ${JSON.stringify(response)}`);
      };
      
      addLog("Calling median.socialLogin.google.login with clientId and callback...");
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      median.socialLogin.google.login({
        clientId: GOOGLE_WEB_CLIENT_ID,
        callback: (window as any).testGoogleCallback,
      });
      
      addLog("Direct call completed, waiting for callback...");
    } catch (error) {
      addLog(`Direct call error: ${error}`);
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
            Test Direct Call
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

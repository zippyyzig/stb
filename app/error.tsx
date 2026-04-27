"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="mb-8 inline-block">
          <Image
            src="/logo.png"
            alt="Smart Tech Bazaar"
            width={140}
            height={48}
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="heading-xl mb-3 text-foreground">Something went wrong</h1>
        <p className="body-md mb-8 text-muted-foreground">
          We apologize for the inconvenience. An unexpected error has occurred.
          Please try again or return to the homepage.
        </p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
            <p className="text-xs font-medium text-red-800 mb-1">Error Details:</p>
            <p className="text-xs text-red-700 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            asChild
          >
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-sm text-muted-foreground">
          If this problem persists, please{" "}
          <Link
            href="/dashboard/support/new"
            className="font-medium text-primary hover:underline"
          >
            contact our support team
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

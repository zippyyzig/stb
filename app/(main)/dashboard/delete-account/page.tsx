"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  AlertTriangle,
  Trash2,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldAlert,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DeleteAccountPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const isGoogleUser = session?.user && !session.user.email?.includes("@deleted");

  const consequences = [
    "All your personal information will be permanently removed",
    "Your order history will be anonymized",
    "Any saved addresses will be deleted",
    "Your wishlist and cart will be cleared",
    "You will lose access to any active orders or support tickets",
    "This action cannot be undone",
  ];

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: password || undefined,
          confirmDeletion: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sign out and redirect to home
        await signOut({ redirect: false });
        router.push("/?deleted=true");
      } else {
        setError(data.error || "Failed to delete account");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-lg">
      {/* Back button */}
      <Link
        href="/dashboard/security"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Security
      </Link>

      {/* Warning header */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-foreground text-lg">
              Delete Your Account
            </h1>
            <p className="text-sm text-red-700 mt-1">
              This is a permanent action and cannot be undone. Please read
              carefully before proceeding.
            </p>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-2 text-foreground">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <h2 className="font-semibold">What happens when you delete your account</h2>
          </div>

          <ul className="space-y-2">
            {consequences.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/security")}
              className="flex-1"
            >
              Keep My Account
            </Button>
            <Button
              variant="destructive"
              onClick={() => setStep(2)}
              className="flex-1 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Continue to Delete
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <h2 className="font-semibold text-foreground">Confirm Account Deletion</h2>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Password field for non-Google users */}
          {!isGoogleUser && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Enter your password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your current password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="confirm">
              Type <span className="font-mono font-bold text-red-600">DELETE</span> to
              confirm
            </Label>
            <Input
              id="confirm"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder="Type DELETE"
              className="font-mono"
            />
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              disabled={isDeleting}
              className="flex-1"
            >
              Go Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || confirmText !== "DELETE"}
              className="flex-1 gap-2"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isDeleting ? "Deleting..." : "Delete My Account"}
            </Button>
          </div>
        </div>
      )}

      {/* Alternative: Contact support */}
      <div className="bg-muted/50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Having issues? Contact us instead
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              If you&apos;re experiencing problems, our support team may be able to help
              without deleting your account.
            </p>
            <Link
              href="/dashboard/support/new"
              className="text-xs text-primary hover:underline mt-2 inline-block"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

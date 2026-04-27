"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(error || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const signInResult = await signIn("google-firebase", {
        email: user.email,
        name: user.displayName,
        googleId: user.uid,
        avatar: user.photoURL,
        redirect: false,
      });
      if (signInResult?.error) {
        setErrorMessage(signInResult.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setErrorMessage("Failed to sign in with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-primary">
      {/* ── Red branded top section ────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8 pt-16">
        {/* Logo */}
        <Link href="/" className="mb-6 block">
          <Image
            src="/logo.png"
            alt="Smart Tech Bazaar"
            width={160}
            height={56}
            className="h-14 w-auto object-contain brightness-0 invert"
            priority
          />
        </Link>
        <p className="text-center text-sm font-medium text-white/80">
          India&apos;s trusted B2B &amp; B2C tech marketplace
        </p>
      </div>

      {/* ── White card — slides up from bottom ─────────────────────── */}
      <div className="w-full rounded-t-[28px] bg-white px-6 pb-10 pt-8 shadow-2xl animate-slide-up">
        <h1 className="mb-1 text-xl font-extrabold text-foreground">Welcome back</h1>
        <p className="mb-6 text-sm text-muted-foreground">Sign in to continue shopping</p>

        {errorMessage && (
          <div className="mb-4 rounded-xl bg-destructive/8 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        {/* Google sign-in — prominent primary CTA */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="mb-4 flex h-12 w-full items-center justify-center gap-3 rounded-2xl border-2 border-border bg-white text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:shadow-md disabled:opacity-70 press-active"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative my-5 flex items-center">
          <div className="flex-1 border-t border-border" />
          <span className="mx-4 text-xs font-medium text-muted-foreground">or sign in with email</span>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* Email + password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-foreground">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-border pl-10 text-sm focus:border-primary"
                required
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold text-foreground">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-border pl-10 pr-11 text-sm focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground press-active"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-white transition-colors hover:bg-stb-red-dark disabled:opacity-70 press-active"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <Link href="/auth/register" className="font-semibold text-primary hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  BadgePercent,
  Truck,
  Star,
} from "lucide-react";

const perks = [
  { icon: BadgePercent, title: "GST Invoicing",    desc: "Valid tax invoices on every order" },
  { icon: Truck,        title: "Pan-India Delivery", desc: "Express shipping to all pin codes" },
  { icon: ShieldCheck,  title: "100% Authentic",   desc: "Genuine branded products only" },
  { icon: Star,         title: "Loyalty Rewards",  desc: "Earn points on every purchase" },
];

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword]     = useState(false);
  const [isLoading, setIsLoading]           = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage]     = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password }),
      });
      const data = await response.json();
      if (!response.ok) { setErrorMessage(data.error || "Registration failed"); return; }

      const signInResult = await signIn("credentials", { email: formData.email, password: formData.password, redirect: false });
      if (signInResult?.error) {
        setErrorMessage("Account created but sign-in failed. Please login manually.");
      } else {
        router.push("/auth/onboarding");
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
      const result       = await signInWithPopup(auth, googleProvider);
      const user         = result.user;
      const signInResult = await signIn("google-firebase", {
        email: user.email, name: user.displayName, googleId: user.uid, avatar: user.photoURL, redirect: false,
      });
      if (signInResult?.error) { setErrorMessage(signInResult.error); }
      else { router.push("/auth/onboarding"); router.refresh(); }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setErrorMessage("Failed to sign in with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  /* ── Shared form JSX ────────────────────────────────────────────── */
  const FormBody = (
    <>
      {errorMessage && (
        <div className="mb-4 rounded-xl bg-destructive/8 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {/* Google */}
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
        Sign up with Google
      </button>

      <div className="relative my-4 flex items-center">
        <div className="flex-1 border-t border-border" />
        <span className="mx-4 text-xs font-medium text-muted-foreground">or register with email</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-foreground">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="name" name="name" type="text" placeholder="Enter your name" value={formData.name} onChange={handleChange}
              className="h-12 rounded-xl border-border pl-10 text-sm focus:border-primary" required />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className="mb-1.5 block text-xs font-semibold text-foreground">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="reg-email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange}
              className="h-12 rounded-xl border-border pl-10 text-sm focus:border-primary" required />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold text-foreground">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="phone" name="phone" type="tel" placeholder="+91 00000 00000" value={formData.phone} onChange={handleChange}
              className="h-12 rounded-xl border-border pl-10 text-sm focus:border-primary" />
          </div>
        </div>

        {/* Password row — side by side on desktop */}
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Create password" value={formData.password} onChange={handleChange}
                className="h-12 rounded-xl border-border pl-10 pr-11 text-sm focus:border-primary" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground press-active">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold text-foreground">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange}
                className="h-12 rounded-xl border-border pl-10 text-sm focus:border-primary" required />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isLoading}
          className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-white transition-colors hover:bg-stb-red-dark disabled:opacity-70 press-active">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>
    </>
  );

  return (
    <>
      {/* ─────────────────── MOBILE layout ─────────────────────────── */}
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-primary md:hidden">
        {/* Red top */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8 pt-14">
          <Link href="/" className="mb-4 block">
            <Image src="/logo.png" alt="Smart Tech Bazaar" width={150} height={52} className="h-12 w-auto object-contain brightness-0 invert" priority />
          </Link>
          <p className="text-center text-sm font-medium text-white/80">Join thousands of satisfied customers</p>
        </div>

        {/* White card */}
        <div className="w-full rounded-t-[28px] bg-white px-6 pb-10 pt-8 shadow-2xl animate-slide-up">
          <h1 className="mb-1 text-xl font-extrabold text-foreground">Create account</h1>
          <p className="mb-5 text-sm text-muted-foreground">Sign up to start shopping</p>
          {FormBody}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* ─────────────────── DESKTOP split-panel ───────────────────── */}
      <div className="hidden min-h-screen md:grid md:grid-cols-2">
        {/* Left — form panel */}
        <div className="flex flex-col justify-center overflow-y-auto bg-background px-8 py-12 xl:px-16">
          <div className="w-full max-w-lg">
            {/* Logo for desktop */}
            <Link href="/" className="mb-8 block">
              <Image src="/logo.png" alt="Smart Tech Bazaar" width={150} height={50} className="h-10 w-auto object-contain" />
            </Link>

            <h1 className="mb-1 text-3xl font-extrabold text-foreground">Create your account</h1>
            <p className="mb-7 text-sm text-muted-foreground">
              Already have one?{" "}
              <Link href="/auth/login" className="font-semibold text-primary hover:underline">Sign in</Link>
            </p>

            {FormBody}
          </div>
        </div>

        {/* Right — brand panel */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-primary px-10 py-12">
          {/* Subtle diagonal pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Top quote */}
          <div className="relative z-10">
            <blockquote className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <p className="text-sm font-medium text-white/90 leading-relaxed">
                &ldquo;Smart Tech Bazaar gave our business access to genuine products at competitive prices with proper GST documentation. Highly recommended.&rdquo;
              </p>
              <footer className="mt-3 flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">RS</div>
                <div>
                  <p className="text-xs font-bold text-white">Rajesh Sharma</p>
                  <p className="text-[10px] text-white/60">B2B Buyer, Delhi</p>
                </div>
              </footer>
            </blockquote>
          </div>

          {/* Centered perks */}
          <div className="relative z-10 my-auto py-8">
            <h2 className="mb-2 text-3xl font-extrabold text-white text-balance">Why join us?</h2>
            <p className="mb-8 text-sm text-white/70">Everything you need, in one marketplace.</p>
            <div className="grid grid-cols-2 gap-4">
              {perks.map((perk) => (
                <div key={perk.title} className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <perk.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-bold text-white">{perk.title}</p>
                  <p className="mt-0.5 text-[11px] text-white/65">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom trust signal */}
          <div className="relative z-10 flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
            <ShieldCheck className="h-5 w-5 shrink-0 text-white" />
            <span className="text-xs font-semibold text-white/90">Your data is encrypted and never shared with third parties.</span>
          </div>
        </div>
      </div>
    </>
  );
}

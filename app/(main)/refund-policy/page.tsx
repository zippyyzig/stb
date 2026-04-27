import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { RefreshCw, ChevronRight, Mail, Phone, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Learn about Smart Tech Bazaar's refund and cancellation policy. Understand our return process, eligible products, and refund timelines.",
};

const eligibleItems = [
  "Products received in damaged condition",
  "Wrong product delivered",
  "Products with manufacturing defects",
  "Defective or non-functional items (verified within 48 hours)",
  "Incomplete orders (missing items)",
];

const nonEligibleItems = [
  "Software, licenses, and digital products",
  "Consumables (ink cartridges, toner, batteries, cables)",
  "Custom-configured or special order items",
  "Products with broken seals or tampered packaging",
  "Products damaged due to misuse or improper handling",
  "Items without original packaging, accessories, or documentation",
  "Products purchased more than 7 days ago",
];

const refundProcess = [
  {
    step: "1",
    title: "Initiate Request",
    description:
      "Contact our support team within 7 days of delivery with your order number and reason for return.",
  },
  {
    step: "2",
    title: "Approval",
    description:
      "Our team will review your request and approve or decline within 24-48 hours.",
  },
  {
    step: "3",
    title: "Return Pickup",
    description:
      "Once approved, we will arrange a free pickup from your location within 3-5 business days.",
  },
  {
    step: "4",
    title: "Quality Check",
    description:
      "Returned items undergo quality inspection at our warehouse (1-2 business days).",
  },
  {
    step: "5",
    title: "Refund Processing",
    description:
      "Refund is initiated within 5-7 business days after successful quality check.",
  },
];

const refundMethods = [
  {
    method: "Original Payment Method",
    timeline: "5-7 business days",
    description: "Refund to the same card/UPI/net banking account used for payment",
  },
  {
    method: "Bank Transfer",
    timeline: "7-10 business days",
    description: "Direct bank transfer for COD orders or special cases",
  },
  {
    method: "Store Credit",
    timeline: "Instant",
    description: "Credit added to your account for future purchases (optional)",
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8FA]">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        {/* Hero */}
        <div className="bg-stb-dark text-white">
          <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
            <div className="flex items-center gap-1.5 text-[11px] text-white/40">
              <Link href="/" className="hover:text-white/70">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white/70">Refund & Cancellation Policy</span>
            </div>
            <div className="mt-4 flex items-start gap-4 md:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold md:text-3xl">
                  Refund & Cancellation Policy
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  Our commitment to hassle-free returns and transparent refunds.
                </p>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-white/40">
              Effective Date: 1 January 2025 &nbsp;&bull;&nbsp; Last Updated: 1
              January 2025
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            {/* Sticky Table of Contents — desktop */}
            <aside className="hidden lg:block lg:w-56 xl:w-64">
              <div className="sticky top-6 rounded-xl border border-border bg-white p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Contents
                </p>
                <nav className="flex flex-col gap-1">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "eligible", label: "Eligible Items" },
                    { id: "non-eligible", label: "Non-Eligible Items" },
                    { id: "cancellation", label: "Order Cancellation" },
                    { id: "process", label: "Return Process" },
                    { id: "refund-methods", label: "Refund Methods" },
                    { id: "exceptions", label: "Special Cases" },
                    { id: "contact", label: "Contact Us" },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="rounded px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-stb-red-light hover:text-primary"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="min-w-0 flex-1">
              {/* Overview */}
              <div
                id="overview"
                className="mb-6 scroll-mt-20 rounded-xl border border-border bg-white p-5 md:p-6"
              >
                <h2 className="mb-3 text-sm font-bold text-foreground md:text-base">
                  Overview
                </h2>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  At Smart Tech Bazaar, we strive to ensure your complete
                  satisfaction with every purchase. We understand that sometimes
                  returns are necessary, and we have designed our policy to be
                  fair and transparent. This policy applies to all products
                  purchased through our website or authorized channels.
                </p>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 p-3">
                  <Clock className="h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs font-medium text-foreground">
                    Return window: 7 days from delivery date
                  </p>
                </div>
              </div>

              {/* Eligible Items */}
              <div
                id="eligible"
                className="mb-6 scroll-mt-20 rounded-xl border border-border bg-white p-5 md:p-6"
              >
                <h2 className="mb-3 text-sm font-bold text-foreground md:text-base">
                  Eligible for Return & Refund
                </h2>
                <div className="space-y-2">
                  {eligibleItems.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      <span className="text-xs text-muted-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Eligible Items */}
              <div
                id="non-eligible"
                className="mb-6 scroll-mt-20 rounded-xl border border-red-100 bg-red-50/50 p-5 md:p-6"
              >
                <h2 className="mb-3 text-sm font-bold text-foreground md:text-base">
                  Not Eligible for Return
                </h2>
                <div className="space-y-2">
                  {nonEligibleItems.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                      <span className="text-xs text-muted-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Cancellation */}
              <div
                id="cancellation"
                className="mb-6 scroll-mt-20 rounded-xl border border-border bg-white p-5 md:p-6"
              >
                <h2 className="mb-3 text-sm font-bold text-foreground md:text-base">
                  Order Cancellation
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="mb-1 text-xs font-semibold text-foreground">
                      Before Dispatch
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Orders can be cancelled free of charge before they are
                      dispatched. Simply go to your order history or contact our
                      support team. Full refund will be processed within 3-5
                      business days.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-xs font-semibold text-foreground">
                      After Dispatch
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Once an order has been dispatched, it cannot be cancelled.
                      You may refuse delivery or initiate a return after
                      receiving the product.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-yellow-50 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
                    <p className="text-xs text-yellow-800">
                      <strong>Note:</strong> Cancellation of custom-configured
                      or special order items may incur a 15% restocking fee.
                    </p>
                  </div>
                </div>
              </div>

              {/* Return Process */}
              <div
                id="process"
                className="mb-6 scroll-mt-20 rounded-xl border border-border bg-white p-5 md:p-6"
              >
                <h2 className="mb-4 text-sm font-bold text-foreground md:text-base">
                  Return Process
                </h2>
                <div className="space-y-4">
                  {refundProcess.map((step, index) => (
                    <div key={step.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                          {step.step}
                        </div>
                        {index < refundProcess.length - 1 && (
                          <div className="mt-2 h-full w-px bg-border" />
                        )}
                      </div>
                      <div className="pb-4">
                        <h3 className="text-xs font-semibold text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refund Methods */}
              <div
                id="refund-methods"
                className="mb-6 scroll-mt-20 rounded-xl border border-border bg-white p-5 md:p-6"
              >
                <h2 className="mb-4 text-sm font-bold text-foreground md:text-base">
                  Refund Methods & Timelines
                </h2>
                <div className="space-y-3">
                  {refundMethods.map((method) => (
                    <div
                      key={method.method}
                      className="rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-foreground">
                          {method.method}
                        </h3>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {method.timeline}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Cases */}
              <div
                id="exceptions"
                className="mb-6 scroll-mt-20 rounded-xl border border-border bg-white p-5 md:p-6"
              >
                <h2 className="mb-3 text-sm font-bold text-foreground md:text-base">
                  Special Cases & Exceptions
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="mb-1 text-xs font-semibold text-foreground">
                      Warranty Claims
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Products covered under manufacturer warranty should be
                      serviced at authorized service centers. We will assist you
                      in initiating warranty claims and provide necessary
                      documentation.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-xs font-semibold text-foreground">
                      Bulk/B2B Orders
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Bulk orders have special return terms. Please contact our
                      B2B support team for bulk order refunds or exchanges.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-xs font-semibold text-foreground">
                      Promotional Items
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Products purchased during sales or with discount codes
                      follow the same return policy. Refund amount will be the
                      actual amount paid, not the MRP.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div
                id="contact"
                className="rounded-xl bg-stb-dark p-5 text-white md:p-6"
              >
                <h2 className="text-sm font-bold md:text-base">
                  Need Help with a Return?
                </h2>
                <p className="mt-1.5 text-xs text-white/60">
                  Our customer support team is available Monday to Saturday, 9
                  AM to 7 PM IST. We typically respond within 4 hours during
                  business hours.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <a
                    href="mailto:support@smarttechbazaar.com"
                    className="flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-medium text-white hover:bg-stb-red-dark"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    support@smarttechbazaar.com
                  </a>
                  <a
                    href="tel:+919353919299"
                    className="flex h-9 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 text-xs font-medium text-white hover:bg-white/20"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    +91 93539 19299
                  </a>
                </div>
                <p className="mt-4 text-[10px] text-white/40">
                  For faster resolution, please have your order number ready
                  when contacting us.
                </p>
              </div>

              {/* Related links */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/terms"
                  className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-white px-3 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                >
                  Terms & Conditions
                  <ChevronRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/privacy"
                  className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-white px-3 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                >
                  Privacy Policy
                  <ChevronRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/shipping"
                  className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-white px-3 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                >
                  Shipping Info
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";

interface OrderSuccessPageProps {
  searchParams: Promise<{ orderId?: string; orderNumber?: string }>;
}

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const { orderId, orderNumber } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-md text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-stb-success/10">
            <CheckCircle className="h-10 w-10 text-stb-success" />
          </div>

          {/* Title */}
          <h1 className="heading-xl text-foreground">Order Placed!</h1>
          <p className="body-lg mt-3 text-muted-foreground">
            Thank you for your order. We&apos;ve received your order and will
            begin processing it soon.
          </p>

          {/* Order Number */}
          {(orderNumber || orderId) && (
            <div className="mx-auto mt-6 rounded-lg bg-muted/50 px-6 py-4">
              <p className="body-sm text-muted-foreground">Order Number</p>
              <p className="font-mono text-lg font-bold text-foreground">
                {orderNumber || orderId?.slice(-8).toUpperCase()}
              </p>
            </div>
          )}

          {/* Info Cards */}
          <div className="mt-8 grid gap-4 text-left">
            <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Order Confirmation
                </h3>
                <p className="body-sm text-muted-foreground">
                  You will receive an email confirmation shortly with your order
                  details.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stb-success/10">
                <CheckCircle className="h-5 w-5 text-stb-success" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Estimated Delivery
                </h3>
                <p className="body-sm text-muted-foreground">
                  Your order will be delivered within 2-5 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <Link href={orderId ? `/dashboard/orders/${orderId}` : "/dashboard/orders"}>
              <Button className="w-full gap-2" size="lg">
                <Package className="h-4 w-4" />
                Track Your Order
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full gap-2" size="lg">
                <Home className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

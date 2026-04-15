"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface CartItem {
  product: {
    _id: string;
    name: string;
    slug: string;
    images?: string[];
    priceB2C: number;
    priceB2B: number;
    mrp: number;
    stock: number;
    brand?: string;
  };
  quantity: number;
  price: number;
  total: number;
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isB2B, setIsB2B] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/cart");
      return;
    }

    if (status === "authenticated") {
      fetchCart();
    }
  }, [status, router]);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setIsB2B(data.isB2B || false);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    setUpdatingItems((prev) => new Set(prev).add(productId));

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeItem = async (productId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(productId));

    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">Shopping Cart</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="heading-xl mb-8">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-card py-16 shadow-sm">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <h2 className="heading-lg mt-6">Your cart is empty</h2>
              <p className="body-md mt-2 text-muted-foreground">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <Link href="/" className="mt-6">
                <Button className="gap-2">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="rounded-xl border border-border bg-card shadow-sm">
                  <div className="border-b border-border px-6 py-4">
                    <h2 className="heading-md">
                      Cart Items ({items.length})
                    </h2>
                    {isB2B && (
                      <p className="body-sm text-stb-success">
                        Viewing B2B wholesale prices
                      </p>
                    )}
                  </div>

                  <div className="divide-y divide-border">
                    {items.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex gap-4 p-6"
                      >
                        {/* Product Image */}
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted"
                        >
                          <Image
                            src={
                              item.product.images?.[0] ||
                              "https://via.placeholder.com/100"
                            }
                            alt={item.product.name}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col gap-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              {item.product.brand && (
                                <span className="body-sm text-muted-foreground">
                                  {item.product.brand}
                                </span>
                              )}
                              <Link href={`/product/${item.product.slug}`}>
                                <h3 className="heading-sm line-clamp-2 hover:text-primary">
                                  {item.product.name}
                                </h3>
                              </Link>
                            </div>
                            <button
                              onClick={() => removeItem(item.product._id)}
                              disabled={updatingItems.has(item.product._id)}
                              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                            >
                              {updatingItems.has(item.product._id) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2">
                            <span className="heading-md text-primary">
                              ₹{item.price.toLocaleString("en-IN")}
                            </span>
                            {item.product.mrp > item.price && (
                              <span className="body-sm text-muted-foreground line-through">
                                ₹{item.product.mrp.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-lg border border-border">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product._id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={
                                  item.quantity <= 1 ||
                                  updatingItems.has(item.product._id)
                                }
                                className="p-2 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-10 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product._id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  item.quantity >= item.product.stock ||
                                  updatingItems.has(item.product._id)
                                }
                                className="p-2 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <span className="heading-md">
                              ₹{item.total.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="heading-md mb-4">Order Summary</h2>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-stb-success">
                        Calculated at checkout
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">Included</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-primary">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Link href="/checkout" className="mt-6 block">
                    <Button className="w-full gap-2" size="lg">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Link
                    href="/"
                    className="mt-3 block text-center text-sm text-muted-foreground hover:text-primary"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

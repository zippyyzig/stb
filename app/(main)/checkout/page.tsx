"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  Loader2,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  Plus,
} from "lucide-react";

interface CartItem {
  product: {
    _id: string;
    name: string;
    slug: string;
    images?: string[];
    priceB2C: number;
    priceB2B: number;
    stock: number;
  };
  quantity: number;
  price: number;
  total: number;
}

interface Address {
  _id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const [shippingCost, setShippingCost] = useState(99);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/checkout");
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

      if (!data.items || data.items.length === 0) {
        router.push("/cart");
        return;
      }

      setItems(data.items);
      setTotal(data.total);

      // Set shipping based on total
      if (data.total >= 5000) {
        setShippingCost(0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveAddress = () => {
    if (
      !newAddress.name ||
      !newAddress.phone ||
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      alert("Please fill all address fields");
      return;
    }

    setSelectedAddress({
      _id: "new",
      ...newAddress,
      isDefault: true,
    });
    setShowAddressForm(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please add a delivery address");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
          image: item.product.images?.[0],
        })),
        shippingAddress: selectedAddress,
        subtotal: total,
        shippingCost,
        total: total + shippingCost,
        paymentMethod,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        if (paymentMethod === "razorpay" && data.razorpayOrderId) {
          // Initiate Razorpay payment
          // TODO: Implement Razorpay payment
          alert("Razorpay payment coming soon. Using COD for now.");
        }

        // Clear cart and redirect to success
        await fetch("/api/cart", { method: "DELETE" });
        router.push(`/order-success?orderId=${data.order._id}`);
      } else {
        alert(data.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
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

  const grandTotal = total + shippingCost;

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
            <Link
              href="/cart"
              className="text-muted-foreground hover:text-primary"
            >
              Cart
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">Checkout</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="heading-xl mb-8">Checkout</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Delivery Address */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h2 className="heading-md">Delivery Address</h2>
                </div>

                {selectedAddress && !showAddressForm ? (
                  <div className="rounded-lg border border-primary bg-primary/5 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{selectedAddress.name}</p>
                        <p className="body-sm text-muted-foreground">
                          {selectedAddress.phone}
                        </p>
                        <p className="body-sm mt-2 text-muted-foreground">
                          {selectedAddress.address}, {selectedAddress.city},{" "}
                          {selectedAddress.state} - {selectedAddress.pincode}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="body-sm mb-1.5 block font-medium">
                          Full Name
                        </label>
                        <Input
                          name="name"
                          value={newAddress.name}
                          onChange={handleAddressChange}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <label className="body-sm mb-1.5 block font-medium">
                          Phone Number
                        </label>
                        <Input
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleAddressChange}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="body-sm mb-1.5 block font-medium">
                        Address
                      </label>
                      <Input
                        name="address"
                        value={newAddress.address}
                        onChange={handleAddressChange}
                        placeholder="House no., Building, Street, Area"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="body-sm mb-1.5 block font-medium">
                          City
                        </label>
                        <Input
                          name="city"
                          value={newAddress.city}
                          onChange={handleAddressChange}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="body-sm mb-1.5 block font-medium">
                          State
                        </label>
                        <Input
                          name="state"
                          value={newAddress.state}
                          onChange={handleAddressChange}
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="body-sm mb-1.5 block font-medium">
                          Pincode
                        </label>
                        <Input
                          name="pincode"
                          value={newAddress.pincode}
                          onChange={handleAddressChange}
                          placeholder="Pincode"
                        />
                      </div>
                    </div>

                    <Button onClick={handleSaveAddress} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Save Address
                    </Button>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <h2 className="heading-md">Payment Method</h2>
                </div>

                <div className="flex flex-col gap-3">
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                      paymentMethod === "cod"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="h-4 w-4 text-primary"
                    />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="body-sm text-muted-foreground">
                        Pay when you receive your order
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                      paymentMethod === "razorpay"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="h-4 w-4 text-primary"
                    />
                    <div>
                      <p className="font-medium">Pay Online (Razorpay)</p>
                      <p className="body-sm text-muted-foreground">
                        UPI, Cards, Net Banking, Wallets
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="heading-md mb-4">Order Summary</h2>

                {/* Items Preview */}
                <div className="mb-4 max-h-48 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex items-center gap-3"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={
                            item.product.images?.[0] ||
                            "https://via.placeholder.com/50"
                          }
                          alt={item.product.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <p className="body-sm line-clamp-1 font-medium">
                          {item.product.name}
                        </p>
                        <p className="body-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="body-sm font-medium">
                        ₹{item.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Totals */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span
                      className={
                        shippingCost === 0 ? "text-stb-success" : "font-medium"
                      }
                    >
                      {shippingCost === 0
                        ? "FREE"
                        : `₹${shippingCost.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                  {total < 5000 && (
                    <p className="body-sm text-muted-foreground">
                      Add ₹{(5000 - total).toLocaleString("en-IN")} more for
                      free shipping
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-primary">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddress || isPlacingOrder}
                  className="mt-6 w-full gap-2"
                  size="lg"
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="mt-6 flex flex-col gap-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-stb-success" />
                    Secure checkout
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 text-primary" />
                    Fast delivery in 2-5 days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

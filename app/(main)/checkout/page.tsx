"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
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
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// Razorpay types
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

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

interface TaxBreakdown {
  taxType: "INTRA" | "INTER";
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  customerState: string;
  isIntraState: boolean;
}

interface PaymentOrderResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  breakdown: {
    items: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
      total: number;
    }>;
    subtotal: number;
    shippingCost: number;
    discount: number;
    taxBreakdown: TaxBreakdown;
    total: number;
  };
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("razorpay");
  const [shippingCost, setShippingCost] = useState(99);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  
  // Tax breakdown state
  const [taxBreakdown, setTaxBreakdown] = useState<TaxBreakdown | null>(null);
  const [isCalculatingTax, setIsCalculatingTax] = useState(false);

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
      fetchSavedAddresses();
    }
  }, [status, router]);

  // Calculate tax when address changes (lightweight endpoint, no Razorpay order created)
  const calculateTax = useCallback(async (address: Address) => {
    if (!address || items.length === 0) return;

    setIsCalculatingTax(true);
    try {
      const response = await fetch("/api/payment/calculate-tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
          shippingAddress: {
            state: address.state,
          },
        }),
      });

      const data = await response.json();
      
      if (data.success && data.breakdown) {
        setTaxBreakdown(data.breakdown.taxBreakdown);
        setShippingCost(data.breakdown.shippingCost);
      }
    } catch (error) {
      console.error("Error calculating tax:", error);
    } finally {
      setIsCalculatingTax(false);
    }
  }, [items]);

  // Recalculate tax when address or items change
  useEffect(() => {
    if (selectedAddress && items.length > 0) {
      calculateTax(selectedAddress);
    }
  }, [selectedAddress, calculateTax]);

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

  const fetchSavedAddresses = async () => {
    try {
      const res = await fetch("/api/user/addresses");
      const data = await res.json();
      if (data.addresses && data.addresses.length > 0) {
        setSavedAddresses(data.addresses);
        // Pre-select the primary address
        const primary = data.addresses.find((a: Address) => a.isDefault) || data.addresses[0];
        setSelectedAddress(primary);
      } else {
        // No saved addresses, show the form
        setShowAddressForm(true);
      }
    } catch {
      setShowAddressForm(true);
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

    const addr: Address = { _id: "new", ...newAddress, isDefault: false };
    setSelectedAddress(addr);
    setShowAddressForm(false);
  };

  const initiateRazorpayPayment = async () => {
    if (!selectedAddress) {
      setOrderError("Please add a delivery address");
      return;
    }

    if (!razorpayLoaded) {
      setOrderError("Payment system is loading. Please try again.");
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      // Step 1: Create Razorpay order on server
      const createOrderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
          shippingAddress: {
            name: selectedAddress.name,
            phone: selectedAddress.phone,
            address: selectedAddress.address,
            city: selectedAddress.city,
            state: selectedAddress.state,
            pincode: selectedAddress.pincode,
          },
        }),
      });

      const orderData: PaymentOrderResponse = await createOrderResponse.json();

      if (!createOrderResponse.ok || !orderData.success) {
        throw new Error((orderData as unknown as { error: string }).error || "Failed to create payment order");
      }

      // Step 2: Open Razorpay checkout
      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SabKaTechBazar",
        description: "Order Payment",
        order_id: orderData.orderId,
        prefill: {
          name: orderData.prefill.name,
          email: orderData.prefill.email || "",
          contact: orderData.prefill.contact,
        },
        theme: {
          color: "#FF6B00", // Primary brand color
        },
        handler: async function (response: RazorpayResponse) {
          // Step 3: Verify payment on server
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shippingAddress: {
                  name: selectedAddress.name,
                  phone: selectedAddress.phone,
                  address: selectedAddress.address,
                  city: selectedAddress.city,
                  state: selectedAddress.state,
                  pincode: selectedAddress.pincode,
                },
                items: items.map(item => ({
                  productId: item.product._id,
                  quantity: item.quantity,
                })),
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              // Payment successful - redirect to success page
              router.push(`/order-success?orderId=${verifyData.orderId}&orderNumber=${verifyData.orderNumber}`);
            } else {
              setOrderError(verifyData.error || "Payment verification failed. Please contact support.");
              setIsPlacingOrder(false);
            }
          } catch {
            setOrderError("Payment verification failed. Please contact support if amount was deducted.");
            setIsPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsPlacingOrder(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Payment error:", error);
      setOrderError(error instanceof Error ? error.message : "Failed to initiate payment. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  const handlePlaceCODOrder = async () => {
    if (!selectedAddress) {
      setOrderError("Please add a delivery address");
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);

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
        total: grandTotal,
        paymentMethod: "cod",
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear cart and redirect to success
        await fetch("/api/cart", { method: "DELETE" });
        router.push(`/order-success?orderId=${data.order._id}`);
      } else {
        setOrderError(data.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderError("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "razorpay") {
      initiateRazorpayPayment();
    } else {
      handlePlaceCODOrder();
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

  // Calculate totals including tax
  const taxAmount = taxBreakdown?.totalTax || 0;
  const grandTotal = total + shippingCost + taxAmount;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Load Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        strategy="lazyOnload"
      />
      
      <Header />
      <main className="flex-1 bg-background pb-32 md:pb-0">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-3 py-2.5 text-xs md:gap-2 md:px-4 md:py-3 md:text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground md:h-4 md:w-4" />
            <Link
              href="/cart"
              className="text-muted-foreground hover:text-primary"
            >
              Cart
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground md:h-4 md:w-4" />
            <span className="text-foreground">Checkout</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-8">
          <h1 className="heading-xl mb-4 md:mb-8">Checkout</h1>

          {/* Error Alert */}
          {orderError && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-red-800 md:mb-6 md:gap-3 md:p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 md:h-5 md:w-5" />
              <p className="text-xs md:text-sm">{orderError}</p>
              <button
                onClick={() => setOrderError(null)}
                className="ml-auto shrink-0 text-red-600 hover:text-red-800"
              >
                <span className="text-xs">Dismiss</span>
              </button>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Delivery Address */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h2 className="heading-md">Delivery Address</h2>
                </div>

                {/* Saved addresses */}
                {savedAddresses.length > 0 && !showAddressForm && (
                  <div className="space-y-2 mb-4">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr._id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors md:p-4 ${
                          selectedAddress?._id === addr._id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress?._id === addr._id}
                          onChange={() => setSelectedAddress(addr)}
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-sm font-medium">{addr.name}</p>
                            {addr.isDefault && (
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="body-sm text-muted-foreground">{addr.phone}</p>
                          <p className="body-sm mt-0.5 break-words text-muted-foreground">
                            {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      </label>
                    ))}
                    <button
                      onClick={() => { setShowAddressForm(true); setSelectedAddress(null); }}
                      className="flex items-center gap-2 text-sm text-primary hover:underline mt-1"
                    >
                      <Plus className="h-4 w-4" />
                      Use a different address
                    </button>
                  </div>
                )}

                {/* New address form */}
                {showAddressForm && (
                  <div className="space-y-4">
                    {savedAddresses.length > 0 && (
                      <button
                        onClick={() => { setShowAddressForm(false); setSelectedAddress(savedAddresses.find((a) => a.isDefault) || savedAddresses[0]); }}
                        className="text-sm text-primary hover:underline"
                      >
                        Use saved address
                      </button>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="body-sm mb-1.5 block font-medium">Full Name</label>
                        <Input
                          name="name"
                          value={newAddress.name}
                          onChange={handleAddressChange}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <label className="body-sm mb-1.5 block font-medium">Phone Number</label>
                        <Input
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleAddressChange}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="body-sm mb-1.5 block font-medium">Address</label>
                      <Input
                        name="address"
                        value={newAddress.address}
                        onChange={handleAddressChange}
                        placeholder="House no., Building, Street, Area"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="body-sm mb-1.5 block font-medium">City</label>
                        <Input
                          name="city"
                          value={newAddress.city}
                          onChange={handleAddressChange}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="body-sm mb-1.5 block font-medium">State</label>
                        <Input
                          name="state"
                          value={newAddress.state}
                          onChange={handleAddressChange}
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="body-sm mb-1.5 block font-medium">Pincode</label>
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
                      Use This Address
                    </Button>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <h2 className="heading-md">Payment Method</h2>
                </div>

                <div className="flex flex-col gap-3">
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Pay Online (Razorpay)</p>
                        <span className="text-[10px] font-semibold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                          Recommended
                        </span>
                      </div>
                      <p className="body-sm text-muted-foreground">
                        UPI, Cards, Net Banking, Wallets
                      </p>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </label>

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

                  {/* GST Breakdown */}
                  {taxBreakdown && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          GST ({taxBreakdown.taxType === "INTRA" ? "Intra-State" : "Inter-State"})
                        </span>
                        {taxBreakdown.customerState && (
                          <span className="text-xs text-muted-foreground">
                            {taxBreakdown.customerState}
                          </span>
                        )}
                      </div>
                      
                      {taxBreakdown.isIntraState ? (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">CGST @9%</span>
                            <span>₹{taxBreakdown.cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">SGST @9%</span>
                            <span>₹{taxBreakdown.sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">IGST @18%</span>
                          <span>₹{taxBreakdown.igst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm font-medium border-t border-border pt-2">
                        <span>Total Tax</span>
                        <span>₹{taxBreakdown.totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  )}

                  {isCalculatingTax && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Calculating tax...
                    </div>
                  )}

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
                    ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddress || isPlacingOrder || isCalculatingTax}
                  className="mt-6 w-full gap-2"
                  size="lg"
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {paymentMethod === "razorpay" ? "Processing..." : "Placing Order..."}
                    </>
                  ) : (
                    <>
                      {paymentMethod === "razorpay" ? "Pay Now" : "Place Order"}
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="mt-6 flex flex-col gap-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-stb-success" />
                    Secure checkout with Razorpay
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-stb-success" />
                    GST Invoice included
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

      {/* ── Sticky mobile place-order bar ──────────────────────────────────── */}
      <div
        className="fixed left-0 right-0 z-40 flex items-center justify-between gap-3 border-t border-border bg-white px-4 py-3 shadow-xl md:hidden"
        style={{ bottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground">
            {isCalculatingTax ? "Calculating..." : `${items.length} item${items.length !== 1 ? "s" : ""}`}
          </p>
          <p className="text-base font-extrabold text-foreground">
            ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <Button
          onClick={handlePlaceOrder}
          disabled={!selectedAddress || isPlacingOrder || isCalculatingTax}
          className="shrink-0 gap-2 press-active"
          size="default"
        >
          {isPlacingOrder ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {paymentMethod === "razorpay" ? "Processing..." : "Placing..."}
            </>
          ) : (
            <>
              {paymentMethod === "razorpay" ? "Pay Now" : "Place Order"}
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <Footer />
    </div>
  );
}

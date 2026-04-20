"use client";

import { createContext, useContext, useCallback, useMemo, ReactNode } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";

// Types
interface CartProduct {
  _id: string;
  name: string;
  slug: string;
  images?: string[];
  priceB2C: number;
  priceB2B: number;
  mrp: number;
  stock: number;
  brand?: string;
}

interface CartItem {
  product: CartProduct;
  quantity: number;
  price: number;
  total: number;
}

interface WishlistProduct {
  _id: string;
  name: string;
  slug: string;
  images?: string[];
  priceB2C: number;
  priceB2B: number;
  mrp: number;
  stock: number;
  brand?: string;
  isActive: boolean;
}

interface WishlistItem {
  product: WishlistProduct;
  addedAt: string;
}

interface CartData {
  items: CartItem[];
  total: number;
  isB2B: boolean;
}

interface WishlistData {
  items: WishlistItem[];
  count: number;
}

interface CartWishlistContextType {
  // Cart
  cart: CartData | null;
  cartCount: number;
  cartTotal: number;
  isCartLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => void;
  
  // Wishlist
  wishlist: WishlistData | null;
  wishlistCount: number;
  isWishlistLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  refreshWishlist: () => void;
}

const CartWishlistContext = createContext<CartWishlistContextType | null>(null);

// Fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function CartWishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Cart SWR
  const {
    data: cartData,
    mutate: mutateCart,
    isLoading: isCartLoading,
  } = useSWR<CartData>(
    isAuthenticated ? "/api/cart" : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  // Wishlist SWR
  const {
    data: wishlistData,
    mutate: mutateWishlist,
    isLoading: isWishlistLoading,
  } = useSWR<WishlistData>(
    isAuthenticated ? "/api/wishlist" : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  // Cart count
  const cartCount = useMemo(() => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartData]);

  // Cart total
  const cartTotal = useMemo(() => {
    return cartData?.total || 0;
  }, [cartData]);

  // Wishlist count
  const wishlistCount = useMemo(() => {
    return wishlistData?.items?.length || 0;
  }, [wishlistData]);

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId: string) => {
      if (!wishlistData?.items) return false;
      return wishlistData.items.some((item) => item.product._id === productId);
    },
    [wishlistData]
  );

  // Add to cart
  const addToCart = useCallback(
    async (productId: string, quantity = 1): Promise<boolean> => {
      if (!isAuthenticated) return false;
      
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });

        if (res.ok) {
          await mutateCart();
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [isAuthenticated, mutateCart]
  );

  // Update cart quantity
  const updateCartQuantity = useCallback(
    async (productId: string, quantity: number): Promise<boolean> => {
      if (!isAuthenticated) return false;

      try {
        const res = await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });

        if (res.ok) {
          await mutateCart();
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [isAuthenticated, mutateCart]
  );

  // Remove from cart
  const removeFromCart = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!isAuthenticated) return false;

      try {
        const res = await fetch(`/api/cart?productId=${productId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          await mutateCart();
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [isAuthenticated, mutateCart]
  );

  // Clear cart
  const clearCart = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (res.ok) {
        await mutateCart();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [isAuthenticated, mutateCart]);

  // Add to wishlist
  const addToWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!isAuthenticated) return false;

      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });

        if (res.ok) {
          await mutateWishlist();
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [isAuthenticated, mutateWishlist]
  );

  // Remove from wishlist
  const removeFromWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!isAuthenticated) return false;

      try {
        const res = await fetch(`/api/wishlist?productId=${productId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          await mutateWishlist();
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [isAuthenticated, mutateWishlist]
  );

  // Toggle wishlist
  const toggleWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (isInWishlist(productId)) {
        return removeFromWishlist(productId);
      } else {
        return addToWishlist(productId);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  // Refresh functions
  const refreshCart = useCallback(() => {
    mutateCart();
  }, [mutateCart]);

  const refreshWishlist = useCallback(() => {
    mutateWishlist();
  }, [mutateWishlist]);

  const value = useMemo(
    () => ({
      // Cart
      cart: cartData || null,
      cartCount,
      cartTotal,
      isCartLoading,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      refreshCart,
      // Wishlist
      wishlist: wishlistData || null,
      wishlistCount,
      isWishlistLoading,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      refreshWishlist,
    }),
    [
      cartData,
      cartCount,
      cartTotal,
      isCartLoading,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      refreshCart,
      wishlistData,
      wishlistCount,
      isWishlistLoading,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      refreshWishlist,
    ]
  );

  return (
    <CartWishlistContext.Provider value={value}>
      {children}
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error("useCartWishlist must be used within CartWishlistProvider");
  }
  return context;
}

// Convenience hooks
export function useCart() {
  const {
    cart,
    cartCount,
    cartTotal,
    isCartLoading,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  } = useCartWishlist();
  
  return {
    cart,
    cartCount,
    cartTotal,
    isLoading: isCartLoading,
    addToCart,
    updateQuantity: updateCartQuantity,
    removeItem: removeFromCart,
    clearCart,
    refresh: refreshCart,
  };
}

export function useWishlist() {
  const {
    wishlist,
    wishlistCount,
    isWishlistLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refreshWishlist,
  } = useCartWishlist();
  
  return {
    wishlist,
    wishlistCount,
    isLoading: isWishlistLoading,
    isInWishlist,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    toggle: toggleWishlist,
    refresh: refreshWishlist,
  };
}

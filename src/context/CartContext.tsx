import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CartItem, Product } from '../types/index.js';

interface AppliedCoupon {
  code: string;
  discount: number;
  message: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'akash_telecom_cart_v1';
const COUPON_STORAGE_KEY = 'akash_telecom_coupon_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed saving cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed saving coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    const chosenColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedColor === chosenColor
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = Math.min(product.stock, next[existingIndex].quantity + quantity);
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        return next;
      }

      return [
        ...prev,
        {
          productId: product.id,
          product,
          quantity: Math.min(product.stock, Math.max(1, quantity)),
          selectedColor: chosenColor,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, color?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.selectedColor === color))
    );
  };

  const updateQuantity = (productId: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.selectedColor === color) {
          const maxStock = item.product.stock || 99;
          return { ...item, quantity: Math.min(maxStock, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.discountedPrice * item.quantity,
    0
  );

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!code.trim()) {
      return { success: false, message: 'Please enter a coupon code' };
    }
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({
          code: code.toUpperCase().trim(),
          discount: data.discount,
          message: data.message,
        });
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Invalid coupon' };
      }
    } catch {
      // Offline fallback validation
      if (code.toUpperCase().trim() === 'AKASH10') {
        const disc = Math.min(500, Math.round(subtotal * 0.1));
        setAppliedCoupon({
          code: 'AKASH10',
          discount: disc,
          message: '10% discount applied!',
        });
        return { success: true, message: '10% discount applied!' };
      }
      return { success: false, message: 'Failed to validate coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext.js';
import { WishlistProvider } from './context/WishlistContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { CartDrawer } from './components/cart/CartDrawer.js';
import { SearchModal } from './components/common/SearchModal.js';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp.js';

import { HomeView } from './views/HomeView.js';
import { ShopView } from './views/ShopView.js';
import { CategoriesView } from './views/CategoriesView.js';
import { ProductDetailView } from './views/ProductDetailView.js';
import { CheckoutView } from './views/CheckoutView.js';
import { OrderTrackingView } from './views/OrderTrackingView.js';
import { WishlistView } from './views/WishlistView.js';
import { ContactView } from './views/ContactView.js';
import { AdminDashboardView } from './views/AdminDashboardView.js';

import type { Product, Category } from './types/index.js';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [directBuyItem, setDirectBuyItem] = useState<{ product: Product; quantity: number; color?: string } | undefined>(undefined);
  const [trackParams, setTrackParams] = useState<{ orderId?: string; phone?: string }>({});

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'bn'>('en');

  // Admin login session
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('akash_telecom_admin') === 'true';
    } catch {
      return false;
    }
  });

  // Fetch initial products and categories from backend
  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(Array.isArray(prodData) ? prodData : []);
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Scroll to top on navigation
  const navigateTo = (view: string, data?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    if (view !== 'checkout') {
      setDirectBuyItem(undefined);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    navigateTo('detail');
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryFilter(categoryId);
    navigateTo('shop');
  };

  const handleBuyNow = (product: Product, quantity: number, color?: string) => {
    setDirectBuyItem({ product, quantity, color });
    navigateTo('checkout');
  };

  const handleTrackOrder = (orderId: string, phone: string) => {
    setTrackParams({ orderId, phone });
    navigateTo('track');
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    try {
      localStorage.setItem('akash_telecom_admin', 'true');
    } catch {}
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('akash_telecom_admin');
    } catch {}
    navigateTo('home');
  };

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1D2939] antialiased">
          {/* Main Navigation */}
          <Navbar
            currentView={currentView}
            onNavigate={navigateTo}
            onOpenSearch={() => setIsSearchOpen(true)}
            lang={lang}
            onToggleLang={() => setLang(lang === 'en' ? 'bn' : 'en')}
            isAdmin={isAdmin}
          />

          {/* Search Dialog */}
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectProduct={handleSelectProduct}
            onViewCategory={handleSelectCategory}
            products={products}
          />

          {/* Cart Drawer */}
          <CartDrawer
            onProceedToCheckout={() => navigateTo('checkout')}
            onContinueShopping={() => navigateTo('shop')}
          />

          {/* Dynamic Page Views */}
          <main className="flex-1">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-slate-600">Loading Akash Telecom Catalog...</p>
              </div>
            ) : (
              <>
                {currentView === 'home' && (
                  <HomeView
                    products={products}
                    categories={categories}
                    onSelectProduct={handleSelectProduct}
                    onSelectCategory={handleSelectCategory}
                    onNavigateShop={() => navigateTo('shop')}
                    onNavigateTrack={() => navigateTo('track')}
                    lang={lang}
                  />
                )}

                {currentView === 'shop' && (
                  <ShopView
                    products={products}
                    categories={categories}
                    initialCategory={selectedCategoryFilter}
                    onSelectProduct={handleSelectProduct}
                    lang={lang}
                  />
                )}

                {currentView === 'categories' && (
                  <CategoriesView
                    categories={categories}
                    onSelectCategory={handleSelectCategory}
                  />
                )}

                {currentView === 'detail' && selectedProduct && (
                  <ProductDetailView
                    product={selectedProduct}
                    allProducts={products}
                    onBack={() => navigateTo('shop')}
                    onSelectProduct={handleSelectProduct}
                    onBuyNow={handleBuyNow}
                    lang={lang}
                  />
                )}

                {currentView === 'checkout' && (
                  <CheckoutView
                    onBack={() => navigateTo('shop')}
                    onNavigateHome={() => navigateTo('home')}
                    onTrackOrder={handleTrackOrder}
                    directBuyItem={directBuyItem}
                  />
                )}

                {currentView === 'track' && (
                  <OrderTrackingView
                    initialOrderId={trackParams.orderId}
                    initialPhone={trackParams.phone}
                  />
                )}

                {currentView === 'wishlist' && (
                  <WishlistView
                    products={products}
                    onSelectProduct={handleSelectProduct}
                    onNavigateShop={() => navigateTo('shop')}
                    lang={lang}
                  />
                )}

                {currentView === 'contact' && <ContactView />}

                {currentView === 'admin' && (
                  <AdminDashboardView
                    isAdmin={isAdmin}
                    onAdminLogin={handleAdminLogin}
                    onAdminLogout={handleAdminLogout}
                  />
                )}
              </>
            )}
          </main>

          {/* Floating WhatsApp Support Trigger */}
          <FloatingWhatsApp />

          {/* Footer */}
          <Footer onNavigate={navigateTo} />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

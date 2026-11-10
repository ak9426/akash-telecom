import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, data?: any) => void;
  onOpenSearch: () => void;
  lang: 'en' | 'bn';
  onToggleLang: () => void;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  lang,
  onToggleLang,
  isAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementClosed, setAnnouncementClosed] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const navLinks = [
    { id: 'home', label: lang === 'bn' ? 'হোম' : 'Home' },
    { id: 'shop', label: lang === 'bn' ? 'শপ' : 'Shop' },
    { id: 'categories', label: lang === 'bn' ? 'ক্যাটাগরি' : 'Categories' },
    { id: 'track', label: lang === 'bn' ? 'ট্র্যাক অর্ডার' : 'Track Order' },
    { id: 'contact', label: lang === 'bn' ? 'যোগাযোগ' : 'Contact' },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* 1. Announcement Bar (Promotional & Hotline) */}
      {!announcementClosed && (
        <div className="bg-[#101828] text-white text-xs py-2 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                <Truck className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Free Delivery on Orders over ৳2,000</span>
                <span className="sm:hidden">Free Delivery ৳2,000+</span>
              </span>
              <span className="text-slate-500 hidden md:inline">|</span>
              <span className="hidden md:flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                100% Authentic Tech & Official Warranty
              </span>
            </div>

            <div className="flex items-center gap-4 shrink-0 text-slate-300">
              <a
                href="tel:+8801864015928"
                className="flex items-center gap-1 hover:text-white transition-colors"
                title="Call Akash Telecom"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden lg:inline">+8801864015928</span>
                <span className="lg:hidden">01864015928</span>
              </a>

              <button
                onClick={onToggleLang}
                className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
                title="Switch Language"
              >
                {lang === 'en' ? 'বাংলা' : 'English'}
              </button>

              <button
                onClick={() => setAnnouncementClosed(true)}
                className="text-slate-400 hover:text-white p-0.5 transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav Links) - Zone 3 (Action Area) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16 sm:h-20">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1 -ml-1 transition-transform active:scale-98"
          >
            <BrandLogo size="md" showTagline={false} />
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${
                    isActive ? 'text-blue-600 font-semibold' : 'text-slate-700'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions Cluster (Search, Wishlist, Cart Drawer, Account/Admin) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Search products"
              title="Search tech accessories"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => handleNavClick('wishlist')}
              className="relative p-2 text-slate-700 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="View wishlist"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-rose-500 rounded-full px-1">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm active:scale-98"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold hidden sm:inline">
                {lang === 'bn' ? 'কার্ট' : 'Cart'}
              </span>
              <span className="flex items-center justify-center min-w-[18px] h-[18px] text-[11px] font-bold text-slate-900 bg-cyan-400 rounded-full px-1">
                {totalItems}
              </span>
            </button>

            {/* Admin / Portal Trigger */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-lg transition-colors ${
                isAdmin
                  ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
              }`}
              title={isAdmin ? 'Admin Dashboard (Active)' : 'Admin Login / Portal'}
              aria-label="Store Admin Portal"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-150">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  currentView === link.id
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
              </button>
            ))}

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 text-white"
              >
                <span>{isAdmin ? 'Admin Dashboard (Logged In)' : 'Admin / Store Owner Login'}</span>
                <User className="w-4 h-4 text-cyan-400" />
              </button>

              <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-500">
                <span>Direct Hotline:</span>
                <a href="tel:+8801864015928" className="font-semibold text-blue-600">
                  +8801864015928
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

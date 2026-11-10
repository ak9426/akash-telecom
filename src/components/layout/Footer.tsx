import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo.js';
import { getWhatsAppLink } from '../../utils/formatters.js';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#101828] text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info & Tagline (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" light showTagline />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mt-2">
              Akash Telecom is Bangladesh's trusted technology and mobile accessories retailer. We bring you authentic GaN chargers, ANC wireless earbuds, smartwatches, and computer accessories with official replacement warranty.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="tel:+8801864015928" className="hover:text-white transition-colors">
                  +8801864015928 / 01864015928
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="mailto:khanakash9426@gmail.com" className="hover:text-white transition-colors">
                  khanakash9426@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Sector-07, Uttara, Dhaka-1230, Bangladesh</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={getWhatsAppLink('01864015928', 'Hello Akash Telecom!')}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="WhatsApp Hotline"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-white transition-colors">
                  Product Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('track')} className="hover:text-white transition-colors">
                  Track Live Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-white transition-colors">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  GaN Fast Chargers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  ANC Wireless Earbuds
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  AMOLED Smartwatches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Laptop Power Banks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Braided Cables & Hubs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Gaming Gear & Headsets
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Administration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Customer Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>Steadfast & Pathao Courier</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Official Brand Replacement</span>
              </li>
              <li className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>7-Day Return Warranty</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[11px] font-semibold border border-slate-700 transition-colors"
                >
                  Store Owner Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment & Logistics Badges Strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-300">Supported Payments:</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-pink-400 font-bold font-mono">bKash</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-orange-400 font-bold font-mono">Nagad</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-purple-400 font-bold font-mono">Rocket</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-emerald-400 font-bold">Cash on Delivery</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-300">Courier Network:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Steadfast Courier</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Pathao Courier</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">RedX</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} Akash Telecom. All rights reserved. Trade License Registered in Bangladesh.
          </div>
          <div className="flex items-center gap-4">
            <span>Prices in BDT (৳)</span>
            <span>·</span>
            <span>Hotline: +8801864015928</span>
            <span>·</span>
            <span>khanakash9426@gmail.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

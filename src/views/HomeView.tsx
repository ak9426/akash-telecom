import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Star,
  CheckCircle2,
  Tag,
  Sparkles,
  PhoneCall,
  Clock,
  Award,
} from 'lucide-react';
import type { Product, Category } from '../types/index.js';
import { ProductCard } from '../components/product/ProductCard.js';
import { formatBDT } from '../utils/formatters.js';

interface HomeViewProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryId: string) => void;
  onNavigateShop: () => void;
  onNavigateTrack: () => void;
  lang?: 'en' | 'bn';
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  categories,
  onSelectProduct,
  onSelectCategory,
  onNavigateShop,
  onNavigateTrack,
  lang = 'en',
}) => {
  const [productTab, setProductTab] = useState<'best' | 'trending' | 'new'>('best');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Tab filtering
  const displayProducts = products.filter((p) => {
    if (productTab === 'best') return p.isBestSeller;
    if (productTab === 'trending') return p.isTrending;
    return p.isNewArrival;
  }).slice(0, 8);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] pt-6 sm:pt-12 pb-16 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Premier Mobile & Tech Retailer · Bangladesh</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#101828] font-display tracking-tight leading-[1.08] text-balance">
                Your Tech. <br />
                Your Lifestyle. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Our Commitment.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Discover 100% authentic GaN chargers, ANC wireless earbuds, AMOLED smartwatches, and computer gear with official warranty and nationwide Cash on Delivery.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onNavigateShop}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98"
                >
                  <span>Shop Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onNavigateTrack}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-xs transition-all active:scale-98"
                >
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Track Order</span>
                </button>
              </div>

              {/* Trust Micro-Metrics */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-bold text-base text-slate-900 tabular-nums">24-48h</div>
                  <div className="text-slate-500 text-[11px]">Courier In Dhaka</div>
                </div>
                <div>
                  <div className="font-bold text-base text-slate-900 tabular-nums">64 Districts</div>
                  <div className="text-slate-500 text-[11px]">Doorstep Delivery</div>
                </div>
                <div>
                  <div className="font-bold text-base text-slate-900 tabular-nums">100% Original</div>
                  <div className="text-slate-500 text-[11px]">Brand Warranty</div>
                </div>
              </div>
            </div>

            {/* Right Media Column */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-16/10 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
                <img
                  src="/src/assets/images/hero_tech_gadgets_showcase_1794308083890.jpg"
                  alt="Akash Telecom Premium Tech Showcase"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                {/* Floating Highlight Card on Hero */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        GaN Fast Chargers & Noise Cancelling Gear
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Special Promo: Save 10% with code <strong className="text-blue-600 font-mono">AKASH10</strong>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onNavigateShop}
                    className="shrink-0 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>View Deals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Express Courier Shipping</h3>
              <p className="text-xs text-slate-500 mt-0.5">24h inside Dhaka, 48-72h to all 64 districts nationwide.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">100% Genuine Tech</h3>
              <p className="text-xs text-slate-500 mt-0.5">Official brand warranty with verifiable scratch security codes.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Doorstep Cash on Delivery</h3>
              <p className="text-xs text-slate-500 mt-0.5">Inspect parcel upon delivery and pay cash at your doorstep.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Direct WhatsApp Care</h3>
              <p className="text-xs text-slate-500 mt-0.5">Quick assistance on 01864015928 seven days a week.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Explore Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Popular Product Categories
            </h2>
          </div>
          <button
            onClick={onNavigateShop}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 4).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/hero_tech_gadgets_showcase_1794308083890.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                    {cat.itemCount} Items
                  </span>
                  <h3 className="text-sm sm:text-base font-bold font-display line-clamp-1">{cat.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRODUCT SHOWCASE TABS (Best Sellers / Trending / New) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Handpicked Deals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Curated Electronics & Gadgets
            </h2>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {[
              { id: 'best', label: 'Best Sellers' },
              { id: 'trending', label: 'Trending Gear' },
              { id: 'new', label: 'New Arrivals' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setProductTab(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  productTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelectProduct} lang={lang} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onNavigateShop}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98"
          >
            <span>Explore Entire Storefront</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </section>

      {/* 5. PROMOTIONAL DISCOUNT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#101828] via-[#1E293B] to-[#0F172A] text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-mono font-bold">
              <Tag className="w-3.5 h-3.5" />
              <span>COUPON CODE: AKASH10</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight">
              Power Up with 10% Instant Savings on Fast Chargers & Audio
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Use promo code <strong className="text-cyan-400 font-mono">AKASH10</strong> at checkout to save up to ৳500 on all original Anker GaN adapters, Soundcore earbuds, and Baseus power banks.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onNavigateShop}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
              >
                Apply Coupon & Shop
              </button>
              <span className="text-xs text-slate-400">
                Minimum order ৳1,500 · Free delivery on ৳2,000+
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Verified Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
            Trusted by Bangladeshi Tech Enthusiasts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Tanvir Hossain',
              city: 'Dhanmondi, Dhaka',
              product: 'Anker 735 GaNPrime 65W',
              review:
                '100% authentic Anker product! Verified on Anker official site. Charges my MacBook Air and phone at high speed without heating up. Received in 24 hours via Steadfast.',
            },
            {
              name: 'Sadia Rahman',
              city: 'GEC Circle, Chittagong',
              product: 'Soundcore Space A40 ANC',
              review:
                'Soundcore ANC is a blessing for daily commute noise. Akash Telecom verified my bKash payment in 5 minutes and dispatched the same afternoon.',
            },
            {
              name: 'Mehedi Hasan',
              city: 'Zindabazar, Sylhet',
              product: 'Kieslect Ks Pro AMOLED',
              review:
                'Crystal clear Bluetooth calling and super vivid AMOLED screen. Exactly what I was looking for. Highly recommend Akash Telecom for genuine gadgets in Bangladesh!',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{item.review}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-slate-500 text-[11px]">{item.city}</div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. NEWSLETTER / VOUCHER SIGNUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center max-w-3xl mx-auto shadow-xl">
          <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            Get ৳100 Off Your First Tech Purchase
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2">
            Join the Akash Telecom newsletter for early flash deal announcements, tech releases, and exclusive Bangladesh courier promotions.
          </p>

          {newsletterSuccess ? (
            <div className="mt-6 p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs text-emerald-300 max-w-md mx-auto">
              🎉 Thank you for subscribing! Use coupon code <strong className="font-mono text-white text-sm">WELCOME50</strong> at checkout for ৳100 flat discount!
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md"
              >
                Claim ৳100 Voucher
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

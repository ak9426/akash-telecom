import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Zap,
  Heart,
  MessageCircle,
  Check,
  CheckCircle2,
  Package,
} from 'lucide-react';
import type { Product, Review } from '../types/index.js';
import { formatBDT, getWhatsAppLink } from '../utils/formatters.js';
import { useCart } from '../context/CartContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { ProductCard } from '../components/product/ProductCard.js';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (p: Product) => void;
  onBuyNow: (p: Product, qty: number, color?: string) => void;
  lang?: 'en' | 'bn';
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onBuyNow,
  lang = 'en',
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [activeImage, setActiveImage] = useState(product.images[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'box'>('specs');

  // Review submission state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewDistrict, setNewReviewDistrict] = useState('Dhaka');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Fetch reviews on mount
  React.useEffect(() => {
    setLoadingReviews(true);
    fetch(`/api/reviews?productId=${product.id}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setLoadingReviews(false));
  }, [product.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: newReviewName,
          district: newReviewDistrict,
          rating: newReviewRating,
          comment: newReviewComment,
          verifiedPurchase: true,
        }),
      });
      const created = await res.json();
      setReviews((prev) => [created, ...prev]);
      setReviewSubmitted(true);
      setNewReviewComment('');
      setNewReviewName('');
    } catch (err) {
      console.error('Failed submitting review', err);
    }
  };

  const isFavorite = isWishlisted(product.id);
  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const whatsAppInquiryText = `Hello Akash Telecom! I am interested in: ${product.name} (${formatBDT(product.discountedPrice)}). Is it in stock for delivery to my area?`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Catalog</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-4/3 w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
            <img
              src={activeImage || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/src/assets/images/hero_tech_gadgets_showcase_1794308083890.jpg';
              }}
            />
            {product.discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                Save {product.discountPercentage}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border-2 transition-all shrink-0 ${
                    activeImage === img ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/hero_tech_gadgets_showcase_1794308083890.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          {/* Brand & Category */}
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
            <span>{product.brand}</span>
            <span>·</span>
            <span className="text-slate-500">{product.categoryName}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
            {product.name}
          </h1>

          {/* Ratings & Stock */}
          <div className="flex items-center gap-4 mt-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount} customer reviews)</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>In Stock ({product.stock} units ready in Dhaka)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900 tabular-nums">
              {formatBDT(product.discountedPrice)}
            </span>
            {product.regularPrice > product.discountedPrice && (
              <>
                <span className="text-lg text-slate-400 line-through tabular-nums">
                  {formatBDT(product.regularPrice)}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  You Save {formatBDT(product.regularPrice - product.discountedPrice)}
                </span>
              </>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">Inclusive of all local VAT & taxes · Official Bangladesh Warranty</div>

          {/* Color Variants */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Color Option: <span className="text-blue-600 font-semibold">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      selectedColor === color
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Quantity</span>
            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 text-sm font-bold"
              >
                -
              </button>
              <span className="w-10 text-center text-sm font-bold text-slate-900 tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 text-sm font-bold"
              >
                +
              </button>
            </div>
            <span className="text-xs text-slate-400">Max {product.stock} per customer</span>
          </div>

          {/* Action CTAs: Add to Cart, Buy Now, Wishlist */}
          <div className="mt-8 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => addToCart(product, quantity, selectedColor)}
                className="flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-98"
              >
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => onBuyNow(product, quantity, selectedColor)}
                className="flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-98"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now (Fast)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-colors ${
                  isFavorite
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <a
                href={getWhatsAppLink('01864015928', whatsAppInquiryText)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors border border-emerald-200"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Trust Value Badges (Essential for Bangladesh E-Commerce conversion) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Courier Shipping</div>
                <div className="text-slate-500 text-[11px]">24h Dhaka / 48h Nationwide</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Authentic & Verified</div>
                <div className="text-slate-500 text-[11px]">{product.warranty}</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <RotateCcw className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">7-Day Return</div>
                <div className="text-slate-500 text-[11px]">Cash on Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications, Box Contents, Reviews */}
      <div className="mt-14 pt-8 border-t border-slate-200">
        <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
          {[
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'box', label: 'Box Contents & Packaging' },
            { id: 'reviews', label: `Customer Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-sm font-semibold transition-colors relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Specifications */}
        {activeTab === 'specs' && (
          <div className="max-w-3xl">
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{product.description}</p>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-700 w-1/3">Brand</td>
                    <td className="py-3 px-4 text-slate-900">{product.brand}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700">Category</td>
                    <td className="py-3 px-4 text-slate-900">{product.categoryName}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-700">Model / SKU</td>
                    <td className="py-3 px-4 text-slate-900 font-mono">{product.sku}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700">Official Warranty</td>
                    <td className="py-3 px-4 text-slate-900 font-medium text-emerald-700">{product.warranty}</td>
                  </tr>
                  {Object.entries(product.specifications || {}).map(([key, value], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50/50' : ''}>
                      <td className="py-3 px-4 font-semibold text-slate-700">{key}</td>
                      <td className="py-3 px-4 text-slate-900">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Box Contents */}
        {activeTab === 'box' && (
          <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              What's Inside the Official Package
            </h3>
            <ul className="space-y-3">
              {(product.boxContents || [
                `${product.name} (Factory Sealed)`,
                'Authentic Warranty Card with Security Hologram',
                'User Manual & Safety Guide',
              ]).map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 3: Customer Reviews */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.length === 0 ? (
                <div className="text-sm text-slate-500 py-8 bg-slate-50 rounded-2xl p-6 text-center">
                  No reviews yet for this product. Be the first customer in Bangladesh to review it!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-slate-500 ml-1">· {rev.district}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-3">Write a Customer Review</h3>
              {reviewSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  Thank you! Your verified review has been posted.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="e.g. Shakib Ahmed"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">District / Location</label>
                    <input
                      type="text"
                      required
                      value={newReviewDistrict}
                      onChange={(e) => setNewReviewDistrict(e.target.value)}
                      placeholder="e.g. Dhaka (Uttara) or Sylhet"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 text-amber-400"
                        >
                          <Star
                            className={`w-5 h-5 ${star <= newReviewRating ? 'fill-amber-400' : 'text-slate-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Your Experience</label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Tell other shoppers in Bangladesh about sound quality, battery life, packaging, or delivery..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 font-display">Related Tech Gear You Might Like</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} lang={lang} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

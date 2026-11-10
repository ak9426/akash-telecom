import React from 'react';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import type { Product } from '../../types/index.js';
import { formatBDT } from '../../utils/formatters.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  lang?: 'en' | 'bn';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  lang = 'en',
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const isFavorite = isWishlisted(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300"
    >
      {/* Visual Image Container */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/src/assets/images/hero_tech_gadgets_showcase_1794308083890.jpg';
          }}
        />

        {/* Top Badges: Discount or Low Stock (Unboxed, quiet metadata discipline) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.discountPercentage > 0 && (
            <span className="text-[11px] font-bold tracking-wider text-white bg-slate-900/90 backdrop-blur-xs px-2 py-0.5 rounded-md">
              -{product.discountPercentage}%
            </span>
          )}
          {product.stock <= product.lowStockAlert && product.stock > 0 && (
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50/90 backdrop-blur-xs px-1.5 py-0.5 rounded border border-amber-200">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors backdrop-blur-xs ${
            isFavorite
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 text-slate-600 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#101828]/95 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-md backdrop-blur-xs transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'কার্টে যোগ করুন' : 'Quick Add'}</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand & Category line */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-semibold text-blue-600 uppercase tracking-wider text-[11px]">
            {product.brand}
          </span>
          <span className="flex items-center gap-1 text-slate-600 font-medium text-[11px]">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-400">({product.reviewCount})</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Key Feature Highlights */}
        <div className="mt-2 text-[11px] text-slate-500 line-clamp-1">
          {product.warranty}
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {formatBDT(product.discountedPrice)}
              </span>
              {product.regularPrice > product.discountedPrice && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  {formatBDT(product.regularPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
              <Check className="w-3 h-3" />
              In Stock · COD Available
            </span>
          </div>

          {/* Mobile Direct Add Button */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-2 bg-blue-600 text-white rounded-lg active:scale-95 transition-transform"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

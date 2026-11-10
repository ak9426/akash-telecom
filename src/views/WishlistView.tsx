import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import type { Product } from '../types/index.js';
import { ProductCard } from '../components/product/ProductCard.js';
import { useWishlist } from '../context/WishlistContext.js';

interface WishlistViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onNavigateShop: () => void;
  lang?: 'en' | 'bn';
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  products,
  onSelectProduct,
  onNavigateShop,
  lang = 'en',
}) => {
  const { wishlist } = useWishlist();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Heart className="w-4 h-4 fill-current" />
          <span>Saved Tech Essentials</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display">
          My Wishlist ({wishlistedProducts.length})
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Products you've saved to buy later or keep track of for upcoming discount offers.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 mt-1">
            Tap the heart icon on any gadget or charger in the store to save it here.
          </p>
          <button
            onClick={onNavigateShop}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelectProduct} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
};

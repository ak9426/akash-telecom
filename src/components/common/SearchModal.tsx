import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import type { Product } from '../../types/index.js';
import { formatBDT } from '../../utils/formatters.js';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onViewCategory: (categorySlug: string) => void;
  products: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onViewCategory,
  products,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const results = cleanQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.brand.toLowerCase().includes(cleanQuery) ||
          p.categoryName.toLowerCase().includes(cleanQuery) ||
          p.sku.toLowerCase().includes(cleanQuery)
      )
    : [];

  const popularSearches = ['Anker GaN 65W', 'Soundcore ANC', 'Kieslect Smartwatch', 'Baseus Power Bank', 'Turbo Fan'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chargers, wireless earbuds, smartwatches, power banks..."
            className="w-full text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-md transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {cleanQuery ? (
            results.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
                  Matching Products ({results.length})
                </div>
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3.5 p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover rounded-lg bg-slate-100 shrink-0 border border-slate-200/60"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/hero_tech_gadgets_showcase_1794308083890.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-blue-600 font-semibold">{product.brand} · {product.categoryName}</div>
                      <div className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          {formatBDT(product.discountedPrice)}
                        </span>
                        {product.regularPrice > product.discountedPrice && (
                          <span className="text-xs text-slate-400 line-through tabular-nums">
                            {formatBDT(product.regularPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500">
                <p className="text-base font-semibold text-slate-700">No products found for "{query}"</p>
                <p className="text-xs mt-1">Try searching for brand names like Anker, Soundcore, Kieslect, Baseus or Remax.</p>
              </div>
            )
          ) : (
            <div className="py-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Popular Trending Searches
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 px-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Top Categories
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { name: 'GaN Fast Chargers', slug: 'charging-power' },
                    { name: 'ANC Wireless Earbuds', slug: 'audio-headphones' },
                    { name: 'AMOLED Smartwatches', slug: 'smart-gadgets' },
                    { name: 'Laptop Power Banks', slug: 'charging-power' },
                  ].map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        onViewCategory(cat.slug);
                        onClose();
                      }}
                      className="p-2 text-left rounded-lg text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium transition-colors"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

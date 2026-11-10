import React, { useState, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Check,
  Grid3X3,
  ListFilter,
  Sparkles,
} from 'lucide-react';
import type { Product, Category } from '../types/index.js';
import { ProductCard } from '../components/product/ProductCard.js';
import { formatBDT } from '../utils/formatters.js';

interface ShopViewProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  onSelectProduct: (p: Product) => void;
  lang?: 'en' | 'bn';
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  categories,
  initialCategory = 'all',
  onSelectProduct,
  lang = 'en',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Available brands derived from products
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return Array.from(set).sort();
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) =>
          p.categoryId === selectedCategory ||
          p.slug === selectedCategory ||
          p.categoryName.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      result = result.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Price filter
    result = result.filter((p) => p.discountedPrice <= maxPrice);

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.discountedPrice - a.discountedPrice);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => b.discountPercentage - a.discountPercentage);
    } else {
      // Popular / Best sellers
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, selectedBrand, searchQuery, inStockOnly, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSearchQuery('');
    setInStockOnly(false);
    setMaxPrice(10000);
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Electronics & Gadgets</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Explore All Tech & Accessories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse authentic chargers, ANC earbuds, AMOLED smartwatches, and computer gear with Bangladesh warranty.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 w-44 sm:w-60"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Biggest Savings</option>
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden p-2 border border-slate-300 rounded-xl text-slate-700 bg-white"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              Filter Catalog
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Categories Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Categories
            </h3>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                <span className="text-slate-400 tabular-nums">{products.length}</span>
              </button>
              {categories.map((c) => {
                const count = products.filter(
                  (p) => p.categoryId === c.id || p.categoryName === c.name
                ).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === c.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-slate-400 tabular-nums">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Brands
            </h3>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                  selectedBrand === 'all'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    selectedBrand.toLowerCase() === b.toLowerCase()
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span className="uppercase tracking-wider">Max Price</span>
              <span className="text-blue-600 font-bold tabular-nums">{formatBDT(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>৳500</span>
              <span>৳10,000+</span>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>In Stock Only (Ready to Dispatch)</span>
            </label>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <p className="text-base font-semibold text-slate-800">No products matched your criteria</p>
              <p className="text-xs text-slate-500 mt-1">
                Try widening your price range or clearing filters to view available stock.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onSelect={onSelectProduct} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="text-base font-bold text-slate-900">Filters</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Category</h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-2 py-1 rounded ${
                      selectedCategory === 'all' ? 'bg-blue-50 text-blue-600 font-bold' : ''
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`w-full text-left px-2 py-1 rounded ${
                        selectedCategory === c.id ? 'bg-blue-50 text-blue-600 font-bold' : ''
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Max Price</h4>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="text-right text-xs font-bold text-blue-600 tabular-nums mt-1">
                  {formatBDT(maxPrice)}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl mt-6"
            >
              Apply Filters ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

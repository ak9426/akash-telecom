import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Category } from '../types/index.js';

interface CategoriesViewProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onSelectCategory,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Complete Tech Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Browse by Category
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          From high-power GaN chargers to studio ANC earbuds and smart gadgets, find exactly what your lifestyle needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group relative bg-white rounded-3xl border border-slate-200/80 overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Category Image */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/hero_tech_gadgets_showcase_1794308083890.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  {cat.itemCount}+ Products in Stock
                </span>
                <h3 className="text-xl font-bold font-display">{cat.name}</h3>
              </div>
            </div>

            {/* Description & Subcategories */}
            <div className="p-6">
              <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {cat.subcategories.slice(0, 4).map((sub, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium text-slate-600 bg-slate-100 rounded-md px-2.5 py-1"
                  >
                    {sub}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

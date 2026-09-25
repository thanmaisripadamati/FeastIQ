import React, { useState, useMemo } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  Search, 
  Clock, 
  Sparkles, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Filter, 
  Flame, 
  CheckCircle2,
  XCircle,
  Tag
} from 'lucide-react';

export function MenuPage() {
  const { menuItems, addToCart, cart, updateCartQuantity } = useCanteen();

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [underHundred, setUnderHundred] = useState(false);
  const [fastPrep, setFastPrep] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = ['ALL', 'TIFFINS', 'LUNCH', 'SNACKS', 'COOL DRINKS'];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (activeCategory !== 'ALL' && item.category !== activeCategory) {
        return false;
      }
      // Search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchTag = item.tag?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchTag) return false;
      }
      // Veg only
      if (vegOnly && !item.veg) return false;
      // Under ₹100
      if (underHundred && item.price > 100) return false;
      // Fast prep (4 mins or less)
      if (fastPrep && item.prepTime > 4) return false;
      // In stock
      if (inStockOnly && (!item.available || item.stock <= 0)) return false;

      return true;
    });
  }, [menuItems, activeCategory, searchQuery, vegOnly, underHundred, fastPrep, inStockOnly]);

  const getItemCartQuantity = (itemId) => {
    const found = cart.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            College Canteen Menu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Freshly prepared meals, quick snacks, and chilled beverages. All prices in Indian Rupees (₹).
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Biryani, Shawarma, Dosa..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
            }`}
          >
            {cat === 'ALL' ? '🍽️ All Items' : cat === 'TIFFINS' ? '🥞 Tiffins' : cat === 'LUNCH' ? '🍛 Lunch & Meals' : cat === 'SNACKS' ? '🥪 Snacks' : '🥤 Cool Drinks'}
          </button>
        ))}
      </div>

      {/* Filter Badges & Quick Toggles */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Quick Filters:
        </span>

        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`px-3 py-1 rounded-lg border font-medium transition-colors flex items-center gap-1 cursor-pointer ${
            vegOnly ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>Veg Only</span>
        </button>

        <button
          onClick={() => setUnderHundred(!underHundred)}
          className={`px-3 py-1 rounded-lg border font-medium transition-colors flex items-center gap-1 cursor-pointer ${
            underHundred ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-semibold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>Under ₹100</span>
        </button>

        <button
          onClick={() => setFastPrep(!fastPrep)}
          className={`px-3 py-1 rounded-lg border font-medium transition-colors flex items-center gap-1 cursor-pointer ${
            fastPrep ? 'bg-purple-50 text-purple-800 border-purple-300 font-semibold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3 h-3 text-purple-600" />
          <span>Fast Prep (≤ 4 mins)</span>
        </button>

        <button
          onClick={() => setInStockOnly(!inStockOnly)}
          className={`px-3 py-1 rounded-lg border font-medium transition-colors flex items-center gap-1 cursor-pointer ${
            inStockOnly ? 'bg-blue-50 text-blue-800 border-blue-300 font-semibold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-3 h-3 text-blue-600" />
          <span>In Stock Only</span>
        </button>

        {(vegOnly || underHundred || fastPrep || inStockOnly || searchQuery) && (
          <button
            onClick={() => {
              setVegOnly(false);
              setUnderHundred(false);
              setFastPrep(false);
              setInStockOnly(false);
              setSearchQuery('');
              setActiveCategory('ALL');
            }}
            className="text-xs text-indigo-600 hover:underline ml-auto font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Menu Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <XCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No items match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const qty = getItemCartQuantity(item.id);
            const isOutOfStock = !item.available || item.stock <= 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-xs border-2 flex items-center justify-center bg-white ${
                        item.veg ? 'border-emerald-600' : 'border-red-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.veg ? 'bg-emerald-600' : 'bg-red-600'
                        }`} />
                      </span>
                      {item.tag && (
                        <span className="bg-white/95 backdrop-blur-xs text-slate-800 font-semibold text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{item.prepTime} mins</span>
                    </div>
                  </div>

                  <div className="p-3.5">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-base font-extrabold text-indigo-700 whitespace-nowrap">
                        ₹{item.price}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div className="text-[11px]">
                    {item.stock > 10 ? (
                      <span className="text-emerald-600 font-medium">● In Stock ({item.stock})</span>
                    ) : item.stock > 0 ? (
                      <span className="text-amber-600 font-medium">● Only {item.stock} left</span>
                    ) : (
                      <span className="text-red-500 font-bold">● Out of stock</span>
                    )}
                  </div>

                  {isOutOfStock ? (
                    <span className="text-xs text-slate-400 font-medium bg-slate-100 px-3 py-1 rounded-lg">
                      Unavailable
                    </span>
                  ) : qty > 0 ? (
                    <div className="flex items-center bg-indigo-50 border border-indigo-200 rounded-xl overflow-hidden shadow-2xs">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1.5 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                        title="Reduce quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-bold text-indigo-900">{qty}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-1.5 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

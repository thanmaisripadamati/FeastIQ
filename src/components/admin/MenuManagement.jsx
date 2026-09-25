import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  UtensilsCrossed, 
  Search, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  Clock, 
  Sparkles,
  DollarSign,
  Plus
} from 'lucide-react';

export function MenuManagement() {
  const { 
    menuItems, 
    toggleItemAvailability, 
    updateItemPrice, 
    updateItemStock 
  } = useCanteen();

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'TIFFINS', 'LUNCH', 'SNACKS', 'COOL DRINKS'];

  const filteredItems = menuItems.filter((i) => {
    if (activeCategory !== 'ALL' && i.category !== activeCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!i.name.toLowerCase().includes(q) && !i.category.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditPrice(item.price);
    setEditStock(item.stock);
  };

  const saveEdit = (id) => {
    if (editPrice !== '') updateItemPrice(id, editPrice);
    if (editStock !== '') updateItemStock(id, editStock);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Menu & Food Item Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure live availability, modify Indian Rupee (₹) pricing, and adjust kitchen inventory batches.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white shadow-2xs focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat === 'ALL' ? `All Items (${menuItems.length})` : cat}
          </button>
        ))}
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Item Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (₹)</th>
                <th className="py-3.5 px-4">Available Stock</th>
                <th className="py-3.5 px-4">Prep Time</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Item */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <strong className="font-bold text-slate-900 text-sm block">
                            {item.name}
                          </strong>
                          <span className={`text-[10px] font-bold ${
                            item.veg ? 'text-emerald-600' : 'text-red-500'
                          }`}>
                            {item.veg ? 'Pure Veg' : 'Non-Veg'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {item.category}
                      </span>
                    </td>

                    {/* Price in ₹ */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 font-bold">₹</span>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-18 px-2 py-1 border border-indigo-300 rounded-lg text-xs font-bold"
                          />
                        </div>
                      ) : (
                        <span className="font-extrabold text-slate-900 text-sm">
                          ₹{item.price}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                          className="w-18 px-2 py-1 border border-indigo-300 rounded-lg text-xs font-bold"
                        />
                      ) : (
                        <span className={`font-semibold ${
                          item.stock < item.minStock
                            ? 'text-red-600 font-bold'
                            : 'text-slate-700'
                        }`}>
                          {item.stock} portions {item.stock < item.minStock && '⚠️ Low'}
                        </span>
                      )}
                    </td>

                    {/* Prep Time */}
                    <td className="py-3 px-4 text-slate-600">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.prepTime} mins</span>
                      </span>
                    </td>

                    {/* Availability Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleItemAvailability(item.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          item.available && item.stock > 0
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {item.available && item.stock > 0 ? '● Available' : '○ Out of Stock'}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => saveEdit(item.id)}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(item)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 text-slate-500" />
                          <span>Edit</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

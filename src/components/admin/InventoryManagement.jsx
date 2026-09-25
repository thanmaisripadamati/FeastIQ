import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  ArrowUpRight, 
  TrendingUp,
  RefreshCw,
  Zap
} from 'lucide-react';

export function InventoryManagement() {
  const { menuItems, updateItemStock, eventRushActive, addNotification } = useCanteen();

  const handleQuickRestock = (item, amount) => {
    updateItemStock(item.id, item.stock + amount);
    addNotification('Inventory Updated', `Restocked ${amount} portions of ${item.name}`, 'success');
  };

  // Helper status calculation
  const getInventoryStatus = (item) => {
    const predicted = eventRushActive 
      ? item.name === 'Biryani' ? 150 : item.name === 'Shawarma' ? 140 : item.name === 'Cool Drinks' || item.category === 'COOL DRINKS' ? 95 : item.minStock * 2
      : item.minStock * 1.5;

    if (item.stock < item.minStock) {
      return { label: '🔴 Critical', color: 'bg-red-50 text-red-700 border-red-200', shortage: Math.max(0, Math.round(predicted - item.stock)) };
    }
    if (item.stock < item.minStock * 1.5) {
      return { label: '🟡 Low', color: 'bg-amber-50 text-amber-700 border-amber-200', shortage: Math.max(0, Math.round(predicted - item.stock)) };
    }
    return { label: '🟢 Good', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', shortage: 0 };
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Inventory & Kitchen Raw Stocks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time buffer monitoring, minimum stock triggers, and AI automated batch recommendations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">
            {eventRushActive ? '🚨 Surge Telemetry Active' : 'Normal Inventory Velocity'}
          </span>
        </div>
      </div>

      {/* AI RECOMMENDATION SPOTLIGHT */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 rounded-3xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-purple-900">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-sm uppercase tracking-wider font-['Outfit']">
            Inventory Agent Recommendation
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <strong className="text-slate-900 text-sm font-bold">Biryani Prep Alert</strong>
                <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                  Deficit: ~70 portions
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Current Stock: <strong>80</strong> • Predicted Demand: <strong>150</strong>. 
                Recommendation: <em>"Prepare approximately 70 additional portions immediately before 12:45 PM rush."</em>
              </p>
            </div>
            <button
              onClick={() => {
                const b = menuItems.find((i) => i.id === 'lun-1');
                if (b) handleQuickRestock(b, 70);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Restock 70 Portions</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <strong className="text-slate-900 text-sm font-bold">Shawarma Spit Alert</strong>
                <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                  Deficit: ~100 portions
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Current Stock: <strong>40</strong> • Predicted Demand: <strong>140</strong>.
                Recommendation: <em>"Load secondary rotisserie skewer now to avoid a 20-minute stock-out."</em>
              </p>
            </div>
            <button
              onClick={() => {
                const s = menuItems.find((i) => i.id === 'snk-3');
                if (s) handleQuickRestock(s, 100);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Authorize 100 Shawarma Spit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Food Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Min Safe Buffer</th>
                <th className="py-3.5 px-4">Predicted Demand</th>
                <th className="py-3.5 px-4">Stock Health</th>
                <th className="py-3.5 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {menuItems.map((item) => {
                const status = getInventoryStatus(item);
                const predictedVal = eventRushActive 
                  ? item.name === 'Biryani' ? 150 : item.name === 'Shawarma' ? 140 : Math.round(item.minStock * 2.2)
                  : Math.round(item.minStock * 1.5);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900 text-sm">
                      {item.stock} <span className="text-[10px] text-slate-400 font-normal">portions</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.minStock} portions
                    </td>
                    <td className="py-3 px-4 font-bold text-indigo-700">
                      {predictedVal} orders
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleQuickRestock(item, 20)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2 py-1 rounded-lg text-[11px] transition-colors cursor-pointer"
                        >
                          +20
                        </button>
                        <button
                          onClick={() => handleQuickRestock(item, 50)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded-lg text-[11px] transition-colors cursor-pointer"
                        >
                          +50
                        </button>
                      </div>
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

import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  Sparkles, 
  Clock, 
  Flame, 
  TrendingUp, 
  ShieldCheck, 
  ShoppingBag, 
  Zap, 
  DollarSign, 
  Info,
  CalendarCheck
} from 'lucide-react';

export function AIRecommendationsPage() {
  const { menuItems, addToCart, eventRushActive, metrics } = useCanteen();

  // Helper filter sets
  const popularNow = menuItems.filter((i) => ['lun-1', 'snk-3', 'lun-12', 'cd-1'].includes(i.id));
  const quickPrep = menuItems.filter((i) => i.prepTime <= 3 && i.stock > 0);
  const underHundred = menuItems.filter((i) => i.price <= 100 && i.popularity >= 85);
  const eventPicks = menuItems.filter((i) => ['snk-3', 'lun-1', 'snk-4', 'cd-1', 'cd-2'].includes(i.id));

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Agent Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Agent #5 — Student Recommendation Agent</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Outfit'] tracking-tight mb-2">
            AI-Tailored Dining Intelligence
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
            FeastIQ computes live queue lengths, stock freshness, and preparation velocities to curate the ideal choices for your schedule and budget.
          </p>
        </div>

        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* RUSH-AWARE RECOMMENDATIONS */}
      {eventRushActive && (
        <section className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
                  ⚡ Express Event Picks (Zero Delay)
                </h3>
                <p className="text-xs text-slate-500">
                  During 500+ student rushes, these ready-to-serve items bypass cooking queues.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Confidence: 94%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {eventPicks.map((item) => (
              <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <img src={item.image} alt={item.name} className="w-full h-28 object-cover rounded-xl mb-3" />
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                    <span className="font-extrabold text-indigo-700 text-sm">₹{item.price}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Quick Add</span>
                </button>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50/50 rounded-xl p-3 text-xs text-indigo-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span><strong>Why this recommendation?</strong> Order Management Agent identified Counter 2 & 3 as having high throughput buffers, ensuring delivery in under 3 minutes.</span>
          </div>
        </section>
      )}

      {/* QUICK PREPARATION (< 4 MINS) */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
              ⚡ Ultra Fast Prep (Ready in under 4 mins)
            </h3>
            <p className="text-xs text-slate-500">
              Perfect if you have a class starting in 15 minutes!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {quickPrep.slice(0, 4).map((item) => (
            <div key={item.id} className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-200 transition-colors">
              <div>
                <img src={item.image} alt={item.name} className="w-full h-28 object-cover rounded-xl mb-3" />
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                  <span className="font-extrabold text-slate-900 text-sm">₹{item.price}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>Prep: {item.prepTime} mins</span>
                </div>
              </div>
              <button
                onClick={() => addToCart(item)}
                className="mt-3 w-full bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Tray</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CAMPUS FAVORITES UNDER ₹100 */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
              🎯 Budget Heroes Under ₹100
            </h3>
            <p className="text-xs text-slate-500">
              High student satisfaction scores that are gentle on your wallet.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {underHundred.slice(0, 4).map((item) => (
            <div key={item.id} className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-200 transition-colors">
              <div>
                <img src={item.image} alt={item.name} className="w-full h-28 object-cover rounded-xl mb-3" />
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                  <span className="font-extrabold text-emerald-700 text-sm">₹{item.price}</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full inline-block">
                  Rating: 4.8 ★
                </span>
              </div>
              <button
                onClick={() => addToCart(item)}
                className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Tray</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

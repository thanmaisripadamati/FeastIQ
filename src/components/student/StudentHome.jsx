import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  Sparkles, 
  Clock, 
  Flame, 
  ShoppingBag, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Timer, 
  Users, 
  AlertTriangle,
  Zap,
  Star
} from 'lucide-react';

export function StudentHome() {
  const { 
    currentUser, 
    navigateTo, 
    menuItems, 
    addToCart, 
    metrics, 
    eventRushActive, 
    activeEvent 
  } = useCanteen();

  // Selected popular items
  const featuredIds = ['lun-1', 'snk-3', 'snk-1', 'tif-1', 'lun-5', 'cd-1'];
  const featuredItems = menuItems.filter((i) => featuredIds.includes(i.id));

  // Rush styling
  const getRushDetails = (level) => {
    switch (level) {
      case 'EXTREME':
        return {
          title: 'Extreme Rush in Progress',
          desc: 'High demand detected across counters. Fast-prep items are recommended for minimum wait.',
          color: 'text-red-700 bg-red-50 border-red-200',
          dot: 'bg-red-500 animate-ping'
        };
      case 'HIGH':
        return {
          title: 'High Rush',
          desc: 'Queue is moderately busy. Fresh batches being continuously rolled out.',
          color: 'text-amber-700 bg-amber-50 border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'MEDIUM':
        return {
          title: 'Moderate Pace',
          desc: 'Smooth order processing across all meal and snack counters.',
          color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
          dot: 'bg-yellow-500'
        };
      default:
        return {
          title: 'Low Rush — Instant Service',
          desc: 'Shortest wait times of the day. All counters operating with zero queue delays.',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          dot: 'bg-emerald-500'
        };
    }
  };

  const rush = getRushDetails(metrics.rushLevel);

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome & Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-blue-500/10 border border-indigo-100/80 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-indigo-100 text-xs font-semibold text-indigo-700 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI-Driven College Dining</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] mb-2">
            Hey, {currentUser?.name?.split(' ')[0] || 'Friend'}! Hungry for lunch?
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
            Skip the physical lines. Order digitally, receive your token, and track live kitchen preparation in real time.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateTo('menu')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('recommendations')}
              className="bg-white hover:bg-slate-50 text-slate-800 font-semibold px-4 py-2.5 rounded-xl text-sm border border-slate-200 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI Smart Recommendations</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-24 -mb-10 w-48 h-48 bg-purple-200/30 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* EVENT RUSH ALERT BANNER (If event is simulated/active) */}
      {eventRushActive && (
        <section className="bg-gradient-to-r from-red-500/10 via-amber-500/10 to-purple-500/10 border-2 border-red-200 rounded-3xl p-5 sm:p-6 shadow-sm event-rush-glow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/30">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Event Mode Active
                  </span>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    {activeEvent?.name || 'College Sports Day 2026'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  {metrics.activeUsers}+ students ordering simultaneously! FeastIQ AI has accelerated instant-prep food counters to minimize your waiting time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-red-200/80 shadow-xs shrink-0">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase block">Active Surge</span>
                <span className="text-base font-bold text-red-600">{metrics.ordersPerMinute} orders/min</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase block">Queue Wait</span>
                <span className="text-base font-bold text-slate-900">{metrics.estimatedWaitTime} mins</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Canteen Status Live Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rush Status Card */}
        <div className={`rounded-2xl p-5 border ${rush.color} relative overflow-hidden transition-all shadow-xs`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Canteen Rush Level</span>
            <span className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${rush.dot}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${rush.dot}`} />
            </span>
          </div>
          <h4 className="text-xl font-bold font-['Outfit'] mb-1">{metrics.rushLevel} RUSH</h4>
          <p className="text-xs opacity-90 leading-relaxed">{rush.desc}</p>
        </div>

        {/* Estimated Waiting Time */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Est. Waiting Time</span>
            <Timer className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {metrics.estimatedWaitTime}
            </span>
            <span className="text-sm font-semibold text-slate-500">minutes</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Updated 30s ago by Order Agent</span>
          </div>
        </div>

        {/* Active Orders in Queue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Orders In Queue</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {metrics.activeOrders}
            </span>
            <span className="text-sm font-semibold text-slate-500">orders</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {metrics.activeUsers} active students in canteen
          </p>
        </div>

        {/* Kitchen Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Kitchen Health</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 font-['Outfit']">
              3 Counters Open
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-600 font-medium">Meals, Snacks & Beverages</span>
          </div>
        </div>
      </section>

      {/* Featured / Popular Food Items */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                Campus Favorites Right Now
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live ranking powered by student orders & kitchen availability
            </p>
          </div>

          <button
            onClick={() => navigateTo('menu')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({menuItems.length} items)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-xs border-2 flex items-center justify-center bg-white ${
                      item.veg ? 'border-emerald-600' : 'border-red-600'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        item.veg ? 'bg-emerald-600' : 'bg-red-600'
                      }`} />
                    </span>
                    <span className="bg-white/95 backdrop-blur-xs text-slate-800 font-semibold text-[11px] px-2 py-0.5 rounded-full shadow-xs">
                      {item.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{item.prepTime} mins</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-base font-extrabold text-indigo-700 whitespace-nowrap">
                      ₹{item.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500">
                  {item.stock > 10 ? (
                    <span className="text-emerald-600 font-semibold">● In Stock ({item.stock})</span>
                  ) : item.stock > 0 ? (
                    <span className="text-amber-600 font-semibold">● Only {item.stock} left</span>
                  ) : (
                    <span className="text-red-500 font-semibold">● Sold Out</span>
                  )}
                </span>

                <button
                  onClick={() => addToCart(item)}
                  disabled={!item.available || item.stock <= 0}
                  className="bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Recommendation Teaser */}
      <section className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-3xl p-6 border border-purple-100/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
                FeastIQ Smart Recommendation Agent
              </h3>
              <p className="text-xs text-slate-600 max-w-xl mt-0.5 leading-relaxed">
                Analyzing historical college eating patterns, current kitchen cook times, and inventory buffers to suggest the fastest, freshest meal options.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('recommendations')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>View Tailored Suggestions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}

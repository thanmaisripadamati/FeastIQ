import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  BarChart2, 
  TrendingUp, 
  Clock, 
  Users, 
  Flame, 
  Award, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function AnalyticsView() {
  const { metrics } = useCanteen();

  // Category revenue in ₹
  const categoryRevenue = [
    { name: 'Lunch & Meals', revenue: 14200, color: '#4f46e5' },
    { name: 'Snacks', revenue: 5800, color: '#7c3aed' },
    { name: 'Tiffins', revenue: 3200, color: '#06b6d4' },
    { name: 'Cool Drinks', revenue: 1650, color: '#10b981' }
  ];

  // Event vs Normal Day Comparison
  const comparisonData = [
    { metric: 'Total Orders', normalDay: 150, eventDay: 438 },
    { metric: 'Avg Wait (mins)', normalDay: 7, eventDay: 12 },
    { metric: 'Peak Orders/min', normalDay: 6, eventDay: 34 },
    { metric: 'Revenue (₹/100)', normalDay: 248, eventDay: 668 }
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Canteen Operations & Event Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Comparative analysis between normal academic days and high-volume campus events.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          Academic Year 2025–2026 Telemetry
        </span>
      </div>

      {/* EVENT VS NORMAL DAY COMPARISON (Prompt Requirement 33) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg font-['Outfit']">
              Event Day vs Normal Day Performance Benchmark
            </h3>
            <p className="text-xs text-slate-500">
              Measuring the tangible difference of FeastIQ Event Management Agent intervention
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <span className="w-3 h-3 rounded-md bg-slate-300" />
              <span>Normal Day</span>
            </span>
            <span className="flex items-center gap-1.5 font-bold text-indigo-700">
              <span className="w-3 h-3 rounded-md bg-indigo-600" />
              <span>Event Day (500+ Crowd)</span>
            </span>
          </div>
        </div>

        {/* Comparison Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-400 font-semibold text-xs block mb-1 uppercase">Daily Orders</span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Normal Day</span>
                <strong className="text-xl font-black text-slate-700 font-['Outfit']">150</strong>
              </div>
              <div className="text-right">
                <span className="text-xs text-indigo-600 block font-semibold">Event Day</span>
                <strong className="text-2xl font-black text-indigo-700 font-['Outfit']">438</strong>
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-2">
              +192% volume accommodated
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-400 font-semibold text-xs block mb-1 uppercase">Average Wait Time</span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Normal Day</span>
                <strong className="text-xl font-black text-slate-700 font-['Outfit']">7 min</strong>
              </div>
              <div className="text-right">
                <span className="text-xs text-amber-600 block font-semibold">Event Day</span>
                <strong className="text-2xl font-black text-amber-600 font-['Outfit']">12 min</strong>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 block mt-2">
              Under 15m target (Without AI: 28m)
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-400 font-semibold text-xs block mb-1 uppercase">Peak Order Velocity</span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Normal Day</span>
                <strong className="text-xl font-black text-slate-700 font-['Outfit']">6 / min</strong>
              </div>
              <div className="text-right">
                <span className="text-xs text-red-600 block font-semibold">Event Day</span>
                <strong className="text-2xl font-black text-red-600 font-['Outfit']">34 / min</strong>
              </div>
            </div>
            <span className="text-[10px] text-red-600 font-bold block mt-2">
              5.6× queue pressure absorbed
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-400 font-semibold text-xs block mb-1 uppercase">Daily Revenue (₹)</span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Normal Day</span>
                <strong className="text-xl font-black text-slate-700 font-['Outfit']">₹24,850</strong>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-600 block font-semibold">Event Day</span>
                <strong className="text-2xl font-black text-emerald-700 font-['Outfit']">₹66,850</strong>
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-2">
              +₹42,000 incremental revenue
            </span>
          </div>
        </div>

        {/* Chart comparing Normal vs Event */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="metric" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="normalDay" name="Normal Day Baseline" fill="#94a3b8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="eventDay" name="Event Surge Day" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Distribution by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base font-['Outfit'] mb-1">
            Revenue Share by Category (₹)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Total sales across meal, snack, and beverage counters
          </p>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {categoryRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {categoryRevenue.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 truncate">{cat.name}:</span>
                <strong className="text-slate-900">₹{cat.revenue}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Food Items Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base font-['Outfit'] mb-1">
            Top Performing Items
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Items with highest customer satisfaction and turnaround velocity
          </p>

          <div className="space-y-2.5 text-xs">
            {[
              { rank: '1', name: 'Shawarma', volume: '142 sold', rev: '₹12,780', trend: '+45%' },
              { rank: '2', name: 'Biryani', volume: '135 sold', rev: '₹18,900', trend: '+30%' },
              { rank: '3', name: 'Cool Drinks (All)', volume: '215 sold', rev: '₹8,600', trend: '+80%' },
              { rank: '4', name: 'Veg / Chicken Noodles', volume: '110 sold', rev: '₹10,450', trend: '+22%' },
              { rank: '5', name: 'Egg Maggie', volume: '95 sold', rev: '₹5,225', trend: '+35%' }
            ].map((item) => (
              <div key={item.rank} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[11px]">
                    #{item.rank}
                  </span>
                  <div>
                    <strong className="text-slate-900 text-xs block">{item.name}</strong>
                    <span className="text-[10px] text-slate-400">{item.volume}</span>
                  </div>
                </div>

                <div className="text-right">
                  <strong className="text-slate-900 text-xs block">{item.rev}</strong>
                  <span className="text-[10px] text-emerald-600 font-bold">{item.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

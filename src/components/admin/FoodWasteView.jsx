import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  Trash2, 
  Sparkles, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Calendar,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export function FoodWasteView() {
  const wasteData = [
    { day: 'Mon', preparedKg: 140, soldKg: 135, wasteKg: 5, savedInRs: 1200 },
    { day: 'Tue', preparedKg: 155, soldKg: 151, wasteKg: 4, savedInRs: 1550 },
    { day: 'Wed', preparedKg: 160, soldKg: 158, wasteKg: 2, savedInRs: 2100 },
    { day: 'Thu', preparedKg: 150, soldKg: 147, wasteKg: 3, savedInRs: 1800 },
    { day: 'Fri', preparedKg: 210, soldKg: 206, wasteKg: 4, savedInRs: 3400 },
    { day: 'Sat', preparedKg: 95, soldKg: 93, wasteKg: 2, savedInRs: 900 }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Food Waste & Yield Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Powered by Agent #3 • Real-time batch monitoring, over-preparation prevention, and cost savings in ₹.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>97.8% Kitchen Utilization Rate</span>
          </span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Waste Prevented</span>
            <TrendingDown className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl font-black text-emerald-700 font-['Outfit'] block">
            ₹18,450
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            142 kg edible food saved this month
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Over-Prep Variance</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-3xl font-black text-slate-900 font-['Outfit'] block">
            2.1%
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Down from 18.5% before FeastIQ
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Demand Accuracy</span>
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-3xl font-black text-indigo-700 font-['Outfit'] block">
            87%
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Current prediction confidence
          </span>
        </div>
      </div>

      {/* Chart: Prepared vs Sold */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base font-['Outfit'] mb-1">
          Daily Prepared vs Consumed Yield (kg)
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Near 1:1 parity achieved by feeding live student attendance data into preparation pots.
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={wasteData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="preparedKg" name="Prepared Food (kg)" fill="#818cf8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="soldKg" name="Sold to Students (kg)" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="wasteKg" name="Unsold Surplus (kg)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Food Waste Recommendations List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-base font-['Outfit']">
            Food Waste Agent Directives
          </h3>
        </div>

        <div className="space-y-3">
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs">
            <strong className="text-amber-900 text-sm font-bold block mb-1">
              Paneer Preparation Sizing
            </strong>
            <p className="text-amber-800 leading-relaxed">
              "Paneer preparation exceeded demand by 18% yesterday (approx 3.2 kg surplus). Recommended action: Reduce tomorrow's morning curd and gravy batch by 15% and freeze excess blocks."
            </p>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 text-xs">
            <strong className="text-indigo-900 text-sm font-bold block mb-1">
              Dosa Batter Fermentation Clock
            </strong>
            <p className="text-indigo-800 leading-relaxed">
              "Current tiffin batter batch will reach peak fermentation at 11:15 AM. Promote Utthapam and Masala Dosa combos on student app to deplete batch before afternoon lunch shift."
            </p>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs">
            <strong className="text-emerald-900 text-sm font-bold block mb-1">
              Surplus Redistribution Protocol
            </strong>
            <p className="text-emerald-800 leading-relaxed">
              "Surplus chapathis and dal packaged into sterile thermal containers for evening campus maintenance and security staff dinner rotation."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

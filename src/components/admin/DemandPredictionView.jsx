import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Info,
  Flame
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { HOURLY_NORMAL_DEMAND } from '../../data/mockData';

export function DemandPredictionView() {
  const { metrics, eventRushActive } = useCanteen();

  const categoryHourly = [
    { hour: '8:30 AM', tiffins: 85, lunch: 0, snacks: 12, drinks: 20 },
    { hour: '10:00 AM', tiffins: 60, lunch: 0, snacks: 45, drinks: 40 },
    { hour: '11:30 AM', tiffins: 20, lunch: 40, snacks: 65, drinks: 60 },
    { hour: '12:30 PM', tiffins: 5, lunch: 195, snacks: 85, drinks: 140 },
    { hour: '1:30 PM', tiffins: 0, lunch: 140, snacks: 50, drinks: 90 },
    { hour: '3:00 PM', tiffins: 0, lunch: 15, snacks: 70, drinks: 65 },
    { hour: '4:30 PM', tiffins: 25, lunch: 5, snacks: 120, drinks: 95 }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Demand Prediction Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Powered by Agent #2 • Multi-factor predictive modeling of student dining patterns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-xl border border-indigo-200">
            Demand Confidence: {metrics.demandConfidence}% (High)
          </span>
        </div>
      </div>

      {/* Main Hourly Demand Curve */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
              Hourly Predicted vs Actual Kitchen Load
            </h3>
            <p className="text-xs text-slate-500">
              Correlating timetable breaks, student footfall, and event surges
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Peak Expected: <strong>12:30 PM – 1:15 PM</strong>
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={HOURLY_NORMAL_DEMAND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="orders" stroke="#4f46e5" strokeWidth={2.5} name="Base Demand" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="normalCapacity" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" name="Kitchen Line Capacity" />
              {eventRushActive && (
                <Line type="monotone" dataKey="eventDemand" stroke="#ef4444" strokeWidth={3} name="Event Surge Demand (500+)" dot={{ r: 4 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category-Wise Meal Breakdown Across Day */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base font-['Outfit'] mb-1">
          Meal Category Consumption Trajectory
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Tiffins surge at 8:30 AM, Lunch peaks at 12:30 PM, Snacks take over at 4:30 PM.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={categoryHourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="tiffins" stroke="#f59e0b" strokeWidth={2} name="Tiffins" />
              <Line type="monotone" dataKey="lunch" stroke="#4f46e5" strokeWidth={2.5} name="Lunch / Meals" />
              <Line type="monotone" dataKey="snacks" stroke="#ec4899" strokeWidth={2} name="Snacks & Fast Food" />
              <Line type="monotone" dataKey="drinks" stroke="#06b6d4" strokeWidth={2} name="Cool Drinks" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prediction Factors & Explainability */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-900">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-sm uppercase tracking-wider font-['Outfit']">
            Prediction Factors & Explainability
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
            <strong className="text-slate-900 block mb-1">📅 Academic Timetable Synchronizer</strong>
            <p className="text-slate-600 leading-relaxed">
              3rd Year CSE & ECE laboratory slots end at 12:15 PM, driving an anticipated spike of 90 orders across Counters 1 and 2 within a 12-minute window.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
            <strong className="text-slate-900 block mb-1">🌡️ Weather & Temperature Weighting</strong>
            <p className="text-slate-600 leading-relaxed">
              Afternoon temperature forecast is 32°C. Beverage consumption coefficient scaled by +28%, recommending 140 chilled Thums Up and Sprite portions.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
            <strong className="text-slate-900 block mb-1">🍛 Weekend / Friday Flavor Affinity</strong>
            <p className="text-slate-600 leading-relaxed">
              Friday lunch shows 2.3× higher propensity for Hyderabadi Dum Biryani and Fry Piece Biryani compared to chapathi and rice varieties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

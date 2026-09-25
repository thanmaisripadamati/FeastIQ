import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  X, 
  Award, 
  TrendingUp, 
  Trash2, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Database,
  ArrowRight
} from 'lucide-react';

export function EventRecoveryModal({ isOpen, onClose }) {
  const { recoverySummary, setShowEventRecoveryModal, addNotification } = useCanteen();

  if (!isOpen || !recoverySummary) return null;

  const handleSaveToModel = () => {
    addNotification(
      'Telemetry Retrained',
      'Event dataset merged into FeastIQ Historical Demand Models. Future fests will automatically calibrate Shawarma & beverage buffers.',
      'success'
    );
    setShowEventRecoveryModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Post-Event Intelligence
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
              Event Summary & Recovery Audit
            </h2>
            <p className="text-xs text-slate-500">
              {recoverySummary.event} • Duration: {recoverySummary.duration}
            </p>
          </div>
        </div>

        {/* 4 Key Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Total Orders</span>
            <span className="text-xl font-black text-slate-900 font-['Outfit']">{recoverySummary.totalOrders}</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">87% Conversion</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Peak Velocity</span>
            <span className="text-xl font-black text-red-600 font-['Outfit']">{recoverySummary.peakOrdersPerMin}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">orders / min</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Avg Wait Time</span>
            <span className="text-xl font-black text-indigo-700 font-['Outfit']">{recoverySummary.averageWaitingTime}</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">-4.2m vs manual</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Waste Prevented</span>
            <span className="text-xl font-black text-emerald-700 font-['Outfit']">₹4,650</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">32.4 kg saved</span>
          </div>
        </div>

        {/* Items Sold Breakdown */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Top Items Sold During Surge
            </h4>
            <span className="text-xs text-indigo-600 font-semibold">
              Most Popular: {recoverySummary.mostPopularItem}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {recoverySummary.itemsSold?.map((item) => (
              <div key={item.name} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block truncate">{item.name}</span>
                <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500">
                  <span>{item.sold} sold</span>
                  <span className="font-semibold text-slate-900">₹{item.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations for Future Events */}
        <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 sm:p-5 mb-6">
          <div className="flex items-center gap-2 mb-2 text-purple-900">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h4 className="font-bold text-xs uppercase tracking-wider">
              Agent Post-Mortem Recommendations
            </h4>
          </div>

          <ul className="space-y-2 text-xs text-purple-950 leading-relaxed">
            {recoverySummary.recommendations?.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-purple-600 font-bold shrink-0">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSaveToModel}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-5 rounded-2xl text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span>Save to Future Prediction Engine</span>
          </button>
          <button
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-5 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}

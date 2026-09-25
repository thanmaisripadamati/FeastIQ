import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  Settings, 
  ChefHat, 
  Bell, 
  ShieldCheck, 
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';

export function SettingsView() {
  const { currentUser, addNotification } = useCanteen();
  const [rushSensitivity, setRushSensitivity] = useState('HIGH');
  const [autoBatchAlert, setAutoBatchAlert] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    addNotification('Settings Updated', 'Kitchen operational parameters saved.', 'success');
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetDemo = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
          Kitchen & AI Operational Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure sensor sensitivity, automated batch dispatch thresholds, and counter assignments.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Staff Profile Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
                Authorized Culinary Operations Lead
              </h3>
              <p className="text-xs text-slate-500">
                Logged in as {currentUser?.name} • Staff ID: <span className="font-mono text-slate-700">{currentUser?.staffId || 'STAFF-01'}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase">Current Shift</span>
              <strong className="text-slate-800">Morning & Lunch Peak</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase">Supervised Counters</span>
              <strong className="text-indigo-700">Counter 1, 2, 3 Active</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase">RBAC Clearance</span>
              <strong className="text-emerald-700 font-bold">Kitchen Master Admin</strong>
            </div>
          </div>
        </div>

        {/* AI Rush Sensitivity Controls */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
              Event Management Agent Sensitivity
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Surge Detection Sensitivity
              </label>
              <select
                value={rushSensitivity}
                onChange={(e) => setRushSensitivity(e.target.value)}
                className="w-full sm:w-80 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="HIGH">High (Triggers on +200% sudden order volume)</option>
                <option value="MEDIUM">Medium (Triggers on +300% sudden order volume)</option>
                <option value="LOW">Conservative (Triggers on +400% sudden order volume)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Determines how aggressively the Event Management Agent formulates dynamic preparation plans.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <strong className="text-slate-800 block text-xs">Automated Batch Cooking Recommendations</strong>
                <p className="text-[11px] text-slate-500">Allow AI to display one-click authorization cards during critical stock depletion.</p>
              </div>
              <input
                type="checkbox"
                checked={autoBatchAlert}
                onChange={(e) => setAutoBatchAlert(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <strong className="text-slate-800 block text-xs">Audible Surge & Token Chimes</strong>
                <p className="text-[11px] text-slate-500">Play audio ping on kitchen terminal when extreme crowd surge is flagged.</p>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Operational Parameters</span>
          </button>

          <button
            type="button"
            onClick={handleResetDemo}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-3 rounded-2xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial State</span>
          </button>
        </div>

        {savedSuccess && (
          <p className="text-xs text-emerald-600 font-bold text-center">
            ✓ Settings successfully saved!
          </p>
        )}
      </form>
    </div>
  );
}

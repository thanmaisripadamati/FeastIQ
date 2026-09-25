import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Layers, 
  BrainCircuit, 
  Flame, 
  TrendingUp, 
  Trash2, 
  BarChart2, 
  Settings, 
  Clock, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { LiveOrders } from './LiveOrders';
import { MenuManagement } from './MenuManagement';
import { InventoryManagement } from './InventoryManagement';
import { AICommandCenter } from './AICommandCenter';
import { EventManagementCenter } from './EventManagementCenter';
import { DemandPredictionView } from './DemandPredictionView';
import { FoodWasteView } from './FoodWasteView';
import { AnalyticsView } from './AnalyticsView';
import { SettingsView } from './SettingsView';
import { EventRecoveryModal } from './EventRecoveryModal';

export function AdminLayout({ onOpenLoginModal }) {
  const { 
    adminTab, 
    setAdminTab, 
    navigateTo, 
    orders, 
    eventRushActive, 
    simulateEventRush, 
    metrics, 
    showEventRecoveryModal, 
    setShowEventRecoveryModal 
  } = useCanteen();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-orders', label: 'Live Orders', icon: Clock, badge: orders.filter(o => o.status !== 'Completed').length },
    { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
    { id: 'inventory', label: 'Inventory & Stock', icon: Layers, alert: eventRushActive },
    { id: 'ai-command', label: 'AI Command Center', icon: BrainCircuit, highlight: true },
    { id: 'event-management', label: 'Event Management (USP)', icon: Flame, isUSP: true, activeSurge: eventRushActive },
    { id: 'demand-prediction', label: 'Demand Prediction', icon: TrendingUp },
    { id: 'food-waste', label: 'Food Waste Agent', icon: Trash2 },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col">
      {/* Admin Top Operations Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit to Student Portal</span>
            </button>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm font-['Outfit']">
                FeastIQ <span className="text-indigo-600">Kitchen Staff OS</span>
              </span>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-100">
                Staff ID: STAFF-01
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Simulate Surge trigger */}
            {!eventRushActive ? (
              <button
                onClick={simulateEventRush}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                <span className="hidden md:inline">Simulate 500+ Event Rush</span>
                <span className="md:hidden">500+ Surge</span>
              </button>
            ) : (
              <span className="bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-xl animate-pulse flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>500+ EVENT SURGE ACTIVE</span>
              </span>
            )}

            <button
              onClick={onOpenLoginModal}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Chef Ramesh (Sign Out)
            </button>
          </div>
        </div>
      </header>

      {/* Admin Body with Sidebar Navigation */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <div className="bg-white rounded-3xl border border-slate-200 p-3 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
              Kitchen Telemetry
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? item.isUSP
                        ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-500/20'
                        : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : item.isUSP && item.activeSurge
                      ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 animate-pulse'
                      : item.highlight
                      ? 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${
                      isActive ? 'text-white' : item.isUSP ? 'text-red-500' : 'text-slate-500'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Info Box in Sidebar */}
          <div className="hidden md:block bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-4 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Event Agent Core</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              When 500+ students surge, FeastIQ adapts the kitchen buffer, groups incoming orders, and optimizes pickup counters.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {adminTab === 'dashboard' && <AdminDashboard />}
          {adminTab === 'live-orders' && <LiveOrders />}
          {adminTab === 'menu' && <MenuManagement />}
          {adminTab === 'inventory' && <InventoryManagement />}
          {adminTab === 'ai-command' && <AICommandCenter />}
          {adminTab === 'event-management' && <EventManagementCenter />}
          {adminTab === 'demand-prediction' && <DemandPredictionView />}
          {adminTab === 'food-waste' && <FoodWasteView />}
          {adminTab === 'analytics' && <AnalyticsView />}
          {adminTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Post Event Recovery Audit Modal */}
      <EventRecoveryModal
        isOpen={showEventRecoveryModal}
        onClose={() => setShowEventRecoveryModal(false)}
      />
    </div>
  );
}

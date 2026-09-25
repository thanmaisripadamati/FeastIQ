import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  UtensilsCrossed, 
  Sparkles, 
  ShoppingBag, 
  Clock, 
  Compass, 
  User, 
  ShieldCheck, 
  LogOut, 
  Zap, 
  Bell, 
  Layers, 
  Flame,
  ChevronRight
} from 'lucide-react';

export function Navbar({ onOpenLoginModal }) {
  const { 
    currentUser, 
    currentView, 
    navigateTo, 
    cart, 
    metrics, 
    eventRushActive, 
    notifications,
    logout 
  } = useCanteen();

  const [showNotifications, setShowNotifications] = useState(false);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getRushBadge = (level) => {
    switch (level) {
      case 'EXTREME':
        return { text: '🔴 EXTREME RUSH', bg: 'bg-red-50 text-red-700 border-red-200' };
      case 'HIGH':
        return { text: '🟠 HIGH RUSH', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'MEDIUM':
        return { text: '🟡 MEDIUM RUSH', bg: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
      default:
        return { text: '🟢 NORMAL RUSH', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  const rushInfo = getRushBadge(metrics.rushLevel);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro bar with canteen status & test switcher */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/80 to-blue-50/90 border-b border-indigo-100/60 px-4 py-1.5 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-indigo-900">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>FeastIQ AI Intelligence</span>
          </span>
          <span className="text-slate-300">|</span>
          <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${rushInfo.bg}`}>
            {rushInfo.text}
          </span>
          <span className="hidden sm:inline text-slate-600">
            Wait time: <strong className="text-slate-900 font-semibold">{metrics.estimatedWaitTime} mins</strong>
          </span>
          {eventRushActive && (
            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide animate-pulse">
              🚨 500+ EVENT SURGE ACTIVE
            </span>
          )}
        </div>

        {/* Demo Switcher & Role indicator */}
        <div className="flex items-center gap-2">
          {currentUser?.role === 'admin' ? (
            <span className="bg-indigo-600 text-white font-medium px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Kitchen Admin Portal
            </span>
          ) : currentUser ? (
            <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[11px]">
              Student: {currentUser.name || (currentUser.student_id || currentUser.studentId ? `Student ${currentUser.student_id || currentUser.studentId}` : 'Student')} ({currentUser.student_id || currentUser.studentId})
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded text-[11px]">
              Guest / Not Signed In
            </span>
          )}

          <button
            onClick={onOpenLoginModal}
            className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold text-xs ml-1 flex items-center gap-1 cursor-pointer"
          >
            <span>Switch Role / Test Login</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => navigateTo('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-['Outfit']">
                  Feast<span className="text-indigo-600">IQ</span>
                </span>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  OS 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Smart College Canteen OS
              </p>
            </div>
          </div>

          {/* Student Navigation - NO ADMIN CONTROLS VISIBLE */}
          {currentUser?.role === 'student' && (
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => navigateTo('home')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'home'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigateTo('menu')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'menu'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => navigateTo('recommendations')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  currentView === 'recommendations'
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50/50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Recommendations
              </button>
              <button
                onClick={() => navigateTo('orders')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  currentView === 'orders'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4 h-4" />
                My Orders
              </button>
              <button
                onClick={() => navigateTo('profile')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'profile'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Profile
              </button>
            </nav>
          )}

          {/* Admin Header Link if Admin */}
          {currentUser?.role === 'admin' && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                Staff: {currentUser.name} ({currentUser.staffId})
              </span>
              <button
                onClick={() => navigateTo('admin')}
                className="bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Go to Kitchen Dashboard
              </button>
            </div>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="font-semibold text-slate-900 text-sm">System Notifications</h4>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {notifications.length} new
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <strong className="text-slate-800 font-semibold">{n.title}</strong>
                          <span className="text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button (Always visible for student) */}
            {currentUser?.role === 'student' && (
              <button
                onClick={() => navigateTo('cart')}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium shadow-md shadow-indigo-500/15 transition-all cursor-pointer relative"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Cart</span>
                {totalCartCount > 0 && (
                  <span className="bg-white text-indigo-700 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile / Logout */}
            <button
              onClick={onOpenLoginModal}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200/80 transition-colors"
              title="Profile / Switch Role"
            >
              <User className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar for Students */}
      {currentUser?.role === 'student' && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md fixed bottom-0 left-0 right-0 z-40 px-3 py-2 flex items-center justify-around">
          <button
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              currentView === 'home' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => navigateTo('menu')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              currentView === 'menu' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menu</span>
          </button>
          <button
            onClick={() => navigateTo('cart')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium relative ${
              currentView === 'cart' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalCartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigateTo('orders')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              currentView === 'orders' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Orders</span>
          </button>
          <button
            onClick={() => navigateTo('recommendations')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              currentView === 'recommendations' ? 'text-purple-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Picks</span>
          </button>
        </div>
      )}
    </header>
  );
}

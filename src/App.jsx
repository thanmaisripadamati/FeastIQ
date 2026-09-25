import React, { useState } from 'react';
import { CanteenProvider, useCanteen } from './context/CanteenContext';
import { Navbar } from './components/common/Navbar';
import { StudentHome } from './components/student/StudentHome';
import { MenuPage } from './components/student/MenuPage';
import { CartPage } from './components/student/CartPage';
import { OrderTrackingPage } from './components/student/OrderTrackingPage';
import { AIRecommendationsPage } from './components/student/AIRecommendationsPage';
import { StudentProfile } from './components/student/StudentProfile';
import { AdminLayout } from './components/admin/AdminLayout';
import { AccessDeniedModal } from './components/auth/AccessDeniedModal';
import { LoginModal } from './components/auth/LoginModal';
import { Sparkles, UtensilsCrossed, ShieldCheck, Heart } from 'lucide-react';

function FeastIQApp() {
  const { currentView, currentUser, navigateTo } = useCanteen();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // If in admin view and authorized, render AdminLayout directly
  if (currentView === 'admin' && currentUser?.role === 'admin') {
    return (
      <>
        <AdminLayout onOpenLoginModal={() => setIsLoginModalOpen(true)} />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </>
    );
  }

  // Access Denied Screen (Strict RBAC Protection)
  if (currentView === 'access-denied') {
    return (
      <div className="min-h-screen bg-[#f8faff] flex flex-col justify-between">
        <Navbar onOpenLoginModal={() => setIsLoginModalOpen(true)} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
          <AccessDeniedModal onOpenLoginModal={() => setIsLoginModalOpen(true)} />
        </main>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </div>
    );
  }

  // Student Experience
  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col justify-between text-slate-800">
      <Navbar onOpenLoginModal={() => setIsLoginModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1">
        {currentView === 'home' && <StudentHome />}
        {currentView === 'menu' && <MenuPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'orders' && <OrderTrackingPage />}
        {currentView === 'recommendations' && <AIRecommendationsPage />}
        {currentView === 'profile' && (
          <StudentProfile onOpenLoginModal={() => setIsLoginModalOpen(true)} />
        )}
      </main>

      {/* Modern Light Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/80 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs">
              <UtensilsCrossed className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900 font-['Outfit']">
              FeastIQ OS
            </span>
            <span>• AI-Powered Smart College Canteen Operating System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>All currency strictly in Indian Rupees (₹)</span>
            <span>•</span>
            <span>Featuring Event Management Agent (500+ Surge Optimization)</span>
          </div>
        </div>
      </footer>

      {/* Role Switcher & Auth Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CanteenProvider>
      <FeastIQApp />
    </CanteenProvider>
  );
}

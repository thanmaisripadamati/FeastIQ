import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  User, 
  CreditCard, 
  GraduationCap, 
  Mail, 
  Clock, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2,
  LogOut
} from 'lucide-react';

export function StudentProfile({ onOpenLoginModal }) {
  const { currentUser, orders, addNotification } = useCanteen();
  const [balance, setBalance] = useState(currentUser?.walletBalance || 850);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleAddBalance = (amt) => {
    setBalance((prev) => prev + amt);
    setAddedSuccess(true);
    addNotification('Wallet Top-Up', `Added ₹${amt} to your College Dining Card`, 'success');
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
          Student Dining Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Authenticated student credentials, campus wallet balance, and ordering history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User ID Card */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-indigo-600/20">
              {currentUser?.name
                ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                : (currentUser?.student_id || currentUser?.studentId || 'ST').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                  {currentUser?.name || (currentUser?.student_id || currentUser?.studentId ? `Student ${currentUser?.student_id || currentUser?.studentId}` : 'Student')}
                </h2>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Active Student
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{currentUser?.dept || 'Engineering & Technology'} • Campus Dining</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{currentUser?.email || ((currentUser?.student_id || currentUser?.studentId) ? `${(currentUser?.student_id || currentUser?.studentId).toLowerCase()}@college.edu` : 'student@college.edu')}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block">College ID</span>
              <span className="font-mono text-sm font-bold text-slate-900">{currentUser?.student_id || currentUser?.studentId || 'STU001'}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block">Dietary Profile</span>
              <span className="text-sm font-bold text-slate-900">Standard / Non-Veg</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block">Total Orders</span>
              <span className="text-sm font-bold text-indigo-700">
                {orders.filter((o) => (o.student_id || o.studentId) === (currentUser?.student_id || currentUser?.studentId)).length} meal(s)
              </span>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Authenticated via College Google Workspace</span>
            <button
              onClick={onOpenLoginModal}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Switch Role / Sign Out
            </button>
          </div>
        </div>

        {/* Campus Dining Wallet */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />

          <div>
            <div className="flex items-center justify-between text-indigo-200 text-xs mb-3">
              <span className="font-semibold uppercase tracking-wider">Campus Smart Card</span>
              <CreditCard className="w-5 h-5" />
            </div>

            <span className="text-xs text-indigo-200 block mb-1">Available Dining Balance</span>
            <div className="text-3xl font-black font-['Outfit'] tracking-tight mb-4">
              ₹{balance}
            </div>
            <p className="text-[11px] text-indigo-200 leading-relaxed">
              Auto-linked with FeastIQ one-tap kiosk pickups and token issuance.
            </p>
          </div>

          <div className="pt-6 border-t border-indigo-700/50 space-y-2">
            <span className="text-[11px] font-semibold text-indigo-200 uppercase block">Quick Top-Up (₹)</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddBalance(200)}
                className="bg-white/15 hover:bg-white/25 text-white font-bold py-2 rounded-xl text-xs transition-all cursor-pointer"
              >
                + ₹200
              </button>
              <button
                onClick={() => handleAddBalance(500)}
                className="bg-white/15 hover:bg-white/25 text-white font-bold py-2 rounded-xl text-xs transition-all cursor-pointer"
              >
                + ₹500
              </button>
            </div>
            {addedSuccess && (
              <span className="text-[11px] text-emerald-300 font-semibold flex items-center justify-center gap-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Recharged successfully!</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

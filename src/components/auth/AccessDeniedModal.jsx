import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { ShieldAlert, ArrowLeft, LockKeyhole, KeyRound } from 'lucide-react';

export function AccessDeniedModal({ onOpenLoginModal }) {
  const { navigateTo, currentUser } = useCanteen();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-red-100 text-center relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-100/60 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-100/60 rounded-full blur-2xl" />

        <div className="relative">
          <div className="w-16 h-16 bg-red-50 border border-red-200 text-red-600 rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-block bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Security Policy Violation
          </span>

          <h2 className="text-xl font-bold text-slate-900 mb-3 font-['Outfit']">
            Access Denied — Only authorized kitchen staff can access the canteen management portal.
          </h2>

          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Your authenticated session is registered as a <strong className="text-slate-800 font-semibold">Student Account</strong> ({currentUser?.email || 'Student'}).
            Kitchen telemetry, live inventory controls, menu pricing, and the Event Management Command Center are strictly restricted to authorized culinary staff.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6 text-left flex items-start gap-3">
            <LockKeyhole className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800 block mb-0.5">Role-Based Access Control (RBAC)</span>
              Attempt logged under Student ID: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-700">{currentUser?.student_id || currentUser?.studentId || 'STU001'}</code>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Student Area</span>
            </button>
            <button
              onClick={onOpenLoginModal}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2.5 px-4 rounded-xl text-sm transition-all border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-slate-600" />
              <span>Staff Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

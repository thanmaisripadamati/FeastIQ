import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  UserCheck, 
  ChefHat, 
  GraduationCap, 
  X, 
  KeyRound, 
  ShieldCheck, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export function LoginModal({ isOpen, onClose }) {
  const { currentUser, loginAsStudent, loginAsAdmin, logout, navigateTo } = useCanteen();
  const [activeTab, setActiveTab] = useState('student');
  const [studentInput, setStudentInput] = useState('');
  const [studentNameInput, setStudentNameInput] = useState('');
  const [staffPasscode, setStaffPasscode] = useState('STAFF-01');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!studentInput.trim()) {
      setErrorMsg('Please enter a valid Student ID (e.g. STU001) or College Gmail ID');
      return;
    }
    setErrorMsg('');
    await loginAsStudent(studentInput.trim(), studentNameInput.trim());
    onClose();
  };

  const handleQuickDemoStudent = async (sid, sname) => {
    setStudentInput(sid);
    setStudentNameInput(sname);
    setErrorMsg('');
    await loginAsStudent(sid, sname);
    onClose();
  };

  const handleStaffSubmit = (e) => {
    e.preventDefault();
    if (staffPasscode.trim() !== 'STAFF-01') {
      setErrorMsg('Invalid staff passcode! Demo staff passcode is STAFF-01');
      return;
    }
    setErrorMsg('');
    loginAsAdmin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">FeastIQ Authentication</h3>
            <p className="text-xs text-slate-500">Sign in with unique student credentials or staff passcode</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl mb-5 text-sm font-medium">
          <button
            onClick={() => { setActiveTab('student'); setErrorMsg(''); }}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'student'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal</span>
          </button>
          <button
            onClick={() => { setActiveTab('staff'); setErrorMsg(''); }}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'staff'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Kitchen Staff</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Student Login Form */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student ID or College Gmail ID
              </label>
              <input
                type="text"
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                placeholder="e.g. STU001, STU002, or your_id@college.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Name <span className="text-slate-400 font-normal">(Optional for new IDs)</span>
              </label>
              <input
                type="text"
                value={studentNameInput}
                onChange={(e) => setStudentNameInput(e.target.value)}
                placeholder="Enter name or leave blank to auto-derive"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            {/* Quick Demo Test Buttons */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Quick Demo Accounts (SQLite):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoStudent('STU001', 'Thanmai')}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition-all text-center cursor-pointer"
                >
                  <strong className="block text-[11px]">STU001</strong>
                  <span className="text-[10px] text-slate-500">Thanmai</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoStudent('STU002', 'Rahul')}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition-all text-center cursor-pointer"
                >
                  <strong className="block text-[11px]">STU002</strong>
                  <span className="text-[10px] text-slate-500">Rahul</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoStudent('STU003', 'Priya')}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition-all text-center cursor-pointer"
                >
                  <strong className="block text-[11px]">STU003</strong>
                  <span className="text-[10px] text-slate-500">Priya</span>
                </button>
              </div>
            </div>

            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-2.5 text-xs text-indigo-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                New Student IDs automatically register in SQLite with role = 'student'.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Sign In / Register as Student
            </button>

            {/* Test button to verify RBAC protection */}
            <div className="pt-2 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigateTo('admin');
                }}
                className="text-xs text-slate-500 hover:text-red-600 underline font-medium cursor-pointer"
              >
                Test Student navigating to /admin (Verify RBAC Denial)
              </button>
            </div>
          </form>
        )}

        {/* Kitchen Staff Login Form */}
        {activeTab === 'staff' && (
          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kitchen Staff Passcode / ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={staffPasscode}
                  onChange={(e) => setStaffPasscode(e.target.value)}
                  placeholder="Enter staff passcode (STAFF-01)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 font-mono"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Demo Authorized Passcode: <strong className="text-slate-600">STAFF-01</strong> (Chef Ramesh Babu)
              </p>
            </div>

            <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3 text-xs text-purple-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                Authorized staff unlock the full AI Command Center, Event Rush Detection, Live Queue optimization, and inventory controls.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Authenticate Kitchen Staff
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

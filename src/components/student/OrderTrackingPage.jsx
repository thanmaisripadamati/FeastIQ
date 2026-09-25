import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  Clock, 
  CheckCircle2, 
  ShoppingBag, 
  MapPin, 
  Sparkles, 
  RotateCcw, 
  ChefHat, 
  Flame, 
  Timer,
  Check
} from 'lucide-react';

export function OrderTrackingPage() {
  const { orders, currentUser, addToCart, navigateTo, menuItems } = useCanteen();

  // Find user's latest active order strictly belonging to current authenticated student
  const currentStuId = currentUser?.student_id || currentUser?.studentId;
  const studentOrders = orders.filter(
    (o) => (o.student_id || o.studentId) === currentStuId || (currentUser?.name && o.studentName === currentUser?.name)
  );
  const activeOrder = studentOrders.length > 0 ? studentOrders[0] : null;

  const steps = [
    { key: 'Order Placed', label: 'Order Placed', desc: 'Registered in queue' },
    { key: 'Accepted', label: 'Accepted', desc: 'Kitchen acknowledged' },
    { key: 'Preparing', label: 'Preparing', desc: 'Wok / Oven active' },
    { key: 'Ready', label: 'Ready for Pickup', desc: 'Collect at counter' },
    { key: 'Completed', label: 'Delivered', desc: 'Meal enjoyed' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Accepted': return 1;
      case 'Preparing': return 2;
      case 'Ready': return 3;
      case 'Completed': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 0;

  const handleReorder = (order) => {
    order.items.forEach((it) => {
      const match = menuItems.find((m) => m.name === it.name);
      if (match) {
        addToCart(match);
      }
    });
    navigateTo('cart');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
          Live Order & Token Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Real-time telemetry connected directly to the kitchen line.
        </p>
      </div>

      {activeOrder ? (
        /* ACTIVE ORDER CARD */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md">
          {/* Top Token Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider block mb-1">
                Your Assigned Canteen Token
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] tracking-tight">
                {activeOrder.token}
              </h2>
              <p className="text-xs text-indigo-100 mt-1">
                Order ID: <span className="font-mono">{activeOrder.id}</span> • Placed at {activeOrder.time}
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:text-right shrink-0">
              <span className="text-indigo-100 text-[11px] font-semibold uppercase block">
                Estimated Wait
              </span>
              <span className="text-2xl font-black text-white">
                {activeOrder.eta}
              </span>
              <div className="text-[11px] text-indigo-100 flex items-center gap-1 mt-1 justify-start sm:justify-end">
                <MapPin className="w-3 h-3 text-amber-300" />
                <span>{activeOrder.counter}</span>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Preparation Progress
            </h3>

            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-4 left-4 right-4 h-1 bg-slate-100 -z-0 hidden sm:block">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                {steps.map((step, idx) => {
                  const isDone = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                            : isCurrent
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div>
                        <h4
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-indigo-700'
                              : isDone
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </h4>
                        <p className="text-[11px] text-slate-400 hidden sm:block">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ready Callout */}
            {activeOrder.status === 'Ready' && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Your order is ready at {activeOrder.counter}!</h4>
                  <p className="text-xs text-emerald-700">
                    Please display token <strong className="font-bold">{activeOrder.token}</strong> on your phone screen to the kitchen staff.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Ordered Items Table */}
          <div className="p-6 sm:p-8 bg-slate-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Items in this Token
            </h3>

            <div className="space-y-2">
              {activeOrder.items.map((it, i) => (
                <div key={i} className="flex justify-between items-center text-xs bg-white p-3 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                      {it.quantity}x
                    </span>
                    <span className="font-semibold text-slate-800">{it.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    ₹{it.price * it.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-4 text-sm font-bold text-slate-900">
              <span>Total Amount Paid</span>
              <span className="text-indigo-700 font-black text-base">₹{activeOrder.total}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
          <p className="text-slate-500 text-sm">No active order right now.</p>
        </div>
      )}

      {/* Past Orders List */}
      <div>
        <h3 className="text-base font-bold text-slate-900 font-['Outfit'] mb-3">
          Past Orders History
        </h3>

        <div className="space-y-3">
          {studentOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-400 text-xs">
              No previous orders found for this student account ({currentStuId || 'STU001'}).
            </div>
          ) : (
            studentOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{ord.token}</span>
                    <span className="text-xs text-slate-400 font-mono">({ord.id})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ord.status === 'Completed'
                        ? 'bg-slate-100 text-slate-600'
                        : ord.status === 'Ready'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {ord.time} • Total: <strong className="text-slate-700 font-semibold">₹{ord.total}</strong>
                  </span>
                </div>

                <button
                  onClick={() => handleReorder(ord)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Quick Reorder</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

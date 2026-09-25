import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  MapPin, 
  ChefHat, 
  Flame, 
  AlertCircle 
} from 'lucide-react';

export function LiveOrders() {
  const { orders, updateOrderStatus } = useCanteen();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const statuses = ['ALL', 'Order Placed', 'Accepted', 'Preparing', 'Ready', 'Completed'];

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchToken = o.token.toLowerCase().includes(q);
      const matchStudent = o.studentName.toLowerCase().includes(q);
      const matchId = o.id.toLowerCase().includes(q);
      if (!matchToken && !matchStudent && !matchId) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Kitchen Live Queue & Token Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time multi-counter token status manager. Update cooking states as orders advance.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Token (e.g. #F284) or Student..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white shadow-2xs focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === st
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {st === 'ALL' ? `All Orders (${orders.length})` : st}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrders.map((ord) => (
          <div
            key={ord.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
          >
            {/* Top row */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">{ord.id} • {ord.time}</span>
                  <h3 className="text-xl font-black font-['Outfit'] text-slate-900 tracking-tight">
                    {ord.token}
                  </h3>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  ord.status === 'Completed'
                    ? 'bg-slate-100 text-slate-600'
                    : ord.status === 'Ready'
                    ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                    : ord.status === 'Preparing'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {ord.status}
                </span>
              </div>

              {/* Student info */}
              <div className="bg-slate-50 rounded-xl p-2.5 mb-3 text-xs flex justify-between items-center">
                <div>
                  <strong className="text-slate-800 font-semibold block">{ord.studentName || (ord.student_id ? `Student ${ord.student_id}` : 'Student')}</strong>
                  <span className="text-[11px] text-slate-400 font-mono">{ord.student_id || ord.studentId}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Routing</span>
                  <span className="font-semibold text-indigo-700 text-[11px]">{ord.counter}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 mb-4 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Food Items</span>
                {ord.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-700">
                    <span><strong className="font-semibold text-indigo-600">{it.quantity}x</strong> {it.name}</span>
                    <span className="font-medium text-slate-900">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row & Status Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Amount</span>
                <span className="text-base font-extrabold text-slate-900">₹{ord.total}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {ord.status === 'Order Placed' && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'Accepted')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Accept Order
                  </button>
                )}
                {ord.status === 'Accepted' && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Start Cook
                  </button>
                )}
                {ord.status === 'Preparing' && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'Ready')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Mark Ready
                  </button>
                )}
                {ord.status === 'Ready' && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'Completed')}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Complete
                  </button>
                )}
                {ord.status === 'Completed' && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Delivered</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

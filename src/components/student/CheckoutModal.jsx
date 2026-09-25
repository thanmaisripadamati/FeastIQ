import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Wallet, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function CheckoutModal({ isOpen, onClose, selectedCounter }) {
  const { 
    currentUser, 
    cart, 
    cartSubtotal, 
    cartTax, 
    cartTotal, 
    placeOrder, 
    navigateTo,
    metrics 
  } = useCanteen();

  const [paymentMethod, setPaymentMethod] = useState('CAMPUS_ID'); // 'CAMPUS_ID' | 'UPI' | 'CASH'
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isOpen) return null;

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const order = placeOrder({
        paymentMethod: paymentMethod === 'CAMPUS_ID' ? 'College ID Card Wallet' : paymentMethod === 'UPI' ? 'UPI (Simulated)' : 'Pay at Counter',
        counter: selectedCounter || 'Counter 1 (Meals)'
      });

      setCreatedOrder(order);
      setIsProcessing(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // fallback
      }
    }, 900);
  };

  const handleFinishAndTrack = () => {
    onClose();
    navigateTo('orders');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        {!createdOrder && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* ORDER SUCCESS SCREEN */}
        {createdOrder ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-sm animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Order Confirmed & Sent to Kitchen
            </span>

            <h3 className="text-2xl font-black text-slate-900 mt-3 font-['Outfit']">
              {createdOrder.token}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Order ID: <span className="font-mono text-slate-700">{createdOrder.id}</span>
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-5 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Student</span>
                <span className="font-semibold text-slate-800">{createdOrder.studentName} ({createdOrder.student_id || createdOrder.studentId})</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Pickup Location</span>
                <span className="font-semibold text-indigo-700">{createdOrder.counter}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Estimated Ready In</span>
                <span className="font-semibold text-emerald-700">{createdOrder.eta} ({metrics.estimatedWaitTime} min rush buffer)</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-slate-200">
                <span className="text-slate-600 font-semibold">Total Paid</span>
                <span className="font-extrabold text-slate-900 text-sm">₹{createdOrder.total}</span>
              </div>
            </div>

            <button
              onClick={handleFinishAndTrack}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-5 rounded-2xl text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Track Live Token Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Digital Checkout</h3>
                <p className="text-xs text-slate-500">Simulate student payment in Indian Rupees (₹)</p>
              </div>
            </div>

            {/* Student details header */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-5 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Ordering Student</span>
                <strong className="text-slate-800 font-semibold">{currentUser?.name || (currentUser?.student_id || currentUser?.studentId ? `Student ${currentUser?.student_id || currentUser?.studentId}` : 'Student')}</strong>
                <span className="text-slate-500 ml-1.5 font-mono">({currentUser?.student_id || currentUser?.studentId || 'STU001'})</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Selected Counter</span>
                <span className="font-semibold text-indigo-700">{selectedCounter || 'Counter 1 (Meals)'}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2.5 mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Choose Payment Method
              </label>

              {/* Campus ID Card */}
              <div
                onClick={() => setPaymentMethod('CAMPUS_ID')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'CAMPUS_ID'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Campus ID Card RFID</h4>
                    <p className="text-[11px] text-slate-500">
                      Balance: <strong className="text-emerald-600 font-semibold">₹{currentUser?.walletBalance || 850}</strong>
                    </p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payMethod"
                  checked={paymentMethod === 'CAMPUS_ID'}
                  onChange={() => setPaymentMethod('CAMPUS_ID')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              {/* UPI */}
              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">UPI / QR Code</h4>
                    <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payMethod"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              {/* Cash at Counter */}
              <div
                onClick={() => setPaymentMethod('CASH')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'CASH'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Pay at Counter</h4>
                    <p className="text-[11px] text-slate-500">Pay cash upon token call</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payMethod"
                  checked={paymentMethod === 'CASH'}
                  onChange={() => setPaymentMethod('CASH')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Bill Summary in ₹ */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-5 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal ({cart.length} distinct)</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Campus Canteen GST & Fee (5%)</span>
                <span>₹{cartTax}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                <span>Total Payable Amount</span>
                <span className="text-indigo-700 font-extrabold text-base">₹{cartTotal}</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={handleConfirmOrder}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-5 rounded-2xl text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Secure Token...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Pay ₹{cartTotal} & Place Order</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

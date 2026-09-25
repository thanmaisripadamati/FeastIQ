import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  UtensilsCrossed, 
  MapPin, 
  Sparkles, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

export function CartPage() {
  const { 
    cart, 
    cartSubtotal, 
    cartTax, 
    cartTotal, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    navigateTo,
    metrics
  } = useCanteen();

  const [selectedCounter, setSelectedCounter] = useState('Counter 1 (Meals)');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-['Outfit'] mb-2">
          Your Tray is Empty
        </h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Looks like you haven't selected any items yet. Browse through today's freshly prepared college menu.
        </p>
        <button
          onClick={() => navigateTo('menu')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 inline-flex items-center gap-2 cursor-pointer"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Browse Canteen Menu</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
          Your Meal Tray
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your chosen canteen items and select your preferred counter for collection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-900 text-sm">
                Tray Items ({cart.reduce((a, b) => a + b.quantity, 0)} portions)
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500">₹{item.price} each</p>
                      <span className="text-[11px] text-indigo-600 font-medium">
                        Prep: ~{item.prepTime} mins
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Reduce"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal for item */}
                    <span className="font-extrabold text-slate-900 text-sm w-16 text-right">
                      ₹{item.price * item.quantity}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collection Counter Selection */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm font-['Outfit']">
                Select Pickup Counter
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              FeastIQ routes tokens dynamically to balance counter lines and avoid choke points.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Counter 1 (Meals)', subtitle: 'Biryani, Meals & Rotis', speed: 'Avg 8 min' },
                { name: 'Counter 2 (Snacks)', subtitle: 'Shawarma, Noodles, Maggie', speed: 'Avg 5 min' },
                { name: 'Counter 3 (Beverages)', subtitle: 'Chilled Soft Drinks & Puffs', speed: 'Instant' }
              ].map((c) => (
                <div
                  key={c.name}
                  onClick={() => setSelectedCounter(c.name)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedCounter === c.name
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{c.name}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {c.speed}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{c.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Price & Checkout Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs sticky top-24">
            <h3 className="font-bold text-slate-900 text-base font-['Outfit'] mb-4">
              Payment Breakdown
            </h3>

            <div className="space-y-3 text-xs border-b border-slate-100 pb-4 mb-4">
              <div className="flex justify-between text-slate-600">
                <span>Food Items Subtotal</span>
                <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Campus Infrastructure & GST (5%)</span>
                <span className="font-semibold text-slate-900">₹{cartTax}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>FeastIQ Queue Skip Guarantee</span>
                <span>FREE (₹0)</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-6">
              <div>
                <span className="font-bold text-slate-900 text-sm block">Total Amount</span>
                <span className="text-[11px] text-slate-400">All prices in Indian Rupees</span>
              </div>
              <span className="text-2xl font-black text-indigo-700 font-['Outfit']">
                ₹{cartTotal}
              </span>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 px-5 rounded-2xl text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Simulated Hackathon Checkout (₹ INR)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedCounter={selectedCounter}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../../stores/userStore";
import { useShoppingCartStore } from "../../stores/useShoppingCart";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ChevronLeft,
  CreditCard,
  AlertCircle,
} from "lucide-react";

// --- REUSABLE CONFIRMATION MODAL ---
const PurgeConfirmModal = ({ isOpen, onClose, onConfirm, isPurging }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 text-center"
        >
          <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6 mx-auto">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
            Purge Registry?
          </h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
            This will permanently remove all hardware units from your current
            session.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="py-4 text-sm font-bold text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isPurging}
              className="py-4 text-sm font-bold text-white bg-red-500 rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center"
            >
              {isPurging ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Clear All"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function ShoppingCartPage() {
  const userId = useUserStore((state) => state.user?.id);
  const {
    carts = [],
    loading,
    fetchCartsByUserId,
    updateCart,
    deleteCart,
    optimisticallyUpdateItemQuantity,
    setCurrentUserId,
  } = useShoppingCartStore();

  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  useEffect(() => {
    if (userId) {
      setCurrentUserId(userId);
      fetchCartsByUserId(userId);
    }
  }, [userId, setCurrentUserId, fetchCartsByUserId]);

  const cart = carts[0] || { items: [] };
  const hasItems = cart.items?.length > 0;

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const price = item.product_item?.product?.price || 0;
      return total + price * item.qty;
    }, 0);
  };

  const handleQuantityChange = async (productItemId, newQty) => {
    if (newQty < 1) return;
    optimisticallyUpdateItemQuantity(cart.id, productItemId, newQty);
    const updatedItems = cart.items.map((item) =>
      item.product_item_id === productItemId ? { ...item, qty: newQty } : item
    );
    try {
      await updateCart(cart.id, { items: updatedItems });
    } catch (err) {
      toast.error("Sync Error. Reverting.");
      fetchCartsByUserId(userId);
    }
  };

  const handleDeleteItem = async (productItemId) => {
    const updatedItems = cart.items.filter(
      (item) => item.product_item_id !== productItemId
    );
    await toast.promise(
      updateCart(cart.id, { items: updatedItems }).then(() =>
        fetchCartsByUserId(userId)
      ),
      {
        loading: "Removing unit...",
        success: "Unit removed",
        error: "Failed to remove.",
      }
    );
  };

  const handleConfirmPurge = async () => {
    setIsPurging(true);
    try {
      await deleteCart(cart.id);
      toast.success("Cart registry purged");
      fetchCartsByUserId(userId);
    } catch (e) {
      toast.error("Failed to purge cart");
    } finally {
      setIsPurging(false);
      setIsPurgeModalOpen(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Accessing Database
        </p>
      </div>
    );

  if (!hasItems)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
        <div className="w-24 h-24 bg-white rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-slate-200" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
          Cart is Empty
        </h2>
        <p className="text-slate-400 text-sm font-medium mb-10 text-center max-w-xs">
          No active hardware units detected.
        </p>
        <Link
          href="/store"
          className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
        >
          Start Exploration
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pt-4 pb-20 sm:pb-32">
      <PurgeConfirmModal
        isOpen={isPurgeModalOpen}
        onClose={() => setIsPurgeModalOpen(false)}
        onConfirm={handleConfirmPurge}
        isPurging={isPurging}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100">
              <ShoppingCart className="w-3.5 h-3.5" /> Security Protocol Active
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase">
              Cart
            </h1>
          </div>
          <button
            onClick={() => setIsPurgeModalOpen(true)}
            className="flex items-center justify-center gap-2 text-[11px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors py-2 px-4 rounded-xl hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" /> Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: LIST OF ITEMS */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.items.map((item) => (
                <CartItemRow
                  key={item.product_item_id}
                  item={item}
                  onQtyChange={handleQuantityChange}
                  onDelete={handleDeleteItem}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* RIGHT: SUMMARY (RESPONSIVE) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-slate-100 shadow-xl shadow-blue-900/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16" />

              <h3 className="relative z-10 text-xl font-black text-slate-900 mb-8 uppercase tracking-tight">
                Summary
              </h3>

              <div className="relative z-10 space-y-5 mb-10">
                <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span className="text-slate-900">
                    ${calculateTotal().toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-wider">
                  <span>Vat (0%)</span>
                  <span className="text-slate-900">$0.00</span>
                </div>
                <div className="h-px bg-slate-50 w-full" />
                <div className="flex flex-col gap-1 pt-2">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Total valuation
                  </span>
                  <span className="text-5xl font-black text-blue-600 tracking-tighter">
                    ${calculateTotal().toFixed(0)}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTON - Highly Responsive */}
              <Link
                href="/checkout"
                className="group relative w-full bg-slate-900 text-white rounded-[20px] overflow-hidden transition-all duration-300 active:scale-[0.97] shadow-xl shadow-blue-500/10 flex items-center justify-center py-5 sm:py-6"
              >
                {/* Technocore Unit Color Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] whitespace-nowrap">
                    Checkout
                  </span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </Link>
            </div>

            <Link
              href="/store"
              className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
              Return to Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ITEM ROW ---
function CartItemRow({ item, onQtyChange, onDelete }) {
  const p = item.product_item?.product || {};
  const itemTotal = (p.price || 0) * item.qty;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group bg-white p-4 sm:p-6 rounded-[32px] border border-slate-100 flex flex-col sm:flex-row items-center gap-6 hover:border-blue-100 transition-all hover:shadow-2xl hover:shadow-blue-500/5"
    >
      {/* Image Container */}
      <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 bg-slate-50 rounded-[24px] border border-slate-50 overflow-hidden p-3 transition-transform group-hover:scale-105">
        <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden shadow-inner">
          <Image
            src={p.product_image_url || "/placeholder.svg"}
            alt={p.name}
            fill
            className="object-contain p-2"
          />
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2.5 py-1 bg-blue-50 rounded-lg">
            Unit Block
          </span>
          <div className="h-1 w-1 bg-slate-200 rounded-full" />
        </div>
        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight truncate mb-1 group-hover:text-blue-600 transition-colors">
          {p.name}
        </h4>
        <p className="text-xs font-medium text-slate-400 line-clamp-1 mb-5 italic px-4 sm:px-0">
          "{p.description}"
        </p>

        <div className="text-2xl font-black text-slate-900 tracking-tighter sm:hidden mb-4">
          ${itemTotal.toFixed(0)}
        </div>
      </div>

      {/* Action Area */}
      <div className="flex flex-row sm:flex-col items-center gap-6 shrink-0 w-full sm:w-auto border-t sm:border-t-0 border-slate-50 pt-6 sm:pt-0">
        <div className="flex items-center bg-slate-100/50 rounded-2xl p-1.5 border border-slate-100 shadow-inner">
          <button
            onClick={() => onQtyChange(item.product_item_id, item.qty - 1)}
            disabled={item.qty <= 1}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all disabled:opacity-20"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="w-12 text-center text-base font-black text-slate-900">
            {item.qty}
          </span>
          <button
            onClick={() => onQtyChange(item.product_item_id, item.qty + 1)}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 w-full">
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase leading-none mb-1">
              VALUATION
            </p>
            <p className="text-xl font-black text-slate-900 tracking-tighter">
              ${itemTotal.toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

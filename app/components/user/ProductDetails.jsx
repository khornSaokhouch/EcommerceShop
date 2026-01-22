"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Minus,
  Plus,
  Heart,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Share2,
  Award,
  Cpu,
  Zap,
  Loader2,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";

// Stores
import { useProductStore } from "../../stores/useProductStore";
import { useShoppingCartStore } from "../../stores/useShoppingCart";
import { useUserStore } from "../../stores/userStore";
import { useFavouritesStore } from "../../stores/useFavouritesStore";

// Supplementary Components
import UserReviews from "./UserReviews";
import ProductDiscountSection from "./ProductDiscountSection";
import Products from "./Products";

export default function ProductDetails({ productSlug }) {
  const userId = useUserStore((state) => state.user?.id);
  const { product, fetchProductBySlug, loading } = useProductStore();
  const { carts = [], updateCart, fetchCartsByUserId } = useShoppingCartStore();
  const { addFavourite, favourites } = useFavouritesStore();

  const [quantity, setQuantity] = useState(1);
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    if (productSlug) fetchProductBySlug(productSlug);
    if (userId) fetchCartsByUserId(userId);
  }, [productSlug, userId, fetchProductBySlug, fetchCartsByUserId]);

  useEffect(() => {
    if (product && Array.isArray(favourites)) {
      setIsFavourited(favourites.some((fav) => fav?.product_id === product.id));
    }
  }, [product, favourites]);

  const handleFavouriteClick = async () => {
    if (!userId) return toast.error("Please log in.");
    setIsFavourited(!isFavourited);
    try {
      await addFavourite({ user_id: userId, product_id: product.id });
      toast.success(isFavourited ? "Unit Removed" : "Unit Reserved");
    } catch {
      setIsFavourited(isFavourited);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) return toast.error("Please log in.");
    const cart = carts[0];
    if (!cart) return toast.error("Registry not found.");

    const currentItems = cart.items || [];
    const itemIndex = currentItems.findIndex(
      (i) => i.product_item_id === product.id
    );
    const updatedItems =
      itemIndex > -1
        ? currentItems.map((item, idx) =>
            idx === itemIndex ? { ...item, qty: item.qty + quantity } : item
          )
        : [...currentItems, { product_item_id: product.id, qty: quantity }];

    await toast.promise(updateCart(cart.id, { items: updatedItems }), {
      loading: "Syncing Registry...",
      success: "Unit deployed to cart!",
      error: "Sync error.",
    });
    fetchCartsByUserId(userId);
  };

  const orderProductId = carts?.[0]?.items?.find(
    (item) => item.product_item_id === product?.id
  )?.order_product_id;

  // if (loading) return (
  //   <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfdfe]">
  //     <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-4" />
  //     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Decrypting Specs</p>
  //   </div>
  // );

  // if (!product) return null;

  return (
    <div className=" min-h-screen pt-4  px-4 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto">
        {/* Top Header - Mobile Optimized */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <Link
            href="/store"
            className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to Inventory</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        {/* --- MAIN INTERFACE (Responsive Grid) --- */}
        <div className="bg-white rounded-[24px] lg:rounded-[40px] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* 1. Visual Unit (Mobile: Top, Desktop: Left Sticky) */}
            <div className="lg:col-span-5 bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-100 p-4 sm:p-10">
              <div className="lg:sticky lg:top-32">
                <div className="relative aspect-square w-full rounded-[20px] lg:rounded-[32px] overflow-hidden bg-white border border-white shadow-inner group">
                  <Image
                    src={product.product_image_url}
                    alt={product.name}
                    fill
                    className="object-contain p-6 sm:p-12 group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute top-4 left-4 bg-slate-900 text-white text-[8px] sm:text-[9px] font-black py-1 px-3 rounded-lg tracking-widest uppercase z-10">
                    Unit Model v2
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Information Hub */}
            <div className="lg:col-span-4 p-6 sm:p-10 flex flex-col">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
                    {product.category || "Hardware"}
                  </span>
                  <div className="h-1 w-1 bg-slate-200 rounded-full" />
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    ID: #{product.id}
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 text-emerald-500">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Authorized Unit
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 bg-slate-50 rounded-[20px] lg:rounded-[24px] border border-slate-100">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
                      ${product.price?.toFixed(0)}
                    </span>
                    <span className="text-slate-400 font-bold text-sm line-through opacity-50">
                      $ {(product.price * 1.2).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      Global Node Dispatch Available
                    </span>
                  </div>
                </div>

                <p className="text-slate-500 leading-relaxed text-sm font-medium italic">
                  "Professional hardware architecture featuring industrial-grade
                  components, optimized for enterprise-level processing."
                </p>

                <div className="flex items-center gap-2 py-2.5 px-4 bg-emerald-50/50 rounded-xl border border-emerald-100 w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">
                    Status: In Stock
                  </span>
                </div>
              </div>

              {/* Actions Section - Mobile Friendly Stack */}
              <div className="mt-8 lg:mt-10 space-y-6 pt-8 lg:pt-10 border-t border-slate-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-4">
                  {/* Quantity Switcher */}
                  <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white rounded-xl text-slate-400 hover:text-blue-600 shadow-sm transition-all"
                    >
                      <Minus className="w-4" />
                    </button>

                    <span className="px-6 font-black text-slate-900 text-lg text-center sm:text-base">
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white rounded-xl text-slate-400 hover:text-blue-600 shadow-sm transition-all"
                    >
                      <Plus className="w-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:flex-1 h-14 bg-slate-900 text-white rounded-[18px] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 sm:gap-3 hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="truncate">Add</span>
                  </button>

                  {/* Favourite Button */}
                  <button
                    onClick={handleFavouriteClick}
                    className={`w-14 h-14 shrink-0 rounded-[18px] border flex items-center justify-center transition-all 
        ${
          isFavourited
            ? "bg-red-50 border-red-100 text-red-500"
            : "bg-white border-slate-200 text-slate-400 hover:text-red-500"
        }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavourited ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Right Sidebar Unit Summary (Mobile: Stacks at Bottom) */}
            <div className="lg:col-span-3 bg-slate-50/50 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100">
              <div className="space-y-6 lg:space-y-8">
                <div>
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-blue-600" /> Session
                    Registry
                  </h3>
                  <div className="bg-white p-4 sm:p-5 rounded-[24px] border border-slate-200 shadow-sm">
                    <UnitSummary product={product} carts={carts} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  <Link
                    href="/shopping-cart"
                    className="block w-full text-center py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-blue-600 transition-all"
                  >
                    Open Cart
                  </Link>
                  <Link
                    href="/checkout"
                    className="block w-full text-center py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-50 transition-all"
                  >
                    Direct Checkout
                  </Link>
                </div>
              </div>

              <div className="mt-8 lg:mt-10 border-t border-slate-100 pt-6">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center lg:text-left">
                  Secured Processing
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 opacity-30 grayscale">
                  <div className="h-5 w-8 bg-slate-400 rounded" />
                  <div className="h-5 w-8 bg-slate-400 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supplementary Sections */}
        <div className="mt-16 sm:mt-24 space-y-16 sm:space-y-24">
          <UserReviews orderProductId={orderProductId} userId={userId} />
          <ProductDiscountSection />
          <section>
            <div className="flex items-center justify-between mb-8 sm:mb-10 border-b border-slate-100 pb-6">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tighter">
                Compatible <span className="text-blue-600">Hardware</span>
              </h2>
              <Link
                href="/store"
                className="text-[9px] font-black text-blue-600 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2"
              >
                Registry <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <Products />
          </section>
        </div>
      </main>
    </div>
  );
}

function UnitSummary({ product, carts }) {
  const allItems = carts.flatMap((cart) => cart.items || []);
  const filteredItems = allItems.filter(
    (i) => String(i.product_item?.product?.id) === String(product?.id)
  );
  const subTotal = filteredItems.reduce(
    (total, item) =>
      total + (item.product_item?.product?.price || 0) * item.qty,
    0
  );

  if (filteredItems.length === 0) {
    return (
      <p className="text-[10px] text-slate-400 text-center py-4 italic font-medium uppercase tracking-tight">
        No units of this model in cart
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {filteredItems.map((item) => (
        <div key={item.id} className="flex gap-3 items-center">
          <div className="w-10 h-10 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100 p-1 relative">
            <Image
              src={item.product_item?.product?.product_image_url}
              fill
              className="object-contain"
              alt="cart item"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-slate-800 truncate uppercase">
              {item.product_item?.product?.name}
            </p>
            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
              {item.qty} Node(s)
            </p>
          </div>
        </div>
      ))}
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
          Valuation
        </span>
        <span className="text-sm font-black text-slate-900 tracking-tighter">
          ${subTotal.toFixed(0)}
        </span>
      </div>
    </div>
  );
}

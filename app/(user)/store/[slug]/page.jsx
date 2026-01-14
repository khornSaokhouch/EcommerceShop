"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Globe,
  Clock,
  Package,
  ShoppingBag,
  Loader2,
  ShieldCheck,
  ArrowUpRight,
  ChevronLeft,
  MessageCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

import { useCompanyInfoStore } from "../../../stores/useCompanyInfoStore";
import { useProductStore } from "../../../stores/useProductStore";
import { useUserStore } from "../../../stores/userStore";
import { useFavouritesStore } from "../../../stores/useFavouritesStore";
import ProductCard from "../../../components/user/ProductCard";

export default function StoreProductsPage() {
  const { slug } = useParams();
  const { companies, fetchCompanies, loading: storeLoading } = useCompanyInfoStore();
  const { products, fetchProductsByStore, loading: productLoading } = useProductStore();
  const userId = useUserStore((state) => state.user?.id);
  const { favourites, addFavourite, removeFavourite } = useFavouritesStore();

  const [store, setStore] = useState(null);
  const [isLoadingFav, setIsLoadingFav] = useState(false);

  const slugify = (text) =>
    text?.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  useEffect(() => {
    if (!slug || !Array.isArray(companies)) return;
    const found = companies.find((c) => c.slug === slug || slugify(c.company_name) === slug);
    setStore(found || null);
    if (found?.id) fetchProductsByStore(found.id);
  }, [slug, companies, fetchProductsByStore]);

  const handleToggleFavourite = async (productId) => {
    if (!userId) return toast.error("Please login to manage favourites.");
    setIsLoadingFav(true);
    try {
      const favRecord = favourites?.find((fav) => fav?.product_id === productId);
      if (!favRecord) {
        await addFavourite({ user_id: userId, product_id: productId });
        toast.success("Added to favourites!");
      } else {
        await removeFavourite(favRecord.id);
        toast.success("Removed from favourites!");
      }
    } catch (err) { toast.error("Failed to update favourite."); }
    finally { setIsLoadingFav(false); }
  };

  if (storeLoading) return <LoadingState message="Syncing Vendor Registry..." />;
  if (!store && !storeLoading) return <NotFoundState />;

  return (
    <div className="min-h-screen bg-[#fcfdfe]">
      {/* 1. HERO SECTION - More Compact */}
      <section className="relative bg-slate-900 pt-12 pb-24 lg:pt-16 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220] via-slate-900 to-slate-900" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <button
            onClick={() => window.history.back()}
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors text-[10px] font-black uppercase tracking-widest group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Network
          </button>

          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-10">
            {/* Logo Wrapper - Matching User Profile Style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="relative w-28 h-28 lg:w-40 lg:h-40 rounded-[32px] lg:rounded-[40px] p-1 bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-2xl shrink-0"
            >
              <div className="w-full h-full rounded-[28px] lg:rounded-[36px] overflow-hidden bg-white flex items-center justify-center border-4 border-white">
                {store?.company_image_url ? (
                    <img src={store.company_image_url} alt={store.company_name} className="object-cover w-full h-full" />
                ) : (
                    <span className="text-4xl lg:text-6xl font-black text-blue-600">{store?.company_name?.charAt(0)}</span>
                )}
              </div>
            </motion.div>

            {/* Branding Details */}
            <div className="text-center lg:text-left flex-1">
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 backdrop-blur-md text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                  <ShieldCheck className="w-3 h-3" /> Verified Partner
                </div>
                {/* CHAT LINK */}
                <Link 
                  href={`/chat?vendorId=${store.id}`}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all backdrop-blur-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Message Vendor
                </Link>
              </div>

              <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                {store?.company_name}
              </h1>
              <p className="text-slate-400 text-xs md:text-sm max-w-xl leading-relaxed mx-auto lg:mx-0 font-medium">
                {store?.description || "High-performance hardware solutions and official distribution services."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPACT INFO BAR */}
      <div className="container mx-auto px-6 relative z-20 -mt-10 lg:-mt-12 max-w-7xl">
        <div className="bg-white rounded-[32px] p-5 lg:p-8 shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoItem icon={MapPin} label="Base Hub" value={`${store?.city || "Global"}`} />
          <InfoItem icon={Globe} label="Digital Portal" value={store?.website_url ? "Portal Active" : "Internal Only"} href={store?.website_url} isLink />
          <InfoItem icon={Clock} label="Operational" value={store?.business_hours || "09:00 - 18:00"} />
        </div>

        {/* 3. PRODUCT LIST SECTION */}
        <section className="mt-16 pb-20">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 px-2">
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight uppercase">Inventory</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                Active Listings: {products.length} Professional Units
              </p>
            </div>
            <div className="h-px flex-1 mx-8 bg-slate-100 hidden sm:block" />
            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
              VOD ID: #{store?.id}
            </div>
          </div>

          {productLoading ? (
  /* --- REFINED COMPACT LOADING --- */
  <div className="py-12 text-center flex flex-col items-center justify-center">
    <div className="relative mb-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 relative z-10" />
      <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-blue-100 animate-ping opacity-20" />
    </div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
      Syncing Catalog Registry
    </p>
  </div>
) : products.length === 0 ? (
  /* --- COMPACT EMPTY STATE --- */
  <div className="py-12 bg-white rounded-[24px] border border-slate-100 flex flex-col items-center justify-center shadow-sm">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-3 text-slate-300">
      <Package className="w-5 h-5" />
    </div>
    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
      No Active Units Found
    </h4>
  </div>
) : (
  /* --- REFINED COMPACT GRID --- */
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    /* gap-4 for mobile, gap-6 for desktop ensures it doesn't look squashed but remains compact */
    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
  >
    {products.map((product) => {
      const favRecord = favourites?.find((fav) => fav?.product_id === product.id);
      return (
        <ProductCard
          key={product.id}
          product={product}
          isFavourite={!!favRecord}
          onAddFavourite={() => handleToggleFavourite(product.id)}
          disabled={isLoadingFav}
        />
      );
    })}
  </motion.div>
)}
        </section>
      </div>
    </div>
  );
}

/* ---------------- COMPONENT PARTS ---------------- */

function InfoItem({ icon: Icon, label, value, href, isLink }) {
  const content = (
    <div className="flex items-center gap-4 group cursor-default p-2">
      <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <div className="flex items-center gap-1.5">
          <p className="font-bold text-slate-900 text-xs tracking-tight truncate">{value}</p>
          {isLink && <ArrowUpRight className="w-3 h-3 text-blue-500" />}
        </div>
      </div>
    </div>
  );
  return isLink && href ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : content;
}

function LoadingState({ message }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfdfe]">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{message}</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfe] px-6">
      <div className="max-w-sm w-full text-center bg-white p-12 rounded-[32px] shadow-xl border border-slate-100">
        <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase">Partner Offline</h2>
        <p className="text-slate-400 mb-8 text-xs font-medium leading-relaxed">This manufacturer registry entry is currently unavailable.</p>
        <button onClick={() => window.history.back()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">Return to Marketplace</button>
      </div>
    </div>
  );
}
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
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useCompanyInfoStore } from "../../../stores/useCompanyInfoStore";
import { useProductStore } from "../../../stores/useProductStore";
import { useUserStore } from "../../../stores/userStore";
import { useFavouritesStore } from "../../../stores/useFavouritesStore";
import ProductCard from "../../../components/user/ProductCard";

export default function StoreProductsPage() {
  const { slug } = useParams();
  const {
    companies,
    fetchCompanies,
    loading: storeLoading,
  } = useCompanyInfoStore();
  const {
    products,
    fetchProductsByStore,
    loading: productLoading,
  } = useProductStore();
  const userId = useUserStore((state) => state.user?.id);
  const { favourites, addFavourite, removeFavourite } = useFavouritesStore();

  const [store, setStore] = useState(null);
  const [isLoadingFav, setIsLoadingFav] = useState(false);

  const slugify = (text) =>
    text
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (!slug || !Array.isArray(companies)) return;
    const found = companies.find(
      (c) => c.slug === slug || slugify(c.company_name) === slug
    );
    setStore(found || null);
    if (found?.id) fetchProductsByStore(found.id);
  }, [slug, companies, fetchProductsByStore]);

  const handleToggleFavourite = async (productId) => {
    if (!userId) return toast.error("Please login to manage favourites.");
    setIsLoadingFav(true);
    try {
      const favRecord = favourites?.find(
        (fav) => fav?.product_id === productId
      );
      if (!favRecord) {
        await addFavourite({ user_id: userId, product_id: productId });
        toast.success("Added to favourites!");
      } else {
        await removeFavourite(favRecord.id);
        toast.success("Removed from favourites!");
      }
    } catch (err) {
      toast.error("Failed to update favourite.");
    } finally {
      setIsLoadingFav(false);
    }
  };

  if (storeLoading)
    return <LoadingState message="Syncing Vendor Registry..." />;

  if (!store && !storeLoading) return <NotFoundState />;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 pt-16 pb-32 lg:pt-28 lg:pb-35 overflow-hidden">
        {/* Pattern */}
        {/* Texture */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        {/* Depth gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-slate-900" />

        {/* Blue glow */}
        <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-blue-500/20 rounded-full blur-[160px]" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-7xl">
          {/* Back Action */}
          <button
            onClick={() => window.history.back()}
            className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
            Back to Partners
          </button>

          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 lg:gap-12">
            {/* Logo Wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-32 h-32 lg:w-48 lg:h-48 rounded-[2rem] lg:rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl bg-white shrink-0"
            >
              {store?.company_image_url ? (
                <img
                  src={store.company_image_url}
                  alt={store.company_name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-slate-50 text-5xl lg:text-7xl font-black text-blue-600">
                  {store?.company_name?.charAt(0).toUpperCase()}
                </div>
              )}
            </motion.div>

            {/* Branding Details */}
            <div className="text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 backdrop-blur-md text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/20 shadow-xl">
                <ShieldCheck className="w-3.5 h-3.5" /> Official TechnoCore
                Partner
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-none">
                {store?.company_name}
              </h1>
              <p className="text-slate-400 text-sm md:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
                {store?.description ||
                  "Leading high-performance technical hardware solutions and professional hardware distribution."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING INFO BAR */}
      <div className="container mx-auto px-4 lg:px-8 relative z-20 -mt-16 lg:-mt-24 max-w-7xl">
        <div className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 shadow-2xl shadow-blue-900/5 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          <InfoItem
            icon={MapPin}
            label="Location"
            value={`${store?.city || "Global"}, ${store?.country || "Core"}`}
          />
          <InfoItem
            icon={Globe}
            label="Website"
            value={store?.website_url ? "Portal Access" : "Not Available"}
            href={store?.website_url}
            isLink
          />
          <InfoItem
            icon={Clock}
            label="Availability"
            value={store?.business_hours || "09:00 - 18:00 (UTC)"}
          />
        </div>

        {/* 3. PRODUCT LIST SECTION */}
        <section className="mt-16 lg:mt-24 pb-20">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4 border-b border-slate-100 pb-6">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight uppercase">
                Inventory Marketplace
              </h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                Showing {products.length} Professional Units
              </p>
            </div>
            <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase">
              Vendor ID: #00{store?.id}
            </div>
          </div>

          {productLoading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Decrypting Inventory...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200">
              <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">
                No active listings from this vendor.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {products.map((product) => {
                const favRecord = favourites?.find(
                  (fav) => fav?.product_id === product.id
                );
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
    <div className="flex items-center gap-4 group cursor-default">
      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shrink-0">
        <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <div className="flex items-center gap-1.5">
          <p className="font-bold text-slate-900 leading-tight truncate">
            {value}
          </p>
          {isLink && (
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
          )}
        </div>
      </div>
    </div>
  );

  return isLink && href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-80 transition-opacity"
    >
      {content}
    </a>
  ) : (
    content
  );
}

function LoadingState({ message }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-6" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
        {message}
      </p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-10 h-10 text-slate-200" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
          VOD LOG ERROR
        </h2>
        <p className="text-slate-500 mb-10 text-sm leading-relaxed font-medium italic">
          The requested vendor profile is either currently offline or has been
          removed from the registry.
        </p>
        <button
          onClick={() => window.history.back()}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          Return to Marketplace
        </button>
      </div>
    </div>
  );
}

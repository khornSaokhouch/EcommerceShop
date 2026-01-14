"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useShoppingCartStore } from "../../../stores/useShoppingCart";
import { useUserStore } from "../../../stores/userStore";
import { toast } from "react-hot-toast";

export default function FavouriteItemRow({ favourite, onRemove }) {
  const { product } = favourite;
  const userId = useUserStore((state) => state.user?.id);
  const { createCart } = useShoppingCartStore();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!userId || !product?.id) return;

    await toast.promise(
      createCart({ user_id: userId, items: [{ product_item_id: product.id, qty: 1 }] }),
      {
        loading: "Initializing cart unit...",
        success: `Added to cart!`,
        error: "Failed to add.",
      }
    );
  };
  
  return (
    <div className="group relative flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-[28px] border border-slate-100 hover:border-blue-100 transition-all hover:shadow-xl hover:shadow-blue-500/5">
      {/* Product Image */}
      <Link href={`/details/${product.id}`} className="shrink-0 relative">
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 p-2">
           <div className="relative w-full h-full rounded-xl overflow-hidden bg-white">
            <Image
                src={product?.product_image_url || "/placeholder.svg"}
                alt={product?.name || "Product"}
                fill
                className="object-contain p-1 group-hover:scale-110 transition-transform duration-500"
            />
           </div>
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <div className="flex flex-col">
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">
                {product.category_name || "Hardware"}
            </span>
            <Link href={`/details/${product.id}`}>
                <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate uppercase tracking-tight">
                    {product.name || "Unknown Unit"}
                </h3>
            </Link>
            <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-1">
                {product.description}
            </p>
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-4">
                <span className="text-lg font-black text-slate-900 tracking-tighter">${product.price?.toFixed(0)}</span>
                <div className="h-1 w-1 rounded-full bg-slate-200 hidden sm:block" />
                <Link href={`/details/${product.id}`} className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center gap-1 transition-colors">
                    Specs <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
        <button
          onClick={handleAddToCart}
          className="flex-1 sm:w-36 flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-100"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
        <button
          onClick={onRemove}
          className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 border border-transparent hover:border-red-100 transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
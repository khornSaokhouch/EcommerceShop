"use client"
import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useProductStore } from "../../stores/useProductStore"
import { useFavouritesStore } from "../../stores/useFavouritesStore"
import ProductCard from "./ProductCard"
import { Loader2, Package, LayoutGrid, Filter } from "lucide-react"
import { motion } from "framer-motion"

export default function Products() {
  const { id } = useParams()
  const { products, loading, error, fetchAllProducts } = useProductStore()
  const { favourites, addFavourite, fetchFavourites } = useFavouritesStore()

  useEffect(() => {
    fetchAllProducts()
    fetchFavourites(id)
  }, [fetchAllProducts, fetchFavourites, id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 relative z-10" />
        </div>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Inventory...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-20">
        <div className="bg-white border border-red-100 rounded-[2rem] p-8 text-center shadow-xl shadow-red-900/5">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">System Error</h3>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm">Retry Connection</button>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20">
        <div className="bg-white border border-slate-100 rounded-[2rem] p-10 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <LayoutGrid className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">No Products</h3>
          <p className="text-slate-500">The hardware vault is currently empty. Check back shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider mb-3">
             <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse" />
             Live Marketplace
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Explore <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Hardware</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-blue-500 transition-all">
                <Filter className="w-4 h-4" /> Filter
            </button>
            <div className="text-xs font-bold text-slate-400 bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200">
                TOTAL: {products.length} UNITS
            </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {products.map((product) => {
          const isFavourite = favourites?.some((fav) => fav?.product_id === product.id)
          return (
            <ProductCard
              key={product.id}
              product={product}
              userId={id}
              isFavourite={isFavourite}
              onAddFavourite={(productId) => addFavourite({ user_id: id, product_id: productId })}
            />
          )
        })}
      </motion.div>
    </div>
  )
}
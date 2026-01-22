"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useProductStore } from "../../../stores/useProductStore"
import {
  ArrowLeft,
  Package,
  Search,
  LayoutGrid,
  List,
  Eye,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Loader2,
  Cpu,
  ChevronRight,
  ShieldCheck,
  ChevronLeft
} from "lucide-react"
import Image from "next/image"
import ProductCard from "../../../components/user/ProductCard" // Using the stylized card we built

export default function ProductsByCategoryPage() {
  const { categoryId } = useParams()
  const router = useRouter()
  const { products, loading, error, fetchProductsByCategory, fetchCategoryById } = useProductStore()
  
  const [categoryName, setCategoryName] = useState("Initializing...")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (categoryId) {
      fetchProductsByCategory(categoryId)
      fetchCategoryById(categoryId).then((cat) => setCategoryName(cat?.name || "Hardware Node"))
    }
  }, [categoryId, fetchProductsByCategory, fetchCategoryById])

  // Process data: Search + Pagination
  const filteredProducts = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return products.filter(p => 
        p.name?.toLowerCase().includes(lower) || 
        p.description?.toLowerCase().includes(lower)
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Decrypting Category Registry...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Sourcing Hub</span>
                <ChevronRight size={12} className="text-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{categoryName}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Hardware Inventory</h1>
          </div>
        </div>
        
        <button className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
                <Plus size={16} /> Deploy New Unit
            </span>
        </button>
      </div>

      {/* 2. Compact Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatMiniCard label="Active Nodes" value={filteredProducts.length} icon={Package} color="blue" />
          <StatMiniCard label="Registry Status" value="Online" icon={ShieldCheck} color="emerald" />
          <StatMiniCard label="Inventory Value" value={`$${filteredProducts.reduce((s, p) => s + (p.price || 0), 0).toFixed(0)}`} icon={DollarSign} color="cyan" />
          <StatMiniCard label="Avg. Valuation" value={`$${(filteredProducts.reduce((s, p) => s + (p.price || 0), 0) / filteredProducts.length || 0).toFixed(0)}`} icon={TrendingUp} color="blue" />
      </div>

      {/* 3. Search & View Controls */}
      <div className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search unit name or SKU..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
           <ViewToggle icon={LayoutGrid} active={viewMode === 'grid'} onClick={() => setViewMode('grid')} />
           <ViewToggle icon={List} active={viewMode === 'table'} onClick={() => setViewMode('table')} />
        </div>
      </div>

      {/* 4. Content Area */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div 
                key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"># ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hardware Unit</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedProducts.map((product, idx) => (
                    <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-5 text-xs font-black text-slate-300">
                        {String((currentPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-inner shrink-0">
                            <img src={product.product_image_url || "/placeholder.svg"} className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight truncate">{product.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-slate-900 tracking-tighter">${product.price}</td>
                      <td className="px-8 py-5">
                         <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg border border-emerald-100">Live Node</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                           <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-blue-100"><Edit size={16} /></button>
                           <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-blue-100"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination Footer */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Page {currentPage} / {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronLeft size={16}/></button>
            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- SUB COMPONENTS ---

function StatMiniCard({ label, value, icon: Icon, color }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        cyan: "text-cyan-600 bg-cyan-50 border-cyan-100"
    };
    return (
        <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${colors[color]}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <h4 className="text-xl font-black text-slate-900 tracking-tighter leading-none mt-0.5">{value}</h4>
            </div>
        </div>
    );
}

function ViewToggle({ icon: Icon, active, onClick }) {
    return (
        <button onClick={onClick} className={`p-2 rounded-xl transition-all ${active ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
            <Icon size={18} />
        </button>
    )
}
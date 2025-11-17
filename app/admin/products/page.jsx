"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { useStore } from "../../stores/useStore";
import { useAuthStore } from "../../stores/authStore";

import Image from "next/image";
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Edit,
  Trash2,
  Package,
  Loader2,
  AlertTriangle,
  Store,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const PAGE_SIZE = 12;

// --- Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, loading }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="p-8 text-center">
            <div className="flex items-center justify-center mx-auto h-16 w-16 rounded-full bg-red-100 border-4 border-red-300">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900">{title}</h3>
            <p className="mt-2 text-md text-gray-600">{children}</p>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-2xl border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors flex items-center gap-2 disabled:bg-red-400"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {loading ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- Product Row ---
const ProductRow = ({ product, getCategoryName, getStoreName, onEdit, onDelete, index }) => {
  const quantity = product?.product_items?.[0]?.quantity_in_stock || 0;

  const getStockStatus = (q) => {
    if (q > 10) return { text: "In Stock", color: "bg-green-100 text-green-700" };
    if (q > 0) return { text: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
    return { text: "Out of Stock", color: "bg-red-100 text-red-700" };
  };

  const { text, color } = getStockStatus(quantity);

  return (
    <tr className="border-b border-gray-100 hover:bg-indigo-50/50 transition duration-150">
      <td className="px-6 py-4 text-sm text-gray-500 font-mono w-[5%]">{index}</td>
      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap w-[30%]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
            {product.product_image_url || product.product_image ? (
              <Image
                src={product.product_image_url || product.product_image || "/placeholder.jpg"}
                alt={product.name}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <Package className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <span>{product.name}</span>
            <p className="text-xs text-gray-500 font-mono">ID: {product.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-600 w-[15%]">{getCategoryName(product.category_id)}</td>
      <td className="px-6 py-4 text-gray-600 w-[15%]">{getStoreName(product.store_id)}</td>
      <td className="px-6 py-4 font-mono text-gray-700 w-[10%]">${Number(product.price).toFixed(2)}</td>
      <td className="px-6 py-4 w-[15%]">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
          {text} ({quantity})
        </span>
      </td>
      <td className="px-6 py-4 text-right space-x-1.5 w-[10%]">
        <button
          onClick={() => onEdit(product)}
          className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition"
          aria-label="Edit product"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(product)}
          className="p-2 rounded-full text-red-600 hover:bg-red-100 transition"
          aria-label="Delete product"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

// --- Main Page ---
export default function ProductsPage() {
  const { products, loading, error, fetchAllProducts, deleteProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { stores, fetchStores } = useStore();
  const token = useAuthStore((state) => state.token);

  const [initLoading, setInitLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStore, setFilterStore] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProductList, setFilteredProductList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    async function loadData() {
      await Promise.all([fetchAllProducts(), fetchCategories(), fetchStores()]);
      setInitLoading(false);
    }
    loadData();
  }, [token, fetchAllProducts, fetchCategories, fetchStores]);

  useEffect(() => {
    const list = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || product.category_id === Number(filterCategory);
      const matchesStore = filterStore === "all" || product.store_id === Number(filterStore);
      return matchesSearch && matchesCategory && matchesStore;
    });

    setFilteredProductList(list);
    setCurrentPage(1);
  }, [products, searchTerm, filterCategory, filterStore]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const displayedProducts = filteredProductList.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProductList.length / PAGE_SIZE);

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || "N/A";
  const getStoreName = (id) => stores.find((s) => s.id === id)?.name || "N/A";

  const handleEdit = (product) => toast(`Open edit modal for ${product.name}`);
  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setActionLoading(true);
    try {
      await deleteProduct(productToDelete.id); // admin/owner token used internally
      toast.success(`Deleted ${productToDelete.name}`);
      setIsDeleteModalOpen(false);
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setActionLoading(false);
      setProductToDelete(null);
    }
  };

  if (initLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="ml-3 text-indigo-600 font-medium">Loading catalog data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 bg-red-50 text-red-700 border border-red-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 inline mr-2" />
        <span className="font-semibold">Error fetching products:</span> {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
              <p className="text-gray-600 text-md">View all products with filtering and pagination.</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:border-indigo-500 transition shadow-sm"
              />
            </div>

            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:border-indigo-500 transition shadow-sm appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              <select
                value={filterStore}
                onChange={(e) => setFilterStore(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:border-indigo-500 transition shadow-sm appearance-none"
              >
                <option value="all">All Stores</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[5%]">#</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[30%]">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[15%]">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[15%]">Store</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[15%]">Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-700">No products found</h3>
                      <p className="text-sm">Try adjusting your filters or search terms.</p>
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((product, index) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      index={startIndex + index + 1}
                      getCategoryName={getCategoryName}
                      getStoreName={getStoreName}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1}–{Math.min(endIndex, filteredProductList.length)} of {filteredProductList.length} products
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </button>
              <span className="self-center text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Product Deletion"
        loading={actionLoading}
      >
        You are about to permanently delete <strong>"{productToDelete?.name}"</strong>. This action cannot be undone.
      </ConfirmationModal>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { useUserStore } from "../../stores/userStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Package, Search, AlertTriangle, Loader2 } from "lucide-react";
import AddEditProductForm from "../../components/company/Product/AddEditProductForm";

// --- CONFIRMATION MODAL ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, loading }) => {
  if (!isOpen) return null;

  return (
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
            Confirm Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- SKELETON ROW ---
const ProductRowSkeleton = () => (
  <tr className="border-b border-gray-100 animate-pulse">
    <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div className="space-y-1">
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-4 w-1/2 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-4 w-1/4 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-4 w-1/4 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-4 w-full bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4 text-right space-x-2">
      <div className="flex justify-end space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
    </td>
  </tr>
);

// --- MAIN COMPONENT ---
export default function ProductManagement() {
  const { products, fetchProducts, createProduct, updateProduct, deleteProduct, loading, error } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { user } = useUserStore();
  const currentUserId = user?.id;

  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const userProducts = products.filter((p) => p.user_id === currentUserId);

  const filteredProducts = userProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category_id === Number(filterCategory);
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "N/A";
  };

  const getStockStatus = (quantity) => {
    if (quantity > 10) return { text: "In Stock", color: "bg-green-100 text-green-700" };
    if (quantity > 0) return { text: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
    return { text: "Out of Stock", color: "bg-red-100 text-red-700" };
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsCreating(false);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setActionLoading(true);
    try {
      await deleteProduct(productToDelete.id);
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setActionLoading(false);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData);
        toast.success("Product created successfully");
      }
      setEditingProduct(null);
      setIsCreating(false);
    } catch (e) {
      console.error(e);
      toast.error("Error saving product");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsCreating(false);
  };

  const ProductRow = ({ product, index }) => {
    const quantity = product?.product_items?.[0]?.quantity_in_stock || 0;
    const { text, color } = getStockStatus(quantity);

    return (
      <tr className="border-b border-gray-100 hover:bg-indigo-50/50 transition duration-150">
        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{index + 1}</td>
        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
              {product.product_image_url ? (
                <img src={product.product_image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <span>{product.name}</span>
              {/* <p className="text-xs text-gray-500 font-mono">ID: {product.id}</p> */}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-gray-600">{getCategoryName(product.category_id)}</td>
        <td className="px-6 py-4 font-mono text-gray-700">
  {product.price != null ? `$${Number(product.price).toFixed(2)}` : "—"}
</td>

        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
            {text} ({quantity})
          </span>
        </td>
        <td className="px-6 py-4 text-gray-500 text-sm truncate">{product.description || "—"}</td>
        <td className="px-6 py-4 text-right space-x-1.5">
          <button onClick={() => handleEdit(product)} className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition">
            <Edit className="w-5 h-5" />
          </button>
          <button onClick={() => handleDeleteClick(product)} className="p-2 rounded-full text-red-600 hover:bg-red-100 transition">
            <Trash2 className="w-5 h-5" />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto p-6 sm:p-10">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
            <p className="text-gray-600 text-md">Manage your inventory, prices, and product details.</p>
          </div>
          <button
            onClick={() => { setIsCreating(true); setEditingProduct(null); }}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold transition-colors flex items-center shadow-md"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add New Product
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:border-indigo-500 transition shadow-sm"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:border-indigo-500 transition shadow-sm w-48"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  [...Array(5)].map((_, i) => <ProductRowSkeleton key={i} />)
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center bg-red-50 text-red-700 text-sm">
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      Failed to load products: {error}
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-700">No products found</h3>
                      <p className="text-sm">{searchTerm || filterCategory !== "all" ? "Try adjusting your search or filter settings." : "Click 'Add New Product' to begin managing your inventory."}</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, index) => <ProductRow key={product.id} product={product} index={index} />)
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence mode="wait">
          {(editingProduct || isCreating) && (
            <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AddEditProductForm product={editingProduct} onSave={handleSave} onCancel={handleCancel} />
            </motion.div>
          )}

          <ConfirmationModal
            key="confirm-modal"
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Confirm Deletion"
            loading={actionLoading}
          >
            This action will permanently delete the product "{productToDelete?.name}" and all associated data. This cannot be undone.
          </ConfirmationModal>
        </AnimatePresence>
      </div>
    </div>
  );
}

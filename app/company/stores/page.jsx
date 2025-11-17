"use client";

import React, { useState, useEffect } from "react";
// NOTE: Ensure these paths are correct relative to where this file lives
import { useStore } from "../../stores/useStore"; 
import { useAuthStore } from "../../stores/authStore"; 

import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash2, Plus, X, AlertTriangle, Store, Loader2, Info } from "lucide-react";
import toast from "react-hot-toast";

// --- 1. MODAL COMPONENTS ---

// StoreModal for Add/Edit
const StoreModal = ({ isOpen, onClose, onSave, store, loading }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) setName(store ? store.name : "");
  }, [isOpen, store]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onSave({ name });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-center items-center p-4  "
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100"
        >
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {store ? "Edit Store Details" : "Create New Store"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base shadow-sm
                           focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-gray-50"
                placeholder="e.g., Main Retail Location"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
              <p className="mt-2 text-xs text-gray-500">
                This name will be used across your product listings and invoices.
              </p>
            </div>
            <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 transition"
                disabled={loading || !name.trim()}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {store ? "Update Store" : "Create Store"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ConfirmationModal for Delete
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, loading }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-center items-center p-4 "
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center mt-1">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <div className="text-sm text-gray-600 mt-2">{children}</div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 disabled:bg-red-400 transition"
              disabled={loading}
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {loading ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


// --- 2. STORE CARD COMPONENT ---

const StoreCard = ({ store, onEdit, onDelete }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex justify-between items-start transition duration-300 hover:shadow-lg hover:border-indigo-300">
    <div className="flex items-start gap-4">
      <div className="p-3 bg-indigo-100 rounded-full flex-shrink-0">
        <Store className="w-5 h-5 text-indigo-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{store.name}</h3>
        <p className="text-xs text-gray-500">ID: <span className="font-mono">{store.id}</span></p>
        <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p>Created: {new Date(store.created_at).toLocaleDateString()}</p>
            <p>Last Updated: {new Date(store.updated_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
    
    <div className="flex space-x-2 flex-shrink-0 pt-1">
      <button
        onClick={() => onEdit(store)}
        className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition"
        aria-label="Edit store"
      >
        <Pencil className="w-5 h-5" />
      </button>
      <button
        onClick={() => onDelete(store)}
        className="p-2 rounded-full text-red-600 hover:bg-red-50 transition"
        aria-label="Delete store"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  </div>
);


// --- 3. MAIN MANAGER COMPONENT ---

export default function StoreManager() {
  const authUser = useAuthStore((state) => state.user);
  const userId = authUser?.id;

  const {
    stores,
    fetchStoresByUserId,
    createStore,
    updateStore,
    deleteStore,
    loading: storeLoading,
    error,
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const hasStore = stores.length > 0;
  const canAddStore = stores.length === 0;

  useEffect(() => {
    if (userId) fetchStoresByUserId(userId);
  }, [fetchStoresByUserId, userId]);

  const handleAdd = () => {
    if (!canAddStore) return;
    setSelectedStore(null);
    setIsModalOpen(true);
  };

  const handleEdit = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const handleDelete = (store) => {
    setSelectedStore(store);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (formData) => {
    const { user, token } = useAuthStore.getState();
    if (!user) {
      toast.error("Authentication failed.");
      return;
    }
  
    setActionLoading(true);
    try {
      const payload = { ...formData, user_id: user.id };
      if (selectedStore) {
        await updateStore(selectedStore.id, payload, token);
        toast.success("Store updated successfully!");
      } else {
        // Enforce single store rule
        if (hasStore) throw new Error("A store already exists for this account.");
        
        await createStore(payload, token);
        toast.success("Store created successfully!");
      }
      setIsModalOpen(false);
      setSelectedStore(null);
      await fetchStoresByUserId(user.id, token);
    } catch (err) {
      console.error(err);
      // Ensure specific message if needed
      toast.error(err.message || "Failed to save store.");
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedStore) return;
    setActionLoading(true);
    try {
      const { token } = useAuthStore.getState();
      await deleteStore(selectedStore.id, token);
      toast.success("Store deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedStore(null);
      if (userId) await fetchStoresByUserId(userId);
    } catch {
      toast.error("Failed to delete store.");
    } finally {
      setActionLoading(false);
    }
  };


  // --- Render Logic ---

  // Custom checks for rendering state
  const showEmptyState = !storeLoading && stores.length === 0;
  
  // Only show the critical error if data was fetched successfully but subsequent fetches failed,
  // OR if we have data and an error occurs. 
  // We suppress the error if stores.length === 0, relying on the empty state.
  const showCriticalError = error && stores.length > 0;
  
  return (
    <div className="min-h-screen  p-6 sm:p-10">
        <div className="max-w-full mx-auto">
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Management</h1>
            
            {/* Header and Action Button */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                <p className="text-gray-600">
                    Manage your primary operational store.
                </p>
                <button
                    onClick={handleAdd}
                    disabled={hasStore}
                    className={`flex items-center gap-2 px-5 py-2 font-semibold rounded-full text-sm transition-colors ${
                        canAddStore
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    <Plus className="w-4 h-4" />
                    Add Store
                </button>
            </div>
            
            {/* Single Store Warning Banner */}
            {hasStore && (
                <div className="flex items-start p-4 mb-6 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800">
                    <Info className="w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-sm">
                        <span className="font-bold">Account Restriction:</span> This account is limited to managing only one store ID at a time. To create a new store, you must first delete the existing one.
                    </p>
                </div>
            )}

            {/* Critical Error Display */}
            {showCriticalError && 
                <p className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 mb-6">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    A critical error occurred while fetching your stores: {error}
                </p>
            }

            {/* Store Listing Area */}
            <div className="space-y-6">
                
                {/* Loading Skeleton */}
                {storeLoading && (
                    <>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-28 animate-pulse"></div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-28 animate-pulse"></div>
                    </>
                )}

                {/* Empty State / No Store Found */}
                {showEmptyState && (
                    <div className="bg-white p-10 text-center rounded-xl shadow-md border border-gray-100">
                        <Store className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
                        <p className="text-lg text-gray-600">
                            No store found for this account. Click "Add Store" above to set up your primary operational location.
                        </p>
                    </div>
                )}

                {/* Display Stores */}
                {!storeLoading && stores.map((store) => (
                    <StoreCard 
                        key={store.id} 
                        store={store} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                    />
                ))}
            </div>

            {/* Modals */}
            <StoreModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedStore(null); }}
                onSave={handleSave}
                store={selectedStore}
                loading={actionLoading}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSelectedStore(null); }}
                onConfirm={handleConfirmDelete}
                title="Permanently Delete Store"
                loading={actionLoading}
            >
                Are you absolutely sure you want to delete store &quot;{selectedStore?.name}&quot;? 
                All associated data will be lost.
            </ConfirmationModal>
        </div>
    </div>
  );
}
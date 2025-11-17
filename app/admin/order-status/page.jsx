"use client";

import React, { useEffect, useState, Fragment } from 'react';
import { useOrderStatusStore } from "../../stores/useOrderStatus";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Edit, Trash2, X, AlertTriangle, ListChecks, CheckCircle, Loader2 } from 'lucide-react';

// --- Reusable Modal Component (Styled for modern feel) ---
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return <Fragment />;
  }

  return (
    // Backdrop with blur
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        // Modal container styling
        className="relative w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button inside modal content */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 transition"
        >
            <X className="w-5 h-5" />
        </button>
        
        <div className="pt-4 pb-2">
            {children}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function OrderStatusManager() {
  const {
    orderStatuses,
    fetchOrderStatuses,
    createOrderStatus,
    updateOrderStatus,
    deleteOrderStatus,
    loading,
    error,
  } = useOrderStatusStore();

  const [modalState, setModalState] = useState({ type: null, data: null });
  const [inputValue, setInputValue] = useState('');
  const [actionLoading, setActionLoading] = useState(false); // Separate loading state for modal actions

  useEffect(() => {
    fetchOrderStatuses();
  }, [fetchOrderStatuses]);

  const openModal = (type, data = null) => {
    setModalState({ type, data });
    if (type === 'edit' && data) {
      setInputValue(data.status);
    } else {
      setInputValue('');
    }
    setActionLoading(false); // Reset action loading
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
    setInputValue('');
    setActionLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (actionLoading) return;
    if (!inputValue.trim()) {
      return toast.error('Status name is required.');
    }

    setActionLoading(true);
    const toastId = toast.loading(modalState.type === 'add' ? 'Creating Status...' : 'Updating Status...');
    const payload = { status: inputValue.trim() };
    let success = false;
    
    try {
      if (modalState.type === 'add') {
        success = await createOrderStatus(payload);
      } else if (modalState.type === 'edit') {
        success = await updateOrderStatus(modalState.data.id, payload);
      }
      
      if (success) {
        toast.success(`Order status ${modalState.type === 'add' ? 'created' : 'updated'} successfully!`, { id: toastId });
        closeModal();
      } else {
        // Assume failure if result is falsy, error set by store
        toast.error('Operation failed. Check permissions.', { id: toastId });
      }
    } catch (err) {
      toast.error('An unexpected error occurred.', { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (actionLoading) return;
    if (modalState.type === 'delete' && modalState.data) {
      setActionLoading(true);
      const toastId = toast.loading('Deleting Status...');
      
      try {
        const success = await deleteOrderStatus(modalState.data.id);
        
        if (success) {
          toast.success('Status deleted successfully!', { id: toastId });
          closeModal();
        } else {
          toast.error('Failed to delete status.', { id: toastId });
        }
      } catch (err) {
        toast.error('An unexpected error occurred.', { id: toastId });
      } finally {
        setActionLoading(false);
      }
    }
  };
  
  // Tailwind Classes for consistency
  const baseButton = "px-5 py-2 rounded-full font-semibold text-sm shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const primaryButton = `${baseButton} bg-indigo-600 text-white hover:bg-indigo-700`;
  const secondaryButton = `${baseButton} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`;
  const destructiveButton = `${baseButton} bg-red-600 text-white hover:bg-red-700`;
  const iconButton = "p-2 rounded-full transition-colors duration-200";


  return (
    <>
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto my-10 p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
              <ListChecks className="w-8 h-8 text-indigo-600"/>
              <h2 className="text-3xl font-bold text-gray-900">Order Status Management</h2>
          </div>
          <button 
            className={primaryButton}
            onClick={() => openModal('add')}
            disabled={loading}
          >
            <Plus className="w-4 h-4" />
            Add New Status
          </button>
        </div>

        {/* Global Error Message from Store */}
        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            <strong>Error fetching data:</strong> {error}
          </div>
        )}

        {/* List */}
        {loading && orderStatuses.length === 0 ? (
          <div className="text-center text-indigo-600 py-10 flex justify-center items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading Order Statuses...
          </div>
        ) : orderStatuses.length === 0 && !loading ? (
           <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg border border-gray-100">
             <ListChecks className="w-10 h-10 mx-auto text-gray-300 mb-3" />
             <p className="text-lg font-medium text-gray-700">No statuses defined yet.</p>
             <p className="text-sm">Use the 'Add New Status' button to define your order workflow.</p>
           </div>
        ) : (
          <div className="space-y-4">
          {orderStatuses.map((os, index) => (
            <div key={os.id} className="flex justify-between items-center p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-xl transition-all hover:shadow-md">
              
              {/* Index + ID + Status */}
              <span className="text-xl font-medium text-gray-800 flex items-center gap-4">
                <span className="font-mono text-sm text-gray-500">{index + 1}</span> {/* Serial Number */}
                {/* <span className="font-mono text-sm text-gray-400 hidden sm:inline">ID: {os.id}</span> Product ID */}
                <span className="text-indigo-600 text-lg font-bold">●</span> 
                {os.status}
              </span>
              
              {/* Action Buttons */}
              <div className="flex gap-1">
                <button 
                  className={`${iconButton} text-indigo-600 hover:bg-indigo-100`}
                  onClick={() => openModal('edit', os)} 
                  disabled={loading || actionLoading}
                  title="Edit Status"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  className={`${iconButton} text-red-600 hover:bg-red-100`}
                  onClick={() => openModal('delete', os)} 
                  disabled={loading || actionLoading}
                  title="Delete Status"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        )}
      </div>

      {/* --- MODALS --- */}
      {/* Add/Edit Modal */}
      <Modal isOpen={modalState.type === 'add' || modalState.type === 'edit'} onClose={closeModal}>
        <form onSubmit={handleFormSubmit}>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {modalState.type === 'add' ? 'Define New Order Status' : 'Edit Order Status'}
          </h3>
          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status Name
            </label>
            <input
              id="status"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="e.g., Pending, Shipped, Delivered"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
              disabled={actionLoading}
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button type="button" className={secondaryButton} onClick={closeModal} disabled={actionLoading}>
              Cancel
            </button>
            <button type="submit" className={primaryButton} disabled={actionLoading || !inputValue.trim()}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {actionLoading ? 'Saving...' : 'Save Status'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={modalState.type === 'delete'} onClose={closeModal}>
        <div className="flex items-start gap-4">
            <div className="mt-1 w-10 h-10 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                <p className="text-gray-600 text-sm">
                Are you sure you want to permanently delete the order status: <strong className="font-medium text-gray-800">"{modalState.data?.status}"</strong>? This action cannot be undone and may affect existing orders.
                </p>
            </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6 pt-3 border-t border-gray-100">
          <button type="button" className={secondaryButton} onClick={closeModal} disabled={actionLoading}>
            Cancel
          </button>
          <button 
            type="button" 
            className={destructiveButton} 
            onClick={handleDeleteConfirm}
            disabled={actionLoading}
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {actionLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </>
  );
}
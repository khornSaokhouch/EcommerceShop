"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useShopOrderStore } from "../../stores/useShopOrder";
import { useOrderStatusStore } from "../../stores/useOrderStatus";
import { useUserStore } from "../../stores/userStore";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

import ConfirmationModal from "../../components/company/order/ConfirmationModal";
import EditOrderModal from "../../components/company/order/EditOrderModal";
import TelegramLoginPopup from "../../components/company/TelegramLoginPopup";

const getStatusColor = (statusName) => {
  const name = statusName?.toLowerCase() || '';
  if (name.includes("completed") || name.includes("delivered")) return "bg-green-100 text-green-800";
  if (name.includes("pending")) return "bg-yellow-100 text-yellow-800";
  if (name.includes("cancelled") || name.includes("refunded")) return "bg-red-100 text-red-800";
  if (name.includes("processing") || name.includes("shipped")) return "bg-blue-100 text-blue-800";
  return "bg-slate-100 text-slate-800";
};

export default function CompanyOrdersPage() {
  const { id: companyId } = useParams();

  const { orders, fetchOrders, loading: ordersLoading, deleteOrder } = useShopOrderStore();
  const { orderStatuses, fetchOrderStatuses, updateShopOrderStatus, loading: statusesLoading } =
    useOrderStatusStore();

  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const loadingUser = useUserStore((state) => state.loading);

  const [showTelegramPopup, setShowTelegramPopup] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Polling interval in ms
  const POLL_INTERVAL = 3000;

  useEffect(() => {
    // Fetch user info initially
    if (!user) {
      fetchUser();
      return;
    }

    // Polling to check telegram_id
    const interval = setInterval(async () => {
      await fetchUser();
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [user, fetchUser]);

  useEffect(() => {
    if (!user) return;

    if (!user.telegram_id) {
      setShowTelegramPopup(true);
      return;
    }

    // Telegram connected → fetch orders
    setShowTelegramPopup(false);
    if (companyId) {
      fetchOrders(companyId);
      fetchOrderStatuses();
    }
  }, [user, companyId, fetchOrders, fetchOrderStatuses]);

  if (loadingUser || ordersLoading || statusesLoading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (showTelegramPopup) {
    return <TelegramLoginPopup />;
  }

  // Edit + Delete Handlers
  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleSaveStatus = async (orderId, newStatusId) => {
    setActionLoading(true);
    try {
      await updateShopOrderStatus(orderId, newStatusId);
      await fetchOrders(companyId);
      toast.success("Order status updated!");
      setIsEditModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setActionLoading(true);
    try {
      await deleteOrder(selectedOrder.id);
      await fetchOrders(companyId);
      toast.success("Order deleted!");
      setIsDeleteModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{i + 1}</td>
                  <td className="px-6 py-4">#{order.id}</td>
                  <td className="px-6 py-4">{order.user?.name || "N/A"}</td>
                  <td className="px-6 py-4">{new Date(order.order_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">${order.order_total?.toFixed(2) ?? "0.00"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.order_status?.status)}`}>
                      {order.order_status?.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => handleEditClick(order)}
                      className="p-2 text-indigo-600 hover:bg-slate-100 rounded-md"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(order)}
                      className="p-2 text-red-600 hover:bg-slate-100 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <EditOrderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        order={selectedOrder}
        statuses={orderStatuses}
        onSave={handleSaveStatus}
        loading={actionLoading}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        confirmText="Yes, Delete"
      >
        Are you sure you want to delete order #{selectedOrder?.id}?
      </ConfirmationModal>
    </>
  );
}

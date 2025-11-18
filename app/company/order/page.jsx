'use client';

import { useEffect, useState } from 'react';
import { Loader2, Package } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useShopOrderStore } from '../../stores/useShopOrder';
import TelegramLoginPopup from '../../components/company/TelegramLoginPopup';
import Link from 'next/link';

export default function OrdersPage() {
  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const loadingUser = useUserStore((state) => state.loading);

  const orders = useShopOrderStore((state) => state.orders);
  const fetchOrders = useShopOrderStore((state) => state.fetchOrders);
  const loadingOrders = useShopOrderStore((state) => state.loading);

  const [showTelegramPopup, setShowTelegramPopup] = useState(false);

  useEffect(() => {
    if (!user) {
      fetchUser();
      return;
    }

    // Fetch orders only if user exists
    fetchOrders(user.id);

    // Show Telegram popup if not logged in
    if (!user.telegram_id) {
      setShowTelegramPopup(true);
    }
  }, [user, fetchUser, fetchOrders]);

  // Show loader while fetching
  if (loadingUser || loadingOrders) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 space-y-8 bg-gray-50">
      {/* Telegram login popup */}
      {showTelegramPopup && <TelegramLoginPopup />}

      {!showTelegramPopup && (
        <>
          <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>

          {orders?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <Package className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-gray-500 text-sm">Order #{order.id}</p>
                  <p className="text-gray-800 font-semibold mt-1">Status: {order.status}</p>
                  <p className="text-gray-500 text-sm mt-1">Items: {order.items_count}</p>
                  <Link
                    href={`/orders/${order.id}`}
                    className="mt-3 inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-20">
              <p>No orders found.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

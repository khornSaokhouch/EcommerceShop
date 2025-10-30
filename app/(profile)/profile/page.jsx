'use client';

import { useEffect } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Package, Heart, Shield } from 'lucide-react';

export default function MyProfilePage() {
  const { id } = useParams();
  const { user, loading, error, fetchUserById } = useUserStore();

  useEffect(() => {
    if (id) fetchUserById(id);
  }, [id, fetchUserById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-500" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-red-500 text-center font-semibold">
            Could not load profile information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 mt-1">{user.email}</p>
          {user.phone_number && (
            <p className="text-gray-500 mt-1">{user.phone_number}</p>
          )}
        </div>
        <Link
          href="/edit-profile"
          className="px-6 py-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-md"
        >
          Edit Profile
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow flex flex-col items-center justify-center">
          <Package className="w-8 h-8 text-indigo-500 mb-2" />
          <p className="text-gray-500 text-sm">Recent Orders</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">0</p>
          <Link
            href="/orders"
            className="mt-3 px-3 py-1 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            View Orders
          </Link>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow flex flex-col items-center justify-center">
          <Heart className="w-8 h-8 text-pink-500 mb-2" />
          <p className="text-gray-500 text-sm">Favorites</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">0</p>
          <Link
            href="/profile/favorites"
            className="mt-3 px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            View Favorites
          </Link>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow flex flex-col items-center justify-center">
          <Shield className="w-8 h-8 text-green-500 mb-2" />
          <p className="text-gray-500 text-sm">Security Settings</p>
          <Link
            href="/security"
            className="mt-3 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Update Security
          </Link>
        </div>
      </div>

      {/* Personal Info Card */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
          <div>
            <p className="font-semibold">Name:</p>
            <p>{user.name}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{user.email}</p>
          </div>
          {user.phone_number && (
            <div>
              <p className="font-semibold">Phone:</p>
              <p>{user.phone_number}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

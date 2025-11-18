'use client';

import { useEffect } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Package, Heart, Shield, Edit } from 'lucide-react';
import { useFavouritesStore } from '../../stores/useFavouritesStore';

export default function MyProfilePage() {
  const { id } = useParams();
  const { user, loading, error, fetchUserById } = useUserStore();
  const { favourites, fetchFavourites } = useFavouritesStore();


  useEffect(() => {
    if (user?.id) {
      fetchFavourites(user.id);
    }
  }, [user?.id, fetchFavourites]);


  

  if (loading) {
    return (
      // Updated Loading State: Centered spinner with primary accent color
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        {/* Updated Error Card Style */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <p className="text-red-600 text-center font-semibold">
            Could not load profile information. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 space-y-8 ">
      
      {/* Profile Header - Cleaned up and modern look */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 mt-1">{user.email}</p>
          {user.phone_number && (
            <p className="text-gray-500 mt-1">Phone: {user.phone_number}</p>
          )}
        </div>
        
        {/* Edit Profile Button - New Accent Style */}
        <Link
          href="/edit-profile"
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md text-sm"
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Quick Actions</h2>
        
        {/* Stats Cards - Refined shadows and consistent link styling */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Orders Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-center">
            <Package className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
                {user.orderCount || '0'} {/* Assuming a property like orderCount */}
            </p>
            <Link
              href="/orders"
              className="mt-3 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors border border-blue-200"
            >
              View Orders
            </Link>
          </div>
          
         {/* Favorites Card */}
<div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-center">
  <Heart className="w-8 h-8 text-pink-500 mb-2" />
  <p className="text-gray-500 text-sm">Favorite Items</p>
  <p className="text-2xl font-bold text-gray-900 mt-1">
      {favourites?.length || 0} {/* Use favourites length from store */}
  </p>
  <Link
    href="/favorites"
    className="mt-3 px-4 py-1.5 bg-pink-50 text-pink-600 rounded-lg text-sm font-semibold hover:bg-pink-100 transition-colors border border-pink-200"
  >
    View Favorites
  </Link>
</div>

          
          {/* Security Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-center">
            <Shield className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-gray-500 text-sm">Security Level</p>
            <p className="text-xl font-bold text-gray-900 mt-1 mb-1">High</p>
            <Link
              href="/security"
              className="mt-3 px-4 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors border border-green-200"
            >
              Update Security
            </Link>
          </div>
        </div>
      </div>

      {/* Personal Info Card - Cleaned up and structured data */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-3">
            Personal Information
        </h2>
        
        {/* Key-Value Display with enhanced readability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Name */}
            <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-lg font-medium text-gray-800">{user.name}</p>
            </div>
            
            {/* Email */}
            <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="text-lg font-medium text-gray-800">{user.email}</p>
            </div>
            
            {/* Phone Number */}
            {user.phone_number && (
                <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-lg font-medium text-gray-800">{user.phone_number}</p>
                </div>
            )}
            
            {/* Placeholder for Address/Location */}
            <div>
                <p className="text-sm font-medium text-gray-500">Primary Address</p>
                <p className="text-lg font-medium text-gray-800 ">
                    <Link href="/addresses" className="hover:underline">Manage Addresses</Link>
                </p>
            </div>

        </div>
      </div>
    </div>
  );
}
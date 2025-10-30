'use client';

import { useEffect } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useParams } from 'next/navigation';
import { Loader2, UserCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminProfilePage() {
  const { id } = useParams();
  const { user, loading, error, fetchUserById } = useUserStore();

  useEffect(() => {
    if (id) fetchUserById(id);
  }, [id, fetchUserById]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Loader2 className="animate-spin h-12 w-12 text-indigo-500" />
    </div>
  );

  if (error || !user) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <p className="text-red-500 text-center font-semibold">
          Could not load profile information.
        </p>
      </div>
    </div>
  );

  const userInitials = user.name
    ? user.name.split(' ').map(n => n[0]).join('')
    : 'U';

  const profileImageUrl = user.profile_image_url || null;

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gray-100 space-y-8">

      {/* Header Card */}
      <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 shadow-xl text-white flex flex-col md:flex-row items-center md:justify-between gap-6">
        <div className="flex items-center gap-6">
        <div className="relative h-28 w-28 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden">
  {profileImageUrl ? (
    <Image
      src={profileImageUrl}
      alt="Profile Image"
      fill
      sizes="112px"           // <-- size of the container (28 * 4)
      priority               // <-- ensures LCP optimization
      className="object-cover"
    />
  ) : (
    <span className="text-indigo-600 text-4xl font-bold">{userInitials}</span>
  )}
</div>

          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-sm opacity-90">{user.email}</p>
            {user.phone_number && <p className="text-sm opacity-90">{user.phone_number}</p>}
          </div>
        </div>
        <Link
          href={`/company/edit-profile`}
          className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:opacity-90 transition-opacity"
        >
          Edit Profile
        </Link>
      </div>

      {/* Personal Information */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="font-semibold text-gray-800">Full Name</p>
            <p className="mt-1">{user.name}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Email Address</p>
            <p className="mt-1">{user.email}</p>
          </div>
          {user.phone_number && (
            <div>
              <p className="font-semibold text-gray-800">Phone Number</p>
              <p className="mt-1">{user.phone_number}</p>
            </div>
          )}
          <div>
  <p className="font-semibold text-gray-800">Role</p>
  <p className="mt-1 flex items-center gap-1">
    <UserCheck className="w-5 h-5 text-indigo-500" /> 
    <span>{user.role}</span>
  </p>
</div>

        </div>
      </div>
    </div>
  );
}

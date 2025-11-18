// File: app/profile/[id]/layout.js
'use client';

import Navbar from '../components/Navbar';
import UserSidebar from '../components/UserSidebar';
import Footer from '../components/Footer'; // make sure you have a Footer component

export default function ProfileLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      
      {/* Navbar at the top */}
      <Navbar />

      {/* Main content area */}
      <div className="flex-1 max-w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          
          {/* Sidebar */}
          <UserSidebar />

          {/* Main content */}
          <main className="flex-1 w-full mt-8 lg:mt-0">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm min-h-[500px]">
              {children}
            </div>
          </main>

        </div>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}

// File: app/profile/[id]/layout.js
'use client';

import Navbar from '../components/Navbar';
import UserSidebar from '../components/UserSidebar';
import Footer from '../components/Footer';

export default function ProfileLayout({ children }) {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Fixed Navbar Handling */}
      <Navbar />

      {/* Main Content Area - pt-28 to account for fixed navbar */}
      <div className="flex-1 w-full max-w-7xl mx-auto pt-28 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Area */}
          <div className="lg:w-80 shrink-0">
            <UserSidebar />
          </div>

          {/* Main View Area */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm min-h-[600px] overflow-hidden">
              {children}
            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}
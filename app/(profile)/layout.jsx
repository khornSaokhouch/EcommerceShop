// ProfileLayout.js
'use client';

import Navbar from '../components/nabvar/Navbar';
import UserSidebar from '../components/UserSidebar';
import Footer from '../components/Footer';

export default function ProfileLayout({ children }) {
  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 w-full max-w-full pb-8 mx-auto pt-28 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Area */}
          <div className="lg:w-80 shrink-0">
            <UserSidebar />
          </div>

          {/* Main View Area - Liquid Glass Container */}
          <main className="flex-1 min-w-0">
            <div className="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] min-h-[600px] overflow-hidden">
              {children}
            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}
import './globals.css';
import ToastProvider from './components/ToastProvider';

export const metadata = {
  title: 'TECHNOCORE | Hardware Registry',
  description: 'High-performance hardware procurement and professional tech marketplace.',
};

export default function RootLayout({ children }) {
  return (
    // ✅ suppressHydrationWarning fix the "attributes mismatch" error caused by extensions
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased bg-white text-slate-900 min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        
        {/* --- SYSTEM AMBIENCE --- */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Pure Technical Glows */}
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px]" />
          
          {/* Subtle Registry Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
        </div>

        {/* Global Notifications Node */}
        <ToastProvider />

        {/* Core Application Content */}
        <main className="flex flex-col flex-grow relative z-0">
            {children}
        </main>
        
      </body>
    </html>
  );
}
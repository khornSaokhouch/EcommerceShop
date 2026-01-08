import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ToastProvider from './components/ToastProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'TechnoCore | Premium Tech Marketplace',
  description: 'High-performance gadgets and hardware',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col">
        {/* Apply font classes on a wrapper div */}
        <div className={`${geistSans.variable} ${geistMono.variable} data-gptw="" flex flex-col flex-grow`}>
          {/* Decorative Background Glow */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px]" />
            <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-50/50 blur-[120px]" />
          </div>

          {/* Client-only Toaster */}
          <ToastProvider />

          {/* Main content */}
          <main >{children}</main>
        </div>
      </body>
    </html>
  );
}

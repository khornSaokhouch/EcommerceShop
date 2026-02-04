import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ShieldCheck, LayoutGrid, ArrowRight, ShoppingBag } from 'lucide-react';
import { slugify } from './utils';

export default function NavLinks({ categories, brands, isScrolled }) {
  const linkClass = "px-3 py-2 text-[13px] font-medium text-slate-600 hover:text-blue-600 transition-all relative group";
  
  // Shared style for both Mega Menu containers
  const megaMenuClass = "absolute top-full left-1/2 -translate-x-1/2 w-[850px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-8 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 translate-y-2 group-hover/menu:translate-y-0 z-[120]";

  return (
    <nav className="hidden lg:flex items-center gap-2">
      <Link href="/" className={linkClass}>
        Home
        <span className="absolute bottom-1.5 left-3 right-3 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </Link>
      <Link href="/store" className={linkClass}>Shop</Link>

      {/* --- CATEGORIES MEGA MENU --- */}
      <div className="group/menu">
        <button className={linkClass + " flex items-center gap-1 outline-none"}>
          Categories <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover/menu:rotate-180 transition-transform" />
        </button>
        
        <div className={megaMenuClass}>
          <div className="grid grid-cols-4 gap-8">
            {/* Left Sidebar Info */}
            <div className="col-span-1 border-r border-slate-100 pr-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <LayoutGrid className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Browse Gear</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">Explore our curated registry of high-performance components and hardware units.</p>
              <Link href="/categories" className="inline-flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest mt-6 hover:gap-3 transition-all">
                All Categories <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Right Grid Content */}
            <div className="col-span-3 grid grid-cols-3 gap-4">
              {categories?.slice(0, 9).map(cat => (
                <Link key={cat.id} href={`/category/${slugify(cat.name)}`} className="group/item flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                  <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                    {cat.image_url ? (
                      <Image src={cat.image_url} alt={cat.name} fill className="object-cover group-hover/item:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover/item:text-blue-600 transition-colors">{cat.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">View Collection</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- BRANDS MEGA MENU --- */}
      <div className="group/menu">
        <button className={linkClass + " flex items-center gap-1 outline-none"}>
          Brands <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover/menu:rotate-180 transition-transform" />
        </button>
        
        <div className={megaMenuClass}>
          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-1 border-r border-slate-100 pr-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Official Partners</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">Direct procurement from industry-leading manufacturers for guaranteed reliability.</p>
              <Link href="/brands" className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest mt-6 hover:gap-3 transition-all">
                Registry Brands <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="col-span-3 grid grid-cols-3 gap-4">
              {brands?.slice(0, 9).map(brand => (
                <Link key={brand.id} href={`/brand/${slugify(brand.name)}`} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-all group/brand border border-transparent hover:border-slate-100">
                  <div className="w-12 h-8 relative grayscale group-hover/brand:grayscale-0 transition-all duration-300">
                    {brand.image_url ? (
                      <Image src={brand.image_url} alt={brand.name} fill className="object-contain" />
                    ) : (
                      <div className="text-[10px] font-black text-slate-300">{brand.name[0]}</div>
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover/brand:text-slate-900">{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Link href="/about-us" className={linkClass}>About Us</Link>
    </nav>
  );
}
"use client";

import React, { useEffect } from 'react';
import Navbar from './components/nabvar/Navbar';
import Footer from "./components/Footer";
import { ChevronRight, Cpu } from 'lucide-react';
import Link from 'next/link';
import { useCategoryStore } from './stores/useCategoryStore';
import { useEventStore } from './stores/useEventStore';
import { useProductStore } from './stores/useProductStore';

import CategorySidebar from './components/home/CategorySidebar';
import BannerSwiper from './components/home/BannerSwiper';
import ProductCard from './components/user/ProductCard';
import PartnerLogoBanner from './components/home/PartnerLogoBanner';

export default function HomePage() {
    const { categories, fetchCategories } = useCategoryStore();
    const { events, fetchEvents } = useEventStore();
    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchCategories(), fetchEvents(), fetchProducts()]);
        };
        loadData();
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
            <Navbar />

            {/* HERO SECTION - Adjusted for New Navbar Height */}
            <main className="container mx-auto px-6 pt-24 pb-12 max-w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <CategorySidebar categories={categories} />
                    <BannerSwiper events={events} />
                </div>
            </main>

            {/* FEATURED PRODUCTS SECTION */}
            <section className="container mx-auto px-6 py-24 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                             <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                             <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">System Inventory</p>
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                            Featured <span className="text-slate-400">Units</span>
                        </h2>
                    </div>
                    
                    <Link href="/store" className="group flex items-center gap-3 px-6 py-3 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-black text-slate-600 uppercase tracking-widest transition-all hover:bg-white hover:shadow-xl hover:border-blue-200 hover:text-blue-600">
                        Explore Registry <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* PRODUCT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products?.slice(0, 8).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            <PartnerLogoBanner />
            <Footer />
        </div>
    );
}
// "use client";
// import React, { useEffect } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "swiper/css/effect-fade";
// import { useEventStore } from "../../stores/useEventStore";
// import Link from "next/link"; // ✅ correct import for Next.js links

// const slugify = (text) => {
//   if (!text) return "untitled";
//   return text
//     .toString()
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^\w\-]+/g, "")
//     .replace(/\-\-+/g, "-");
// };

// export default function EventsCarousel() {
//   const eventStore = useEventStore();

//   useEffect(() => {
//     eventStore.fetchEvents();
//   }, []);

//   // console.log("Events:", eventStore.events);

//   if (eventStore.loading) {
//     return (
//       <div className="w-full relative shadow-xl rounded-2xl py-8 flex items-center justify-center h-[400px]">
//         <div className="flex flex-col items-center space-y-6">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
//           <p className="text-slate-600 font-medium text-lg">
//             Loading events...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (eventStore.error) {
//     return (
//       <div className="w-full relative shadow-xl rounded-2xl py-8 flex items-center justify-center h-[400px] bg-white/80 backdrop-blur-sm border border-blue-100 mx-4">
//         <div className="text-center space-y-4">
//           <svg
//             className="w-20 h-20 mx-auto text-blue-300"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="1.5"
//               d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <p className="text-slate-700 font-semibold text-lg">
//             {eventStore.error}
//           </p>
//           <button
//             onClick={eventStore.fetchEvents}
//             className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-semibold"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full relative shadow-xl rounded-2xl py-2">
//       <div className="container mx-auto px-4">
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation, EffectFade]}
//           slidesPerView={1}
//           loop={true}
//           autoplay={{ delay: 5000, disableOnInteraction: false }}
//           effect="fade"
//           fadeEffect={{ crossFade: true }}
//           pagination={{ clickable: true }}
//           navigation={{
//             nextEl: ".swiper-button-next-custom",
//             prevEl: ".swiper-button-prev-custom",
//           }}
//           className="enhanced-swiper"
//         >
//           {eventStore.events.map((event) => (
//             <SwiperSlide
//               key={event.id}
//               className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden border border-blue-100 w-[90%] mx-auto"
//             >
//               <div className="flex flex-col md:flex-row items-center h-[450px]">
//                 {/* Text Section */}
//                 <div className="w-full md:w-2/5 p-6 lg:p-12 order-2 md:order-1 relative h-full flex flex-col justify-center">
//                   <div className="slide-content relative z-10 space-y-4">
//                     <div className="slide-badge inline-block bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider border border-blue-200">
//                       Upcoming Event
//                     </div>
//                     <h2 className="slide-title text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
//                       {event.name}
//                     </h2>
//                     {event.description && (
//                       <p className="slide-desc text-slate-600 text-base md:text-lg leading-relaxed line-clamp-3">
//                         {event.description}
//                       </p>
//                     )}

//                     <div className="slide-actions flex items-center space-x-4 pt-2">
//                       <Link
//                         href={`/event/${slugify(event?.name)}`}
//                         className="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 text-sm"
//                       >
//                         <span>Learn More</span>
//                         <svg
//                           className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M17 8l4 4m0 0l-4 4m4-4H3"
//                           />
//                         </svg>
//                       </Link>

//                       <div className="flex items-center space-x-2">
//                         <button className="swiper-button-prev-custom nav-button">
//                           <svg
//                             className="w-5 h-5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M15 19l-7-7 7-7"
//                             />
//                           </svg>
//                         </button>
//                         <button className="swiper-button-next-custom nav-button">
//                           <svg
//                             className="w-5 h-5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M9 5l7 7-7 7"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Image Section */}
//                 <div className="w-full md:w-3/5 h-[300px] md:h-full order-1 md:order-2 relative">
//                   <div
//                     className="w-full h-full rounded-2xl md:rounded-r-3xl md:rounded-l-none bg-cover bg-center shadow-xl relative overflow-hidden"
//                     style={{
//                       backgroundImage: event.event_image_url
//                         ? `url(${event.event_image_url})`
//                         : "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
//                     }}
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-blue-900/10"></div>
//                     <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"></div>
//                     <div className="absolute bottom-6 left-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"></div>
//                   </div>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// }



// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { Heart, ShoppingCart  } from 'lucide-react';

// const STATIC_PRODUCTS = [
//     {
//         id: 1,
//         name: "TechnoCore X1 Pro Laptop",
//         price: 1299.00,
//         category: "Laptops",
//         image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80",
//         badge: "Hot Seller"
//     },
//     {
//         id: 2,
//         name: "Ultra-Link Mechanical Keyboard",
//         price: 159.00,
//         category: "Accessories",
//         image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80",
//         badge: "New"
//     },
//     {
//         id: 3,
//         name: "Pulse-V2 Wireless Headphones",
//         price: 249.50,
//         category: "Audio",
//         image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80",
//     },
//     {
//         id: 4,
//         name: "N-Core 4K OLED Monitor",
//         price: 599.00,
//         category: "Displays",
//         image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80",
//         badge: "Pre-order"
//     }
// ];

// const ProductCategory = () => {
//     return (
//         <section className="container mx-auto px-4 py-10">
//             {/* Section Header */}
//             <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
//                 <div>
//                     <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Featured Gear</h2>
//                     <p className="text-slate-500 font-medium">Top-rated performance hardware for enthusiasts.</p>
//                 </div>
//                 <div className="flex gap-2">
//                     {["All", "Laptops", "Peripherals", "Components"].map((tab) => (
//                         <button key={tab} className="px-5 py-2 text-xs font-bold rounded-full border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all">
//                             {tab}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Product Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//                 {STATIC_PRODUCTS.map((product) => (
//                     <div key={product.id} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col">
//                         {/* Image Wrapper */}
//                         <div className="relative aspect-square overflow-hidden bg-slate-100">
//                             <img 
//                                 src={product.image} 
//                                 alt={product.name} 
//                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                             />
//                             {product.badge && (
//                                 <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm border border-white">
//                                     {product.badge}
//                                 </span>
//                             )}
//                             <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg border border-gray-100">
//                                 <Heart className="w-5 h-5" />
//                             </button>
//                         </div>

//                         {/* Content */}
//                         <div className="p-6 flex flex-col flex-1">
//                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{product.category}</p>
//                             <h3 className="font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-1">
//                                 {product.name}
//                             </h3>
                            
//                             <div className="mt-auto flex items-center justify-between">
//                                 <div>
//                                     <p className="text-xs text-gray-400 font-medium line-through">$ {product.price + 200}</p>
//                                     <p className="text-xl font-black text-slate-900">$ {product.price}</p>
//                                 </div>
//                                 <button className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95">
//                                     <ShoppingCart className="w-5 h-5" />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
            
//             <div className="mt-16 text-center">
//                 <button className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200">
//                     Explore All Hardware
//                 </button>
//             </div>
//         </section>
//     );
// };

// export default ProductCategory;
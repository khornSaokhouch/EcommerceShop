"use client";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { useEventStore } from "../../stores/useEventStore";
import Link from "next/link"; // ✅ correct import for Next.js links

const slugify = (text) => {
  if (!text) return "untitled";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

export default function EventsCarousel() {
  const eventStore = useEventStore();

  useEffect(() => {
    eventStore.fetchEvents();
  }, []);

  // console.log("Events:", eventStore.events);

  if (eventStore.loading) {
    return (
      <div className="w-full relative shadow-xl rounded-2xl py-8 flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-600 font-medium text-lg">
            Loading events...
          </p>
        </div>
      </div>
    );
  }

  if (eventStore.error) {
    return (
      <div className="w-full relative shadow-xl rounded-2xl py-8 flex items-center justify-center h-[400px] bg-white/80 backdrop-blur-sm border border-blue-100 mx-4">
        <div className="text-center space-y-4">
          <svg
            className="w-20 h-20 mx-auto text-blue-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-slate-700 font-semibold text-lg">
            {eventStore.error}
          </p>
          <button
            onClick={eventStore.fetchEvents}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative shadow-xl rounded-2xl py-2">
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          className="enhanced-swiper"
        >
          {eventStore.events.map((event) => (
            <SwiperSlide
              key={event.id}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden border border-blue-100 w-[90%] mx-auto"
            >
              <div className="flex flex-col md:flex-row items-center h-[450px]">
                {/* Text Section */}
                <div className="w-full md:w-2/5 p-6 lg:p-12 order-2 md:order-1 relative h-full flex flex-col justify-center">
                  <div className="slide-content relative z-10 space-y-4">
                    <div className="slide-badge inline-block bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider border border-blue-200">
                      Upcoming Event
                    </div>
                    <h2 className="slide-title text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                      {event.name}
                    </h2>
                    {event.description && (
                      <p className="slide-desc text-slate-600 text-base md:text-lg leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    <div className="slide-actions flex items-center space-x-4 pt-2">
                      <Link
                        href={`/event/${slugify(event?.name)}`}
                        className="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 text-sm"
                      >
                        <span>Learn More</span>
                        <svg
                          className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>

                      <div className="flex items-center space-x-2">
                        <button className="swiper-button-prev-custom nav-button">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <button className="swiper-button-next-custom nav-button">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Section */}
                <div className="w-full md:w-3/5 h-[300px] md:h-full order-1 md:order-2 relative">
                  <div
                    className="w-full h-full rounded-2xl md:rounded-r-3xl md:rounded-l-none bg-cover bg-center shadow-xl relative overflow-hidden"
                    style={{
                      backgroundImage: event.event_image_url
                        ? `url(${event.event_image_url})`
                        : "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-blue-900/10"></div>
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"></div>
                    <div className="absolute bottom-6 left-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"></div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

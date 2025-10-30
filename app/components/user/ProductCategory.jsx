'use client';

import React, { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { useEventStore } from '../../stores/useEventStore';
import { useUserStore } from '../../stores/userStore';
import Image from 'next/image';

const EventCategory = () => {
  // 1. Get the category ID from the URL parameters
  const params = useParams();
  const routeCategoryId = params.categoryId;

  const userId = useUserStore((state) => state.user?.id);
  const { categories, fetchCategories } = useCategoryStore();
  const { events, fetchEvents } = useEventStore();
  const router = useRouter();

  // Fetch data on mount
  useEffect(() => {
    fetchCategories();
    fetchEvents();
  }, [fetchCategories, fetchEvents]);

  // 2. Filter events based on the URL's category ID
  const filteredEvents = useMemo(() => {
    if (!routeCategoryId) {
      return events;
    }

    return events.filter(
      (event) => String(event.category_id) === routeCategoryId
    );
  }, [events, routeCategoryId]);

  // 3. Get the active category object for the title/display
  const activeCategory = useMemo(() => {
    return categories.find((cat) => String(cat.id) === routeCategoryId);
  }, [categories, routeCategoryId]);

  // 4. Handle category click for navigation
  const handleCategoryClick = (categoryId) => {
    if (userId) {
      router.push(`/user/${userId}/category/${categoryId}`);
    } else {
      router.push(`/category/${categoryId}`);
    }
  };

  // 5. Handle event click
  const handleEventClick = (eventId) => {
    router.push(`/event/${eventId}`);
  };

  // Display loading state
  if (!categories.length || !events.length) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading categories and events...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4">
      {/* 🔵 Left: Categories 🔵 */}
      <div className="w-full md:w-1/5 bg-white rounded-3xl p-4 shadow-xl flex-shrink-0 mb-6 md:mb-0">
        <h2 className="text-xl font-extrabold mb-4 text-gray-800 border-b pb-2">
          Categories
        </h2>
        <ul>
          {categories.map((category) => (
            <li
              key={category.id}
              className={`py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 text-sm
                ${
                  String(category.id) === routeCategoryId
                    ? 'bg-red-500 text-white font-bold shadow-md'
                    : 'hover:bg-red-50 hover:text-blue-600 text-gray-700'
                }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      {/* 🔵 Middle: Banner + Mini Cards (Using filteredEvents) 🔵 */}
      <div className="w-full md:w-3/5 flex flex-col gap-6 ml-0 md:ml-6 mt-6 md:mt-0">
        {/* Main Banner Event */}
        {filteredEvents[0] && (
          <div
            className="bg-gray-200 relative rounded-3xl overflow-hidden shadow-md mb-1 cursor-pointer"
            onClick={() => handleEventClick(filteredEvents[0].id)}
          >
            <div className="relative h-102">
              <Image
                src={filteredEvents[0].event_image_url || '/placeholder.jpg'}
                alt={filteredEvents[0].name}
                fill
                style={{ objectFit: 'cover' }}
                className="absolute inset-0 opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
            </div>
            <div className="absolute top-0 left-0 p-8 z-10 text-left w-1/2">
              <h2 className="text-6xl font-bold text-white mb-2">
                {filteredEvents[0].name}
              </h2>
              <p className="text-white text-lg mb-14 line-clamp-2">
                {filteredEvents[0].description}
              </p>
              <button className="bg-white text-black font-semibold py-4 px-8 rounded-xl hover:bg-gray-300">
                View Event
              </button>
            </div>
          </div>
        )}

        {/* Mini Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.slice(1, 3).map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md flex flex-col cursor-pointer"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="relative h-52 rounded-t-3xl">
                <Image
                  src={event.event_image_url || '/placeholder.jpg'}
                  alt={event.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>

                {/* ✅ Bottom-left text */}
                <div className="absolute bottom-4 left-4 text-left px-4 text-white">
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <p className="text-sm mt-1">
                    {new Date(event.start_date).toLocaleDateString()}
                  </p>
                  <button className="text-sm mt-2 font-semibold underline hover:text-gray-300">
                    VIEW EVENT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔵 Right Column 🔵 */}
      <div className="w-full md:w-1/5 flex flex-col gap-6 ml-0 md:ml-6 mt-6 md:mt-0">
        <div className="grid grid-cols-1 gap-6">
          {filteredEvents.slice(3, 5).map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md flex flex-col cursor-pointer"
              onClick={() => handleEventClick(event.id)}
            >
              <div
                className="relative h-78 rounded-t-3xl bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    event.event_image_url || '/placeholder.jpg'
                  })`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>

                {/* ✅ Bottom-left text */}
                <div className="absolute bottom-4 left-4 text-left px-4 text-white">
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <p className="text-sm mt-1">
                    {new Date(event.start_date).toLocaleDateString()}
                  </p>
                  <button className="mt-2 bg-white text-black font-semibold py-1 px-4 rounded hover:bg-gray-300">
                    VIEW EVENT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventCategory;

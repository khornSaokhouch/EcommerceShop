"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Correct Next.js hooks
import { useEventStore } from "../../../stores/useEventStore"; // Adjust path
import Link from "next/link";


const slugify = (text) =>
  (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

export default function EventDetails() {
  const { name } = useParams(); // dynamic param from folder [name]
  const router = useRouter();
  const eventStore = useEventStore();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const fetchEvent = async () => {
    setLoading(true);
    try {
      await eventStore.fetchEvents(); // fetch all events
      const matched = eventStore.events.find((e) => slugify(e.name) === name);
      if (!matched) throw new Error("Event not found");
      setEvent(matched);
    } catch (err) {
      setError(err.message || "Event not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [name]);

  const shareEvent = async () => {
    if (!event) return;
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      alert("Event link copied to clipboard!");
    } catch {
      alert("Failed to copy link.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-600 font-medium text-lg">Loading event...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 px-8 py-10 text-center">
          <p className="text-slate-700 font-semibold text-lg">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
        >
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
          <span className="font-medium">Back</span>
        </button>

        {/* Event Details Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Event Image */}
          <div
            className="w-full h-80 md:h-[70vh] bg-cover bg-center relative"
            style={{
              backgroundImage: event.event_image_url
                ? `url(${event.event_image_url})`
                : "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
          </div>

          {/* Event Info */}
          <div className="p-6 md:p-12 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {event.name}
            </h1>

            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-600">
              {/* Dates */}
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {formatDate(event.start_date)} – {formatDate(event.end_date)}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a2 2 0 00-2-2h-3v4zm0 0v-4H7v4h10zm-5-8a2 2 0 100-4 2 2 0 000 4zm0 0v4H7v-4h5z"
                  />
                </svg>
                <span>{event.location || "Online"}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {event.description}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center space-x-4">
              <Link
                href="/register"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
              >
                Register Now
              </Link>

              <button
                onClick={shareEvent}
                className="px-6 py-3 border border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

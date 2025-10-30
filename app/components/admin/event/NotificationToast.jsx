// components/NotificationToast.jsx
import React, { useEffect, useState } from "react";

export default function NotificationToast({ message, type }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000); // Hide after 3s
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message || !visible) return null;

  const backgroundColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const icon =
    type === "success" ? (
      <svg
        className="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    ) : (
      <svg
        className="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    );

  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center px-6 py-4 rounded-lg shadow-xl text-white ${backgroundColor} transition-all duration-300 transform translate-y-0 opacity-100 z-[100]`}
    >
      {icon}
      <p className="font-semibold text-lg">{message}</p>
    </div>
  );
}

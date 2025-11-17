// components/admin/Analytics.jsx
"use client";
import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Users, ShoppingCart, DollarSign, Calendar } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminAnalytics() {
  // Example data
  const metrics = [
    { title: "Total Users", value: 1245, icon: <Users className="w-6 h-6 text-blue-500" /> },
    { title: "Total Orders", value: 856, icon: <ShoppingCart className="w-6 h-6 text-green-500" /> },
    { title: "Revenue", value: "$12,450", icon: <DollarSign className="w-6 h-6 text-yellow-500" /> },
    { title: "Events", value: 23, icon: <Calendar className="w-6 h-6 text-purple-500" /> },
  ];

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [5000, 7000, 4000, 8000, 6000, 10000],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Monthly Revenue" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Analytics Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white shadow rounded-xl p-6 flex items-center space-x-4 hover:shadow-lg transition">
            <div className="p-3 bg-gray-100 rounded-full">{metric.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <Line data={salesData} options={salesOptions} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">Revenue Bar Chart</h2>
          <Bar data={salesData} options={salesOptions} />
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import {
  Package,
  ShoppingCart,
  DollarSign,
  CreditCard,
  Users,
} from "lucide-react";

import { useCompanyStore } from "../../stores/useCompanyStore";

// Register Chart.js
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

// Sparkline component
const Sparkline = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = (1 - (val - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <div className="w-full h-12 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline fill="none" stroke={color} strokeWidth="4" points={points} />
      </svg>
    </div>
  );
};

export default function CompanyDashboard() {
  const { companies, fetchCompanies } = useCompanyStore();
  const [loading, setLoading] = useState(true);
  const [sparklineData, setSparklineData] = useState([]);

  // Example metrics
  const [products] = useState(1520);
  const [orders] = useState(856);
  const [sales] = useState(1200);
  const [revenue] = useState(12450);

  // Example top sellers
  const [topProducts] = useState([
    { name: "Product A", unitsSold: 150, revenue: 4500 },
    { name: "Product B", unitsSold: 120, revenue: 3600 },
    { name: "Product C", unitsSold: 100, revenue: 3000 },
    { name: "Product D", unitsSold: 80, revenue: 2500 },
  ]);
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchCompanies();
      setSparklineData(Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)));
      setLoading(false);
    };
    fetchData();
  }, [fetchCompanies]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading company dashboard...</div>;

  const metrics = [
    { title: "Total Products", value: products, icon: <Package className="w-6 h-6 text-purple-500" /> },
    { title: "Total Orders", value: orders, icon: <ShoppingCart className="w-6 h-6 text-green-500" /> },
    { title: "Total Sales", value: sales, icon: <CreditCard className="w-6 h-6 text-blue-500" /> },
    { title: "Total Revenue", value: `$${revenue}`, icon: <DollarSign className="w-6 h-6 text-yellow-500" /> },
  ];

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [5000, 7000, 4000, 8000, 6000, 10000],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Monthly Revenue" },
    },
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Company Dashboard</h1>

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">Revenue Bar Chart</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Sparkline */}
      <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition mb-6">
        <h2 className="text-lg font-semibold mb-4">Sales Trend (Last 10 Days)</h2>
        <Sparkline data={sparklineData} color="#3b82f6" />
      </div>

<div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition mt-6">
  <h2 className="text-lg font-semibold mb-4">Top Products</h2>
  <div className="space-y-4">
    {topProducts.map((product, idx) => (
      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-purple-500" />
          <div>
            <p className="font-medium text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500">Units Sold: {product.unitsSold}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800">${product.revenue}</p>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}

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
  Users,
  ShoppingCart,
  DollarSign,
  Calendar,
  Package,
  CreditCard,
  ListOrdered,
} from "lucide-react";

import { useUserStore } from "../../stores/userStore";
import { useCompanyStore } from "../../stores/useCompanyStore";
import { useEventStore } from "../../stores/useEventStore";

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

export default function DashboardPage() {
  const { users, fetchAllUsers } = useUserStore();
  const { companies, fetchCompanies } = useCompanyStore();
  const { events, fetchEvents } = useEventStore();
  const [loading, setLoading] = useState(true);

  const [recentOrders] = useState([
    { id: "#1001", customer: "Alice Smith", amount: "$250.00", status: "Delivered" },
    { id: "#1002", customer: "Bob Johnson", amount: "$120.50", status: "Pending" },
    { id: "#1003", customer: "Charlie Brown", amount: "$300.00", status: "Shipped" },
    { id: "#1004", customer: "Diana Prince", amount: "$80.00", status: "Cancelled" },
  ]);

  const [salesData, setSalesData] = useState([]);
  const [productsSparkline, setProductsSparkline] = useState([]);
  const [usersSparkline, setUsersSparkline] = useState([]);
  const [companiesSparkline, setCompaniesSparkline] = useState([]);

  const adminName = useUserStore((state) => state.user?.name ?? "Admin");

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllUsers();
      await fetchCompanies();
      await fetchEvents();

      const generateSparkline = (count) =>
        Array.from({ length: 10 }, () => Math.floor(Math.random() * count));

      setProductsSparkline(generateSparkline(1520));
      setUsersSparkline(generateSparkline(users.filter((u) => u.status === "pending").length || 10));
      setCompaniesSparkline(generateSparkline(companies.length || 10));
      setSalesData(generateSparkline(50));

      setLoading(false);
    };
    fetchData();
  }, [fetchAllUsers, fetchCompanies, fetchEvents]);

// Calculated values
const totalUsers = useMemo(() => users.filter(u => u.role !== "admin").length, [users]);
const totalCompanies = useMemo(() => companies.length ?? 0, [companies]);
const pendingCompanies = useMemo(() => companies.filter((c) => c.status === "pending").length, [companies]);
const totalEvents = useMemo(() => events.length ?? 0, [events]);
const totalOrders = useMemo(() => recentOrders.length, [recentOrders]);
const totalRevenue = useMemo(() => {
  return recentOrders.reduce((acc, curr) => acc + parseFloat(curr.amount.replace("$", "")), 0).toFixed(2);
}, [recentOrders]);

  // Chart data
  const chartData = {
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Monthly Revenue" },
    },
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  const metrics = [
    { title: "Total Users", value: totalUsers, icon: <Users className="w-6 h-6 text-blue-500" /> },
    // { title: "Total Orders", value: totalOrders, icon: <ShoppingCart className="w-6 h-6 text-green-500" /> },
    // { title: "Revenue", value: `$${totalRevenue}`, icon: <DollarSign className="w-6 h-6 text-yellow-500" /> },
    { title: "Events", value: totalEvents, icon: <Calendar className="w-6 h-6 text-purple-500" /> },
    { title: "Total Companies", value: totalCompanies, icon: <CreditCard className="w-6 h-6 text-teal-500" /> },
    { title: "Pending Companies", value: pendingCompanies, icon: <Users className="w-6 h-6 text-orange-500" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {adminName}</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-xl p-6 flex items-center space-x-4 hover:shadow-lg transition"
          >
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

       {/* Recent Orders + Sales Analytics */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-200">
                    <ListOrdered className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{order.amount}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    order.status === "Delivered" ? "bg-green-100 text-green-700" :
                    order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                    order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                    "bg-red-100 text-red-700"
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Analytics */}
        <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">Sales Analytics (Last 10 Days)</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

    </div>
  );
}  
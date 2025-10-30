"use client";

import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  ListOrdered,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/userStore";
import { useCompanyStore } from "../../stores/useCompanyStore";
import { useEffect, useState } from "react";
import { useMemo } from "react";

// Simple Sparkline chart
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
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polyline fill="none" stroke={color} strokeWidth="4" points={points} />
      </svg>
    </div>
  );
};

// Dashboard Card
const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor,
  sparklineData,
  sparklineColor,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col justify-between"
  >
    <div className="flex items-start justify-between mb-4">
      <div
        className={`p-3 rounded-xl ${iconBgColor} text-white shadow-md shadow-gray-200/50`}
      >
        <Icon className="h-5 w-5" />
      </div>
      {change && (
        <span
          className={`text-sm font-medium ${
            change.startsWith("+") ? "text-green-500" : "text-red-500"
          }`}
        >
          {change}
        </span>
      )}
    </div>
    <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
    <h3 className="text-3xl font-bold text-gray-900 mb-4">{value}</h3>
    {sparklineData && sparklineData.length > 0 && (
      <Sparkline data={sparklineData} color={sparklineColor} />
    )}
  </motion.div>
);

const LargeCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-100"
  >
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </motion.div>
);

export default function DashboardPage() {
  const { users, fetchAllUsers } = useUserStore();
  const { companies, fetchCompanies, loading, error } = useCompanyStore();

  const [recentOrders] = useState([
    {
      id: "#1001",
      customer: "Alice Smith",
      amount: "$250.00",
      status: "Delivered",
      color: "bg-green-100 text-green-700",
    },
    {
      id: "#1002",
      customer: "Bob Johnson",
      amount: "$120.50",
      status: "Pending",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      id: "#1003",
      customer: "Charlie Brown",
      amount: "$300.00",
      status: "Shipped",
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: "#1004",
      customer: "Diana Prince",
      amount: "$80.00",
      status: "Cancelled",
      color: "bg-red-100 text-red-700",
    },
  ]);

  const [salesData, setSalesData] = useState([]);
  const [productsSparkline, setProductsSparkline] = useState([]);
  const [usersSparkline, setUsersSparkline] = useState([]);
  const [companiesSparkline, setCompaniesSparkline] = useState([]);
  // Inside DashboardPage component
  const adminName = useUserStore((state) => state.user?.name ?? "Admin");

  useEffect(() => {
    fetchAllUsers();
    fetchCompanies();

    // Generate client-side sparklines to avoid hydration mismatch
    const generateSparkline = (count) =>
      Array.from({ length: 10 }, () => Math.floor(Math.random() * count));

    setProductsSparkline(generateSparkline(1520));
    setUsersSparkline(
      generateSparkline(
        users.filter((u) => u.status === "pending").length || 10
      )
    );
    setCompaniesSparkline(generateSparkline(companies.length || 10));
    setSalesData(generateSparkline(50));
  }, [fetchAllUsers, fetchCompanies, users.length, companies.length]);

  // Inside DashboardPage component:
  const totalCompanies = useMemo(
    () => users?.filter((u) => u.role === "company").length ?? 0,
    [users]
  );

  const pendingCompaniesCount = useMemo(
    () => companies.filter((c) => c.status === "pending").length,
    [companies]
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg shadow-blue-500/25 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {adminName}!</h1>
          <p className="text-blue-100">
            Here's an overview of your e-commerce performance.
          </p>
        </div>
        <div className="hidden md:block w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
          <LayoutDashboard className="h-16 w-16 text-white/50" />
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Products"
          value="1,520"
          icon={Package}
          iconBgColor="bg-gradient-to-br from-purple-500 to-indigo-600"
          change="+3.1% This Week"
          sparklineData={productsSparkline}
          sparklineColor="#8B5CF6"
        />

        <StatCard
          title="Total Become To Seller (Pending)"
          value={pendingCompaniesCount} // ✅ Updated value
          icon={Users}
          iconBgColor="bg-gradient-to-br from-orange-500 to-yellow-600"
          sparklineData={companiesSparkline} // optional: sparkline for companies
          sparklineColor="#F59E0B"
        />

        <StatCard
          title="Total Companies"
          value={totalCompanies}
          icon={CreditCard}
          iconBgColor="bg-gradient-to-br from-teal-500 to-cyan-600"
          change="+2.8% This Month"
          sparklineData={companiesSparkline} // still using client-generated sparkline
          sparklineColor="#14B8A6"
        />
      </div>

      {/* Larger Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LargeCard title="Recent Orders">
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
              >
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
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${order.color}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </LargeCard>

        <LargeCard title="Sales Analytics (Last 10 Days)">
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
            {salesData.length > 0 && (
              <Sparkline data={salesData} color="#6366F1" />
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Detailed sales data for the current period.
          </p>
        </LargeCard>
      </div>
    </div>
  );
}

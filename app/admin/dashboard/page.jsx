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
  Filler
} from "chart.js";
import {
  Users,
  ShieldCheck,
  Database,
  Activity,
  ArrowUpRight,
  Loader2,
  Globe,
  Cpu,
  Zap,
  TrendingUp,
  BarChart3
} from "lucide-react";

import { useUserStore } from "../../stores/userStore";
import { useCompanyStore } from "../../stores/useCompanyStore";
import { motion } from "framer-motion";

// Register Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, Filler
);

// --- SPARKLINE COMPONENT ---
const Sparkline = ({ data, color }) => {
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val / Math.max(...data)) * 100 || 0);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="w-20 h-8 opacity-50">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" points={points} />
      </svg>
    </div>
  );
};

export default function DashboardPage() {
  const { users, fetchAllUsers } = useUserStore();
  const { companies, fetchCompanies } = useCompanyStore();
  const [loading, setLoading] = useState(true);

  const adminName = useUserStore((state) => state.user?.name ?? "Lead Admin");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAllUsers(), fetchCompanies()]);
      setLoading(false);
    };
    fetchData();
  }, [fetchAllUsers, fetchCompanies]);

  // Derived Real Data Calculations
  const totalUsers = useMemo(() => users.filter(u => u.role !== "admin").length, [users]);
  const totalCompanies = useMemo(() => companies.length ?? 0, [companies]);
  const pendingNodes = useMemo(() => companies.filter(c => c.status === "pending" || !c.status).length, [companies]);

  // Mocked Analytics Data (Matches Technocore Specs)
  const recentTransmissions = [
    { id: "TX-9041", node: "Standard User", action: "Registry Entry", time: "2m ago", status: "success" },
    { id: "TX-9042", node: "Merchant Node", action: "Protocol Sync", time: "14m ago", status: "pending" },
    { id: "TX-9043", node: "Standard User", action: "Session Start", time: "22m ago", status: "success" },
    { id: "TX-9044", node: "Merchant Node", action: "Unit Update", time: "1h ago", status: "success" },
  ];

  const chartData = {
    labels: ["01", "02", "03", "04", "05", "06"],
    datasets: [{
      label: "Registry Traffic",
      data: [40, 65, 55, 85, 70, 98],
      borderColor: "#2563eb",
      backgroundColor: "rgba(37, 99, 235, 0.03)",
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointRadius: 0
    }],
  };

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
      <p className="text-[13px] font-medium text-slate-500 uppercase tracking-[0.3em]">Accessing Command Core...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700 bg-white font-sans">
      
      {/* 1. SYSTEM WELCOME */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-50 pb-8">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol 4.0 // Connection Stable</span>
           </div>
           <h1 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter">
             Welcome back, <span className="text-blue-600">{adminName.split(' ')[0]}</span>
           </h1>
        </div>
        <div className="flex gap-3">
            <button className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all">Audit Logs</button>
            <button className="px-5 py-3 bg-slate-900 text-white rounded-2xl text-[13px] font-bold uppercase tracking-widest shadow-xl shadow-slate-200">Broadcast Node</button>
        </div>
      </div>

      {/* 2. REAL DATA METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
            label="Registry Nodes" 
            value={totalUsers} 
            sub="Active Identities" 
            icon={Database} 
            color="#2563eb" 
            spark={[20, 45, 30, 60, 50, 80, 75]} 
        />
        <MetricCard 
            label="Verified Partners" 
            value={totalCompanies} 
            sub="Merchant Nodes" 
            icon={ShieldCheck} 
            color="#06b6d4" 
            spark={[40, 35, 55, 45, 70, 65, 90]} 
        />
        <MetricCard 
            label="Pending Syncs" 
            value={pendingNodes} 
            sub="Awaiting Validation" 
            icon={Activity} 
            color="#f59e0b" 
            spark={[60, 40, 50, 30, 40, 20, 10]} 
        />
      </div>

      {/* 3. CHART ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest">Registry Activity</h3>
                    <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">Global Sourcing Stream</p>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex gap-1">
                    <button className="px-3 py-1 bg-white text-blue-600 text-[13px] font-medium rounded-lg shadow-sm border border-slate-100">Live</button>
                    <button className="px-3 py-1 text-slate-500 text-[13px] font-medium">24H</button>
                </div>
            </div>
            <div className="h-[300px]">
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm flex flex-col">
            <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest mb-10">System Load</h3>
            <div className="flex-1 min-h-[200px]">
                <Bar data={chartData} options={barOptions} />
            </div>
            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                <StatusRow label="API Response" value="12ms" color="bg-blue-500" />
                <StatusRow label="Cloud Storage" value="84%" color="bg-cyan-400" />
            </div>
        </div>
      </div>

      {/* 4. ACTIVITY + DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Transmissions</h3>
                <BarChart3 className="text-slate-200" size={20} />
            </div>
            <div className="divide-y divide-slate-50">
                {recentTransmissions.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <Zap size={18} />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">{item.id}</p>
                                <p className="text-[13px] font-medium text-slate-500 uppercase">{item.node} • {item.action}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[13px] font-bold text-slate-900 uppercase">{item.time}</p>
                            <span className={`text-[11px] font-bold uppercase tracking-widest ${item.status === 'success' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="lg:col-span-5 bg-slate-900 rounded-[32px] p-8 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-20 blur-[100px] -mr-32 -mt-32" />
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-8">Node Distribution</h3>
            <div className="h-56 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm">
                <Globe className="text-white opacity-10 animate-pulse" size={80} />
                <p className="text-[13px] font-medium text-slate-500 uppercase mt-4 tracking-[0.3em]">Satellite Feed: Active</p>
            </div>
            <div className="mt-8 flex justify-between items-end">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grid Coverage</p>
                    <p className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Global Network</p>
                </div>
                <div className="p-3 bg-blue-600 rounded-xl">
                    <ArrowUpRight className="text-white" size={20} />
                </div>
            </div>
        </div>
      </div>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function MetricCard({ label, value, sub, icon: Icon, color, spark }) {
    return (
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col group hover:border-blue-200 transition-all">
            <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: color }}>
                    <Icon size={22} />
                </div>
                <Sparkline data={spark} color={color} />
            </div>
            <div>
                <p className="text-[13px] font-medium text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
                <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h4>
                <p className="text-[13px] font-medium text-slate-400 uppercase mt-2">{sub}</p>
            </div>
        </div>
    );
}

function StatusRow({ label, value, color }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
                <span className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">{label}</span>
            </div>
            <span className="text-[13px] font-medium text-slate-900">{value}</span>
        </div>
    )
}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { 
        x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 9, weight: 'bold' }, color: '#94a3b8' } },
        y: { grid: { color: "#f8fafc" }, border: { display: false }, ticks: { font: { size: 9, weight: 'bold' }, color: '#94a3b8' } }
    }
};

const barOptions = {
    ...chartOptions,
    scales: { x: { display: false }, y: { display: false } }
};
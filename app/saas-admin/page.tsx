"use client";

import { useState, useEffect } from "react";
import { Building2, TrendingUp, AlertCircle, Activity, LayoutGrid, ArrowUpRight, FileDown, Plus, MoreHorizontal, Shield } from "lucide-react";
import { getSaaSMetrics, getRecentCompanies } from "@/lib/dataService";
import { formatCurrency } from "@/lib/reportUtils";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function SaaSAdminDashboard() {
  const { userData } = useAuth();
  const role = userData?.role;
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState({
    activeTenants: 0,
    suspendedAccounts: 0,
    monthlyRevenue: 0,
    totalRevenue: 0
  });
  const [recentTenants, setRecentTenants] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [metrics, recent] = await Promise.all([
          getSaaSMetrics(),
          getRecentCompanies(5)
        ]);
        setMetricsData(metrics);
        setRecentTenants(recent);
      } catch (error) {
        console.error("Error loading SaaS data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const metrics = [
    { label: "Active Tenants", value: loading ? "..." : metricsData.activeTenants.toLocaleString(), change: "Actual", icon: Building2 },
    { label: "Monthly Revenue", value: loading ? "..." : `Rp. ${formatCurrency(metricsData.monthlyRevenue)}`, change: "Actual", icon: TrendingUp },
    { label: "Total Revenue", value: loading ? "..." : `Rp. ${formatCurrency(metricsData.totalRevenue)}`, change: "Actual", icon: Activity },
    { label: "Suspended Accounts", value: loading ? "..." : metricsData.suspendedAccounts.toString(), change: "Needs Action", icon: AlertCircle },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">System Operational</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight font-manrope">
            SaaS Command Center
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Centralized management for Quantive Ledger ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {role === 'Super Admin' && (
            <Link 
              href="/"
              className="bg-slate-900 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
            >
              <LayoutGrid size={18} />
              MAIN DASHBOARD
            </Link>
          )}
          <button className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <FileDown size={18} className="text-slate-400" />
            Report
          </button>
          <button className="bg-[#008b8b] px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg shadow-[#008b8b]/20 hover:bg-[#007a7a] transition-all flex items-center gap-2 active:scale-95">
            <Plus size={18} />
            NEW TENANT
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <div 
            key={m.label} 
            className="glass-panel p-6 rounded-[2rem] border border-white/50 shadow-sm hover:shadow-md transition-all group"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-[#008b8b]/10 text-[#008b8b] transition-transform group-hover:scale-110">
                <m.icon size={24} />
              </div>
              <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500`}>
                {m.change}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{m.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{m.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Section */}
        <div className="lg:col-span-2 glass-panel rounded-[2.5rem] border border-white/50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-white/40 flex justify-between items-center">
            <div>
              <h4 className="text-xl font-black text-slate-900 font-manrope">Recent Tenant Activity</h4>
              <p className="text-slate-400 text-sm font-medium">Onboarding & Subscription Status</p>
            </div>
            <button className="p-2 hover:bg-white/40 rounded-full transition-colors">
              <MoreHorizontal size={20} className="text-slate-400" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscription</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic">Memuat data actual...</td>
                  </tr>
                ) : recentTenants.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic">Belum ada tenant actual.</td>
                  </tr>
                ) : (
                  recentTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-white/40 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-xs uppercase group-hover:bg-[#008b8b]/10 group-hover:text-[#008b8b] transition-colors">
                            {tenant.name.substring(0, 2)}
                          </div>
                          <span className="font-bold text-slate-900 text-sm">{tenant.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-slate-500 text-sm font-medium">{tenant.plan || 'Standard'} Plan</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          tenant.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="text-slate-400 text-xs font-bold">{new Date(tenant.createdAt).toLocaleDateString('id-ID')}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Actions Area */}
        <div className="space-y-6">
          {/* Quick Action Card */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-2 font-manrope">System Control</h4>
              <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                Execute maintenance tasks and system-wide configurations.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-white/10 hover:bg-white/20 p-4 rounded-3xl flex flex-col items-center gap-3 transition-all border border-white/5 group/btn">
                  <LayoutGrid size={24} className="text-[#008b8b] group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Modules</span>
                </button>
                <button className="bg-white/10 hover:bg-white/20 p-4 rounded-3xl flex flex-col items-center gap-3 transition-all border border-white/5 group/btn">
                  <ArrowUpRight size={24} className="text-[#008b8b] group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Updates</span>
                </button>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <Shield size={200} />
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/50 shadow-sm">
            <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#008b8b]">notification_important</span>
              Pending Tasks
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-[#008b8b]/5 border border-[#008b8b]/10 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-[#008b8b]/10 transition-colors">
                <div>
                  <p className="text-[10px] font-black text-[#008b8b] uppercase tracking-widest">Urgent</p>
                  <p className="text-sm font-bold text-slate-900">Actual Alert Placeholder</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#008b8b] shadow-sm group-hover:scale-110 transition-all">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

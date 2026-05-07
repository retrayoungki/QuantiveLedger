"use client";

import { useState } from "react";
import Link from "next/link";
import { menuItems } from "@/lib/menu";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions";
import { useCompany } from "@/context/CompanyContext";

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { userData } = useAuth();
  const role = userData?.role || "Super Admin"; // Fallback to Super Admin for development
  const { activeCompany, availableCompanies, setActiveCompany, loadingCompanies } = useCompany();
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // No filtering - all roles see everything
  const filteredMenuItems = menuItems;

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm no-print">
      <div className="h-16 flex justify-between items-center px-8 border-b border-slate-50/50">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative flex items-center gap-3">
              <img 
                src="/quantive-ledger.png" 
                alt="Quantive Ledger Logo" 
                className="h-11 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = document.getElementById('logo-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div id="logo-fallback" className="hidden items-center gap-2">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                </div>
                <div className="text-lg font-black text-slate-900 leading-tight font-manrope">
                  <span className="text-slate-500 text-xs block font-bold tracking-[0.2em] -mb-1">QUANTIVE</span>
                  Ledger
                </div>
              </div>
            </div>
          </Link>
          
          <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>

          {/* Company Switcher */}
          <div className="relative">
            <button 
              onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
              disabled={availableCompanies.length <= 1 || loadingCompanies}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-bold transition-all hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-slate-400 text-lg">business</span>
              <span className="max-w-[120px] truncate uppercase tracking-tight">
                {activeCompany ? activeCompany.name : (loadingCompanies ? "LOADING..." : "NO COMPANY")}
              </span>
            </button>
          </div>

          {/* Role Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100/50 text-teal-600">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{role}</span>
          </div>

          <nav className="flex items-center ml-2">
            {filteredMenuItems.map((menu) => (
              <div
                key={menu.label}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(menu.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors">
                  <span>{menu.label}</span>
                  <span className="material-symbols-outlined text-xs">expand_more</span>
                </button>

                <div className="absolute left-0 mt-0 pt-2 w-56 invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-[60]">
                  <div className="bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-2">
                    {menu.items.map((item, idx) => (
                      item.label === "divider" ? (
                        <div key={idx} className="h-px bg-slate-50 my-1 mx-2"></div>
                      ) : (
                        <Link
                          key={item.label}
                          href={item.href || "#"}
                          className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-slate-400 text-sm">
              search
            </span>
            <input
              className="bg-slate-50 border border-slate-100 rounded-full pl-10 pr-4 py-2 text-xs w-44 focus:w-56 focus:ring-2 focus:ring-teal-500/10 transition-all outline-none text-slate-600"
              placeholder="Search..."
              type="text"
            />
          </div>
          
          <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          
          <div className="h-4 w-[1px] bg-slate-200"></div>
          
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
          
          <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-slate-900 leading-tight">
                {userData?.displayName || "User"}
              </span>
              <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest">
                {userData?.role || "Staff"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-teal-600/20">
              {(userData?.displayName || "U").split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

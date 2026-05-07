"use client";

import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/LoginForm";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Initializing Security...</p>
        </div>
      </div>
    );
  }

  // Allow access to the init page without authentication
  if (!user && pathname !== '/init') {
    return <LoginForm />;
  }

  const isSaaSAdmin = pathname.startsWith('/saas-admin');

  // Enforce RBAC for SaaS Admin portal
  if (isSaaSAdmin && userData?.role !== 'Super Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200 max-w-md">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl font-bold">shield_lock</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Akses Ditolak</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-6">
            Maaf, area ini hanya dapat diakses oleh Super Admin sistem. 
            Silakan hubungi administrator pusat untuk bantuan lebih lanjut.
          </p>
          <a href="/" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all">
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {!isSaaSAdmin && <Navbar />}
      {children}
    </>
  );
}

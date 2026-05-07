import { Metadata } from "next";
import Sidebar from "./Sidebar";

export const metadata: Metadata = {
  title: "SaaS Command Center",
  description: "Centralized management for Quantive Ledger ecosystem",
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-transparent overflow-hidden font-inter text-slate-800">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}

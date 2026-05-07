"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FileText,
  CreditCard,
  Users,
  Settings,
  Shield,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/saas-admin", icon: LayoutDashboard },
  { name: "Tenants", href: "/saas-admin/tenants", icon: Building2 },
  { name: "Subscription Plans", href: "/saas-admin/plans", icon: FileText },
  { name: "Billing", href: "/saas-admin/billing", icon: CreditCard },
  { name: "Users Monitoring", href: "/saas-admin/users", icon: Users },
  { name: "System Control", href: "/saas-admin/system", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel border-r border-white/50 flex flex-col h-full shrink-0">
      <div className="h-20 flex items-center px-6 border-b border-white/40">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/quantive-ledger.png" 
            alt="Quantive Ledger" 
            className="h-11 w-auto"
          />
        </Link>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#008b8b]/10 text-[#008b8b]"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-[#008b8b]" : "text-gray-400"} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  CheckCircle2, 
  Users, 
  Trash2, 
  Edit3,
  Rocket,
  ShieldCheck,
  Star
} from "lucide-react";
import { 
  getSubscriptionPlans, 
  addSubscriptionPlan, 
  updateSubscriptionPlan, 
  deleteSubscriptionPlan 
} from "@/lib/dataService";
import Modal from "@/components/Modal";

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    userLimit: 0,
    features: ["Financial Dashboard", "Transaction Module"],
    isPopular: false
  });

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    setLoading(true);
    const data = await getSubscriptionPlans();
    if (data.length === 0) {
      // Seed default plans if empty
      const defaults = [
        { name: "Basic", price: 500000, userLimit: 3, features: ["Financial Dashboard", "Transaction Module"], isPopular: false },
        { name: "Professional", price: 1500000, userLimit: 10, features: ["Financial Dashboard", "Transaction Module", "Reporting", "Export Data"], isPopular: false },
        { name: "Enterprise", price: 5000000, userLimit: 50, features: ["Financial Dashboard", "Transaction Module", "Reporting", "Export Data", "Multi Project", "Audit Trail"], isPopular: true },
      ];
      for (const p of defaults) {
        await addSubscriptionPlan(p);
      }
      const refreshed = await getSubscriptionPlans();
      setPlans(refreshed);
    } else {
      setPlans(data);
    }
    setLoading(false);
  }

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      userLimit: plan.userLimit,
      features: plan.features || [],
      isPopular: plan.isPopular || false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      await deleteSubscriptionPlan(id);
      loadPlans();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlan) {
      await updateSubscriptionPlan(editingPlan.id, formData);
    } else {
      await addSubscriptionPlan(formData);
    }
    setIsModalOpen(false);
    loadPlans();
  };

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num).replace("Rp", "Rp ");
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight font-manrope">
            Subscription Plans
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Configure pricing tiers and feature entitlements.
          </p>
        </div>
        <button 
          onClick={() => { setEditingPlan(null); setFormData({ name: "", price: 0, userLimit: 0, features: ["Financial Dashboard", "Transaction Module"], isPopular: false }); setIsModalOpen(true); }}
          className="bg-[#008b8b] px-6 py-3 rounded-2xl text-white text-sm font-bold shadow-xl shadow-[#008b8b]/20 hover:bg-[#007a7a] transition-all flex items-center gap-2 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Create New Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {loading ? (
          <div className="col-span-3 text-center py-20 text-slate-400 italic">Memuat paket langganan...</div>
        ) : (
          plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative glass-panel rounded-[2.5rem] p-8 border transition-all flex flex-col justify-between ${
                plan.isPopular ? 'border-[#008b8b] ring-1 ring-[#008b8b]/30 scale-105' : 'border-white/50'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#008b8b] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Popular
                </div>
              )}
              
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pricing Strategy</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-slate-400 text-sm font-bold">/mo</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-slate-500">
                    <Users size={16} />
                    <span className="text-xs font-bold">Up to {plan.userLimit} Users</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Included Features</p>
                  {plan.features?.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-[#008b8b] fill-[#008b8b]/5" />
                      <span className="text-sm font-bold text-slate-700">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => handleEdit(plan)}
                  className="flex-1 py-4 bg-[#f8fafc] border border-slate-100 rounded-2xl text-[11px] font-black text-slate-600 hover:bg-white transition-all shadow-sm flex items-center justify-center uppercase tracking-widest"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(plan.id)}
                  className="w-14 h-14 bg-rose-50/50 border border-rose-100 rounded-2xl text-rose-500 hover:bg-rose-100 transition-all flex items-center justify-center shadow-sm"
                  title="Delete Plan"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Plan Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingPlan ? "Update Subscription Plan" : "Create New Subscription Plan"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Name</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="e.g. Professional"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price (IDR)</label>
              <input 
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">User Limit</label>
              <input 
                type="number"
                value={formData.userLimit}
                onChange={(e) => setFormData({...formData, userLimit: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Features (Comma separated)</label>
            <textarea 
              value={formData.features.join(", ")}
              onChange={(e) => setFormData({...formData, features: e.target.value.split(",").map(s => s.trim())})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none min-h-[100px]"
            />
          </div>

          <div className="flex items-center gap-3 py-2">
            <input 
              type="checkbox"
              id="popular"
              checked={formData.isPopular}
              onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
              className="w-5 h-5 rounded-lg border-slate-300 text-[#008b8b] focus:ring-[#008b8b]"
            />
            <label htmlFor="popular" className="text-sm font-bold text-slate-700">Mark as Popular Plan</label>
          </div>

          <div className="pt-6 flex gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 bg-[#008b8b] text-white rounded-2xl text-xs font-bold shadow-lg shadow-[#008b8b]/20 hover:bg-[#007a7a] transition-all"
            >
              {editingPlan ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

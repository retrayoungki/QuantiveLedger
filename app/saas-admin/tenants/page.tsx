"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Building2, 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  ExternalLink,
  Calendar,
  Edit3,
  Users,
  X,
  Pencil
} from "lucide-react";
import { getAllCompanies, getUsersByTenant, updateUserData, deleteUser } from "@/lib/dataService";
import Modal from "@/components/Modal";

const dummyTenants = [
  {
    id: "kOXSvMCglatII-Ig8hW6po",
    name: "PT. Quantum Prima Kreasi",
    plan: "PROFESSIONAL",
    status: "ACTIVE",
    expiry: "2027-05-06",
  },
  {
    id: "E9jlDY1XGcvLOppFiWbn",
    name: "PT. Quantum Prima Konsultama",
    plan: "PROFESSIONAL",
    status: "ACTIVE",
    expiry: "2027-05-05",
  }
];

const dummyUsers = [
  { id: "u1", name: "Youngki", email: "youngkiretra@gmail.com", role: "Staff", status: "Active" }
];

export default function TenantManagement() {
  const [tenants, setTenants] = useState<any[]>(dummyTenants);
  const [tenantUsers, setTenantUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageUsersModalOpen, setIsManageUsersModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form States
  const [editFormData, setEditFormData] = useState({ name: "", plan: "Professional", status: "ACTIVE", expiry: "2027-12-31" });
  const [createFormData, setCreateFormData] = useState({ name: "", plan: "Professional", status: "ACTIVE", expiry: "2027-12-31" });
  const [userEditFormData, setUserEditFormData] = useState({ name: "", email: "", role: "Staff", status: "Active", password: "" });

  useEffect(() => {
    async function loadTenants() {
      try {
        const data = await getAllCompanies();
        if (data.length > 0) setTenants(data);
        else setTenants(dummyTenants);
      } catch (error) {
        setTenants(dummyTenants);
      } finally {
        setLoading(false);
      }
    }
    loadTenants();
  }, []);

  const handleEditClick = (tenant: any) => {
    setSelectedTenant(tenant);
    setEditFormData({
      name: tenant.name,
      plan: tenant.plan || "Professional",
      status: tenant.status || "ACTIVE",
      expiry: tenant.expiry || "2027-12-31"
    });
    setIsEditModalOpen(true);
  };

  const handleManageUsersClick = async (tenant: any) => {
    setSelectedTenant(tenant);
    setIsManageUsersModalOpen(true);
    setLoadingUsers(true);
    try {
      const users = await getUsersByTenant(tenant.id);
      setTenantUsers(users);
    } catch (error) {
      console.error("Error loading tenant users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleEditUserClick = (user: any) => {
    setSelectedUser(user);
    setUserEditFormData({
      name: user.displayName || user.name || "",
      email: user.email || "",
      role: user.role || "Staff",
      status: user.status || "Active",
      password: ""
    });
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    try {
      const updateData: any = {
        displayName: userEditFormData.name,
        email: userEditFormData.email,
        role: userEditFormData.role,
        status: userEditFormData.status
      };
      
      const res = await updateUserData(selectedUser.id || selectedUser.uid, updateData);
      if (res.success) {
        setTenantUsers(prev => prev.map(u => (u.id === selectedUser.id || u.uid === selectedUser.uid) ? { ...u, ...updateData } : u));
        setIsEditUserModalOpen(false);
      } else {
        alert("Failed to update user: " + res.error);
      }
    } catch (error) {
      alert("Error updating user: " + String(error));
    }
  };

  const handleDeleteUser = async (uid: string, name: string) => {
    if (confirm(`Are you sure you want to delete user ${name}?`)) {
      try {
        const res = await deleteUser(uid);
        if (res.success) {
          setTenantUsers(prev => prev.filter(u => (u.id !== uid && u.uid !== uid)));
        } else {
          alert("Failed to delete user: " + res.error);
        }
      } catch (error) {
        alert("Error deleting user: " + String(error));
      }
    }
  };

  const handleUpdateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    setTenants(prev => prev.map(t => t.id === selectedTenant.id ? { ...t, ...editFormData } : t));
    setIsEditModalOpen(false);
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const newTenant = { id: Math.random().toString(36).substring(7), ...createFormData };
    setTenants([newTenant, ...tenants]);
    setIsCreateModalOpen(false);
    setCreateFormData({ name: "", plan: "Professional", status: "ACTIVE", expiry: "2027-12-31" });
  };

  const handleDeleteTenant = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setTenants(prev => prev.filter(t => t.id !== id));
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight font-manrope">
            Tenant Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Monitor, authorize, and support your platform tenants.
          </p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#008b8b] px-6 py-3 rounded-2xl text-white text-sm font-bold shadow-xl shadow-[#008b8b]/20 hover:bg-[#007a7a] transition-all flex items-center gap-2 active:scale-95 group"
        >
          <Building2 size={20} className="group-hover:scale-110 transition-transform duration-300" />
          Add New Company
        </button>
      </div>

      <div className="glass-panel rounded-[2.5rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-white/40">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by company name or ID..."
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#008b8b]/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company / Tenant</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Plan</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Expiry</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-white/40 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-white/80 flex items-center justify-center font-black text-[#008b8b] border border-white/60 shadow-sm">
                        {tenant.name?.substring(0, 1) || 'T'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{tenant.name}</h4>
                        <span className="text-[10px] font-medium text-slate-400 font-mono tracking-tighter">{tenant.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="inline-block px-4 py-1.5 bg-white/60 text-slate-600 rounded-lg text-[10px] font-black tracking-widest border border-white/80 shadow-sm">{tenant.plan || 'PROFESSIONAL'}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest border ${tenant.status === 'ACTIVE' ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' : 'bg-rose-50/50 text-rose-600 border-rose-100'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${tenant.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      {tenant.status || 'ACTIVE'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-slate-700 text-sm font-bold tracking-tight">{tenant.expiry || '2027-12-31'}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-5">
                      <button 
                        onClick={() => { setSelectedTenant(tenant); setIsAddUserModalOpen(true); }} 
                        title="Add User"
                        className="text-[#008b8b] hover:scale-110 transition-transform"
                      >
                        <UserPlus size={22} />
                      </button>
                      <button 
                        onClick={() => handleEditClick(tenant)} 
                        title="Edit Tenant"
                        className="text-[#008b8b] hover:scale-110 transition-transform"
                      >
                        <Edit3 size={22} />
                      </button>
                      <button 
                        onClick={() => handleManageUsersClick(tenant)} 
                        title="Manage Users"
                        className="text-[#008b8b] hover:scale-110 transition-transform"
                      >
                        <Users size={22} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTenant(tenant.id, tenant.name)} 
                        title="Delete Tenant"
                        className="text-[#008b8b] hover:scale-110 transition-transform"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      
      {/* Edit Company Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Company">
        <div className="mb-8">
          <p className="text-slate-500 text-sm font-medium">Update details for <span className="text-[#008b8b] font-bold">{selectedTenant?.name}</span></p>
        </div>
        <form onSubmit={handleUpdateTenant} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Company Name</label>
            <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#008b8b]/10" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Plan</label>
              <select value={editFormData.plan} onChange={(e) => setEditFormData({...editFormData, plan: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none">
                <option value="Basic">Basic</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Status</label>
              <select value={editFormData.status} onChange={(e) => setEditFormData({...editFormData, status: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none">
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Expiry Date</label>
            <div className="relative">
              <input type="date" value={editFormData.expiry} onChange={(e) => setEditFormData({...editFormData, expiry: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none" />
              <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>
          <div className="pt-8 flex gap-4">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
            <button type="submit" className="flex-2 px-10 py-4 bg-[#008b8b] text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[#008b8b]/20 hover:bg-[#007a7a] transition-all">Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* Add User Modal */}
      <Modal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} title="Add Company User">
        <div className="mb-8">
          <p className="text-slate-500 text-sm font-medium">Registering user for <span className="text-[#008b8b] font-bold">{selectedTenant?.name}</span></p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); alert("User created successfully!"); setIsAddUserModalOpen(false); }} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Full Name</label>
            <input type="text" placeholder="Full Name" className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#008b8b]/10" required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Email Address</label>
            <input type="email" placeholder="user@company.com" className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#008b8b]/10" required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Temporary Password</label>
            <input type="password" placeholder="........." className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#008b8b]/10" required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">System Role</label>
            <select className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none">
              <option>Staff</option>
              <option>Manager</option>
              <option>Administrator</option>
            </select>
          </div>
          <div className="pt-8 flex gap-4">
            <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="flex-1 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
            <button type="submit" className="flex-2 px-10 py-4 bg-[#008b8b] text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[#008b8b]/20 hover:bg-[#007a7a] transition-all">Create User</button>
          </div>
        </form>
      </Modal>

      {/* Manage Users Modal */}
      <Modal isOpen={isManageUsersModalOpen} onClose={() => setIsManageUsersModalOpen(false)} title="Manage Users">
        <div className="flex justify-between items-start mb-8">
          <p className="text-slate-500 text-sm font-medium">Viewing users for <span className="text-[#008b8b] font-bold">{selectedTenant?.name}</span></p>
          <button onClick={() => { setIsManageUsersModalOpen(false); setIsEditModalOpen(true); }} className="flex items-center gap-2 text-[#008b8b] text-xs font-bold hover:underline">
            <Pencil size={14} />
            Edit Company
          </button>
        </div>

        <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] overflow-hidden mb-8">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name / Email</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Role</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white">
              {loadingUsers ? (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-slate-400 italic">Memuat data user...</td>
                </tr>
              ) : tenantUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-slate-400 italic">Tidak ada user terdaftar untuk tenant ini.</td>
                </tr>
              ) : (
                tenantUsers.map((user) => (
                  <tr key={user.id || user.uid} className="hover:bg-white/50 transition-colors">
                    <td className="px-8 py-5">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{user.displayName || user.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-500">{user.role}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEditUserClick(user)} className="text-[#008b8b] hover:scale-110 transition-transform"><Pencil size={16} /></button>
                        <button onClick={() => handleDeleteUser(user.id || user.uid, user.displayName || user.name)} className="text-[#008b8b] hover:scale-110 transition-transform"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button onClick={() => setIsManageUsersModalOpen(false)} className="px-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all">Done</button>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={isEditUserModalOpen} onClose={() => setIsEditUserModalOpen(false)} title="Edit User">
        <div className="mb-8">
          <p className="text-slate-500 text-sm font-medium">Update profile or reset password for <span className="text-[#008b8b] font-bold">{selectedUser?.displayName || selectedUser?.name}</span></p>
        </div>
        <form onSubmit={handleUpdateUser} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Full Name</label>
            <input type="text" value={userEditFormData.name} onChange={(e) => setUserEditFormData({...userEditFormData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none" required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Email Address</label>
            <input type="email" value={userEditFormData.email} onChange={(e) => setUserEditFormData({...userEditFormData, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none" required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">System Role</label>
            <select value={userEditFormData.role} onChange={(e) => setUserEditFormData({...userEditFormData, role: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none">
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">User Status</label>
            <select value={userEditFormData.status} onChange={(e) => setUserEditFormData({...userEditFormData, status: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none">
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-rose-500 uppercase tracking-[0.1em]">New Password (Optional)</label>
            <input type="password" placeholder="Leave blank to keep current" className="w-full px-6 py-4 bg-rose-50/30 border border-rose-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/10" />
          </div>
          <div className="pt-8 flex gap-4">
            <button type="button" onClick={() => setIsEditUserModalOpen(false)} className="flex-1 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
            <button type="submit" className="flex-2 px-10 py-4 bg-[#008b8b] text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[#008b8b]/20 hover:bg-[#007a7a] transition-all">Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* Create Tenant Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Register New Company">
        <form onSubmit={handleCreateTenant} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Company Name</label>
            <input type="text" value={createFormData.name} onChange={(e) => setCreateFormData({...createFormData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none" placeholder="e.g. PT. Baru Berjaya" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Initial Plan</label>
              <select value={createFormData.plan} onChange={(e) => setCreateFormData({...createFormData, plan: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none">
                <option value="Basic">Basic</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Set Expiry</label>
              <input type="date" value={createFormData.expiry} onChange={(e) => setCreateFormData({...createFormData, expiry: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none" />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-[#008b8b] text-white rounded-2xl text-xs font-bold shadow-lg shadow-[#008b8b]/20 flex items-center justify-center gap-2">
            <Plus size={18} />
            Register Company
          </button>
        </form>
      </Modal>
    </div>
  );
}

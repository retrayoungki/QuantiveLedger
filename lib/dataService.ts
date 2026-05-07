import { db } from "./firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  Timestamp,
  addDoc,
  deleteDoc,
  updateDoc 
} from "firebase/firestore";

export async function getSubscriptionPlans() {
  try {
    const colRef = collection(db, "subscription_plans");
    const q = query(colRef, orderBy("price", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
}

export async function addSubscriptionPlan(plan: any) {
  try {
    const colRef = collection(db, "subscription_plans");
    await addDoc(colRef, { ...plan, createdAt: Timestamp.now() });
    return { success: true };
  } catch (error) {
    console.error("Error adding plan:", error);
    return { success: false, error: String(error) };
  }
}

export async function updateSubscriptionPlan(id: string, plan: any) {
  try {
    const docRef = doc(db, "subscription_plans", id);
    await updateDoc(docRef, plan);
    return { success: true };
  } catch (error) {
    console.error("Error updating plan:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteSubscriptionPlan(id: string) {
  try {
    const docRef = doc(db, "subscription_plans", id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting plan:", error);
    return { success: false, error: String(error) };
  }
}

export async function getCOAData(tenantId?: string) {
  try {
    const basePath = tenantId && tenantId !== "global" ? `tenants/${tenantId}/accounting` : "accounting";
    const docRef = doc(db, basePath, "coa");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching COA:", error);
    return null;
  }
}

export async function updateCOAData(coa: any, tenantId?: string) {
  try {
    const basePath = tenantId && tenantId !== "global" ? `tenants/${tenantId}/accounting` : "accounting";
    const docRef = doc(db, basePath, "coa");
    await setDoc(docRef, coa);
    return { success: true };
  } catch (error) {
    console.error("Error updating COA:", error);
    return { success: false, error: String(error) };
  }
}

export async function getCompanyInfo(id?: string) {
  try {
    // If an ID is provided, fetch from the multi-tenant 'companies' collection
    if (id && id !== "global") {
      const docRef = doc(db, "companies", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Standardize the response to match the expected format { profile: { ... } }
        if (data.profile) return data;
        return { profile: data };
      }
    }

    // Default/Fallback to global settings
    const docRef = doc(db, "settings", "company");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return {
      profile: {
        name: "PT. Quantum Prima Konsultama",
        address: "Jl. Kaji No. 32, Petojo Utara",
        city: "Jakarta Pusat",
        phone: "",
        fax: "",
        npwp16: "",
        npwpEmail: "",
        npwpPhone: "",
        kpp: "",
        director: "",
        businessType: "",
        startYear: "2025-01-01",
        endYear: "2025-12-31"
      }
    };
  } catch (error) {
    console.error("Error fetching company info:", error);
    return null;
  }
}

export async function updateCompanyInfo(info: any, tenantId?: string) {
  try {
    if (tenantId && tenantId !== "global") {
      const docRef = doc(db, "companies", tenantId);
      await setDoc(docRef, info, { merge: true });
      return { success: true };
    }
    const docRef = doc(db, "settings", "company");
    await setDoc(docRef, info);
    return { success: true };
  } catch (error) {
    console.error("Error updating company info:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getCompanyById(id: string) {
  try {
    const docRef = doc(db, "companies", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    return null;
  }
}

export async function getJournals(tenantId?: string) {
  try {
    const basePath = tenantId && tenantId !== "global" ? `tenants/${tenantId}/transactions` : "transactions";
    const docRef = doc(db, basePath, "general_journals");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching journals:", error);
    return [];
  }
}

export async function saveJournals(journals: any[], tenantId?: string) {
  try {
    const basePath = tenantId && tenantId !== "global" ? `tenants/${tenantId}/transactions` : "transactions";
    const docRef = doc(db, basePath, "general_journals");
    await setDoc(docRef, { data: journals });
    return { success: true };
  } catch (error) {
    console.error("Error updating journals:", error);
    return { success: false, error: String(error) };
  }
}

export async function getVouchers(tenantId?: string) {
  try {
    const basePath = tenantId && tenantId !== "global" ? `tenants/${tenantId}/transactions` : "transactions";
    const docRef = doc(db, basePath, "cash_bank_vouchers");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
}

export async function saveVouchers(vouchers: any[], tenantId?: string) {
  try {
    const basePath = tenantId && tenantId !== "global" ? `tenants/${tenantId}/transactions` : "transactions";
    const docRef = doc(db, basePath, "cash_bank_vouchers");
    await setDoc(docRef, { data: vouchers });
    return { success: true };
  } catch (error) {
    console.error("Error updating vouchers:", error);
    return { success: false, error: String(error) };
  }
}

export async function getAllCompanies() {
  try {
    const colRef = collection(db, "companies");
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate()?.toISOString() || null
    }));
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function getRecentCompanies(num = 5) {
  try {
    const colRef = collection(db, "companies");
    const q = query(colRef, orderBy("createdAt", "desc"), limit(num));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate()?.toISOString() || null
    }));
  } catch (error) {
    console.error("Error fetching recent companies:", error);
    return [];
  }
}

export async function getSaaSMetrics() {
  try {
    const companies = await getAllCompanies();
    const activeTenants = companies.length;
    const suspendedAccounts = companies.filter((c: any) => c.status === 'SUSPENDED').length;
    
    const journals = await getJournals();
    const vouchers = await getVouchers();
    
    let totalRevenue = 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    let monthlyRevenue = 0;

    const processTransaction = (date: string, amount: number) => {
      totalRevenue += amount;
      const d = new Date(date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        monthlyRevenue += amount;
      }
    };

    journals.forEach((j: any) => {
      (j.details || []).forEach((e: any) => {
        if (e.accountCode?.startsWith('4')) {
          processTransaction(j.date, parseFloat(e.credit) || 0);
        }
      });
    });

    vouchers.forEach((v: any) => {
      if (String(v.type).toUpperCase().includes('MASUK')) {
        (v.details || []).forEach((e: any) => {
          if (e.accountCode?.startsWith('4')) {
            processTransaction(v.date, parseFloat(e.amount) || 0);
          }
        });
      }
    });

    return {
      activeTenants,
      suspendedAccounts,
      monthlyRevenue,
      totalRevenue
    };
  } catch (error) {
    console.error("Error fetching SaaS metrics:", error);
    return {
      activeTenants: 0,
      suspendedAccounts: 0,
      monthlyRevenue: 0,
      totalRevenue: 0
    };
  }
}
export async function getUsersByTenant(tenantId: string) {
  try {
    const colRef = collection(db, "users");
    const q = query(colRef, where("assignedCompanies", "array-contains", tenantId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching tenant users:", error);
    return [];
  }
}

export async function updateUserData(uid: string, data: any) {
  try {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, data);
    return { success: true };
  } catch (error) {
    console.error("Error updating user data:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteUser(uid: string) {
  try {
    const docRef = doc(db, "users", uid);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: String(error) };
  }
}

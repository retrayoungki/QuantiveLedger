"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Company } from "@/lib/roles";
import { useAuth } from "./AuthContext";
import { getCompanyInfo, getCompanyById } from "@/lib/dataService";

interface CompanyContextType {
  activeCompany: Company | null;
  setActiveCompany: (company: Company) => void;
  availableCompanies: Company[];
  loadingCompanies: boolean;
}

const CompanyContext = createContext<CompanyContextType>({
  activeCompany: null,
  setActiveCompany: () => {},
  availableCompanies: [],
  loadingCompanies: true,
});

export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useAuth();
  const [activeCompany, setActiveCompany] = useState<Company | null>({
    id: "1",
    name: "Quantive Ledger",
    code: "QL"
  });
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([{
    id: "1",
    name: "Quantive Ledger",
    code: "QL"
  }]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoadingCompanies(true);
        
        // 1. Get assigned company IDs from user data
        const assignedIds = userData?.assignedCompanies || [];
        
        if (assignedIds.length > 0) {
          // 2. Fetch details for each assigned company
          const companiesPromises = assignedIds.map(id => getCompanyById(id));
          const results = await Promise.all(companiesPromises);
          
          const validCompanies: Company[] = results
            .filter(r => r !== null)
            .map((r, index) => ({
              id: assignedIds[index],
              name: r.name || r.profile?.name || "Unnamed Company",
              code: r.code || "CMP"
            }));
            
          if (validCompanies.length > 0) {
            setAvailableCompanies(validCompanies);
            setActiveCompany(validCompanies[0]);
          } else {
            // Fallback to global setting if none found in companies collection
            const globalInfo = await getCompanyInfo();
            const fallback: Company = {
              id: "global",
              name: globalInfo?.profile?.name || "PT. Quantum Prima Konsultama",
              code: "QL"
            };
            setAvailableCompanies([fallback]);
            setActiveCompany(fallback);
          }
        } else {
          // No companies assigned to this specific user - fallback to global or default
          const globalInfo = await getCompanyInfo();
          const fallback: Company = {
            id: "global",
            name: globalInfo?.profile?.name || "PT. Quantum Prima Konsultama",
            code: "QL"
          };
          setAvailableCompanies([fallback]);
          setActiveCompany(fallback);
        }
      } catch (error) {
        console.error("Failed to load companies:", error);
      } finally {
        setLoadingCompanies(false);
      }
    }
    
    if (userData) {
      // Safety timeout to prevent stuck "LOADING" state
      const timeoutId = setTimeout(() => {
        setLoadingCompanies(false);
      }, 5000);

      fetchCompanies().then(() => clearTimeout(timeoutId));
    } else {
      setAvailableCompanies([{
        id: "default",
        name: "Quantive Ledger",
        code: "QL"
      }]);
      setActiveCompany({
        id: "default",
        name: "Quantive Ledger",
        code: "QL"
      });
      setLoadingCompanies(false);
    }
  }, [userData]);

  return (
    <CompanyContext.Provider value={{ activeCompany, setActiveCompany, availableCompanies, loadingCompanies }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);

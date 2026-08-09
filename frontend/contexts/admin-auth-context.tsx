import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCurrentAdmin } from '../features/admin-auth/hooks/use-current-admin';
import { AdminTokenStorage } from '../features/admin-auth/storage/admin-token-storage';

interface AdminAuthContextType {
  admin: any | null;
  isLoading: boolean;
  isInitializing: boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const { data: admin, isLoading, refetch } = useCurrentAdmin();

  useEffect(() => {
    if (!isLoading) {
      setIsInitializing(false);
    }
  }, [isLoading]);

  const logout = () => {
    AdminTokenStorage.clearTokens();
    window.location.href = '/admin/login';
  };

  return (
    <AdminAuthContext.Provider value={{ admin: admin || null, isLoading, isInitializing, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

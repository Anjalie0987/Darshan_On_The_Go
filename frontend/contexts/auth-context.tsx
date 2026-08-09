'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { User } from '@/features/auth/services/auth-service';
import { TokenStorage } from '@/features/auth/storage/token-storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading: isUserLoading, isError } = useCurrentUser();
  
  // Start with loading = true to prevent flashing unauthenticated state
  // if we have tokens in storage that we need to verify.
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const hasToken = !!TokenStorage.getAccessToken() || !!TokenStorage.getRefreshToken();
    
    if (!hasToken) {
      // No token to verify, finish initialization immediately
      setIsInitializing(false);
    } else if (!isUserLoading) {
      // Query finished loading (success or error)
      setIsInitializing(false);
    }
  }, [isUserLoading]);

  // If there's an error fetching the user (e.g. 401), useCurrentUser hook 
  // will throw or the interceptor will clear tokens, and user will be undefined.
  const currentUser = user || null;
  const isAuthenticated = !!currentUser;
  
  // Combined loading state: true while React Query fetches OR initial check is pending
  const isLoading = isInitializing || isUserLoading;

  return (
    <AuthContext.Provider value={{ user: currentUser, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

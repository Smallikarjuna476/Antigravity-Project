import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginAsRole: (role: UserRole) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_CREDENTIALS: Record<UserRole, { email: string; pass: string; name: string }> = {
  farmer: { email: 'farmer@agrisense.ai', pass: 'password123', name: 'Ramesh Gowda (Farmer)' },
  officer: { email: 'officer@agrisense.ai', pass: 'password123', name: 'Dr. Sunita Deshmukh (Agri Officer)' },
  researcher: { email: 'researcher@agrisense.ai', pass: 'password123', name: 'Prof. Arvind Swaminathan (Researcher)' },
  admin: { email: 'admin@agrisense.ai', pass: 'adminpassword123', name: 'AgriSense Super Admin' }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('agrisense_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('agrisense_token');
      const savedUser = localStorage.getItem('agrisense_user');
      
      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          // Refresh in background
          const freshUser = await authApi.getProfile();
          setUser(freshUser);
          localStorage.setItem('agrisense_user', JSON.stringify(freshUser));
        } catch {
          // Keep local fallback or clear if invalid
        }
      } else {
        // Auto-initialize demo farmer for frictionless immediate usage
        try {
          await loginAsRole('farmer');
        } catch {
          // Ignored if offline
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email, pass);
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('agrisense_token', data.access_token);
      localStorage.setItem('agrisense_user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsRole = async (role: UserRole) => {
    const creds = DEMO_CREDENTIALS[role];
    if (creds) {
      await login(creds.email, creds.pass);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const data = await authApi.register(userData);
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('agrisense_token', data.access_token);
      localStorage.setItem('agrisense_user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agrisense_token');
    localStorage.removeItem('agrisense_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsRole,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

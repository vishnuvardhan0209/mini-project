import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<any>;
  loginDemo: () => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('agy_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and verify session on load / refresh
  useEffect(() => {
    async function verifySession() {
      const token = localStorage.getItem('agy_token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('agy_user', JSON.stringify(res.user));
        } else {
          localStorage.removeItem('agy_token');
          localStorage.removeItem('agy_user');
          setUser(null);
        }
      } catch (err) {
        console.warn('Session verification error, resetting session:', err);
        localStorage.removeItem('agy_token');
        localStorage.removeItem('agy_user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    verifySession();
  }, []);

  const login = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.token) {
        localStorage.setItem('agy_token', res.token);
      }
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('agy_user', JSON.stringify(res.user));
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    return await login('alex.kumar@example.com', 'password123');
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      if (res.token) {
        localStorage.setItem('agy_token', res.token);
      }
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('agy_user', JSON.stringify(res.user));
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout().catch(() => {});
    localStorage.removeItem('agy_token');
    localStorage.removeItem('agy_user');
    setUser(null);
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      const res = await api.updateProfile(updates);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('agy_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginDemo,
        register,
        logout,
        updateUserProfile
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

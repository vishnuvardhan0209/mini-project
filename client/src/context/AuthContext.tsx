import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default Alex Kumar fallback state so app is pre-authenticated for seamless demo
const DEFAULT_DEMO_USER: User = {
  id: 'user-alex-kumar',
  name: 'Alex Kumar',
  email: 'alex.kumar@example.com',
  college: 'National Institute of Technology',
  degree: 'B.Tech in Computer Science & Engineering',
  targetRole: 'Java Backend Developer',
  skills: ['Java', 'Spring Boot', 'SQL', 'Git', 'DSA', 'REST APIs', 'PostgreSQL', 'Docker (Basics)'],
  createdAt: '2026-08-15T10:00:00.000Z'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('agy_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_DEMO_USER;
      }
    }
    return DEFAULT_DEMO_USER;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('agy_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agy_user');
    }
  }, [user]);

  const login = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.warn('Backend offline or error, falling back to demo user:', err);
      setUser(DEFAULT_DEMO_USER);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    await login('alex.kumar@example.com', 'password123');
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      if (res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.warn('Using client-side registration fallback:', err);
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name || 'Alex Kumar',
        email: data.email || 'alex.kumar@example.com',
        college: data.college || 'Engineering Institute',
        degree: data.degree || 'B.Tech CS',
        targetRole: data.targetRole || 'Software Engineer',
        skills: ['Java', 'SQL', 'Git'],
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agy_user');
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      await api.updateProfile(updated);
    } catch (err) {
      console.warn('Profile update locally persisted:', err);
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

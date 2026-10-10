'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginRequest, RegisterRequest, UpdateProfileRequest } from '@/types';
import { authService } from '@/services/authService';
import { mockAdapter } from '@/services/mock/mockAdapter';
import { socketService } from '@/services/socketService';
import { DEMO_USERS } from '@/config/constants';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (req: LoginRequest) => Promise<void>;
  register: (req: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (req: UpdateProfileRequest) => Promise<void>;
  switchUser: (userId: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  switchUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial session loading
    const activeMockUser = mockAdapter.getCurrentUser();
    setUser(activeMockUser);
    socketService.registerUser(activeMockUser.id);
    setIsLoading(false);
  }, []);

  const login = async (req: LoginRequest) => {
    setIsLoading(true);
    try {
      const res = await authService.login(req);
      setUser(res.user);
      mockAdapter.setCurrentUserId(res.user.id);
      socketService.registerUser(res.user.id);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (req: RegisterRequest) => {
    setIsLoading(true);
    try {
      const res = await authService.register(req);
      setUser(res.user);
      mockAdapter.setCurrentUserId(res.user.id);
      socketService.registerUser(res.user.id);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (req: UpdateProfileRequest) => {
    const updated = await authService.updateProfile(req);
    setUser(updated);
  };

  const switchUser = (userId: number) => {
    const selected = DEMO_USERS.find((u) => u.id === userId);
    if (selected) {
      const switched: User = {
        id: selected.id,
        name: selected.name,
        email: selected.email,
        avatar: selected.avatar,
        instapayHandle: selected.instapayHandle,
        phoneNumber: selected.phoneNumber,
      };
      mockAdapter.setCurrentUserId(switched.id);
      setUser(switched);
      socketService.registerUser(switched.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

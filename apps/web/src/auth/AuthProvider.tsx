import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, type LoginDTO } from '../services';
import { logger } from '../utils';

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

interface AuthContextValue {
  currentUser: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  readonly children: React.ReactNode;
}

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bootstrapSession = useCallback(async () => {
    try {
      const [token, storedUser] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('user'),
      ]);

      if (!token || !storedUser) {
        setCurrentUser(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser) as AuthUser;
      if (parsedUser?.id && parsedUser?.email) {
        setCurrentUser(parsedUser);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      logger.error('Failed to restore session:', error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  const login = useCallback(async (credentials: LoginDTO) => {
    const response = await authService.login(credentials);
    setCurrentUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({ currentUser, isLoading, login, logout }),
    [currentUser, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

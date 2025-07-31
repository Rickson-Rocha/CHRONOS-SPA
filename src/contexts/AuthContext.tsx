import { createContext, useState, useContext, useEffect } from 'react';
import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/ApiService';
import type { LoginCredentials, UserProfile } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiService.login(credentials);
      const { token, ...userData } = response;

    
      localStorage.setItem('accessToken', token.accessToken);
      localStorage.setItem('refreshToken', token.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);

      
      if (userData.role === 'ROLE_MANAGER') {
        navigate('/manager/home');
      } else {
        navigate('/employee/point-list');
      }
    } catch (error) {
      console.error("Falha no login", error);
    
      throw new Error('Email ou senha inválidos.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any; // Remplacez `any` par le type approprié si vous avez un modèle utilisateur défini
  login: (user: any) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Fournissez des valeurs par défaut pour éviter les nullités
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setIsAuthenticated(true);
      setUser(user);
    }
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

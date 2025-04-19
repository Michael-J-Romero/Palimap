import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // your existing logic
  const [isAdminDevMode, setIsAdminDevMode] = useState(false);

  const isAdmin = user?.roles?.includes('admin') || isAdminDevMode;

  const toggleAdminMode = () => setIsAdminDevMode(prev => !prev);

  const value = {
    user,
    isAdmin,
    toggleAdminMode,
    isAdminDevMode,
    // ...login/logout/etc
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

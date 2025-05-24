// AppContext.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appState, setAppState] = useState({
    user: null,
    isLoggedIn: false,
    theme: 'light',
    notifications: [],
    // add more shared state here
  });

  const updateAppState = (updates) => {
    setAppState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{ appState, updateAppState }}>
      {children}
    </AppContext.Provider>
  );
};

import React, { createContext, useState, useEffect } from 'react';

export const ClientUserContext = createContext();

export const ClientUserProvider = ({ children }) => {
  const [clientUser, setClientUser] = useState(() => {
    // Get the initial state from localStorage if available
    const savedClientUser = localStorage.getItem('clientUser');
    return savedClientUser ? JSON.parse(savedClientUser) : null;
  });

  useEffect(() => {
    // Update localStorage whenever the clientUser state changes
    if (clientUser) {
      localStorage.setItem('clientUser', JSON.stringify(clientUser));
    } else {
      localStorage.removeItem('clientUser');
    }
  }, [clientUser]);

  return (
    <ClientUserContext.Provider value={{ clientUser, setClientUser }}>
      {children}
    </ClientUserContext.Provider>
  );
};

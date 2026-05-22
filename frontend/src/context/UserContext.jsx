import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('petzone-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('petzone-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('petzone-user');
    }
  }, [user]);

  const login = (email, password) => {
    // Simular un inicio de sesión
    setTimeout(() => {
      setUser({ name: email.split('@')[0], email });
    }, 500);
  };

  const register = (name, email, password) => {
    // Simular un registro
    setTimeout(() => {
      setUser({ name, email });
    }, 500);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

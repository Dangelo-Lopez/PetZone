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

  const login = async (email, password) => {
    const response = await fetch('http://localhost:8081/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      setUser(data.user);
      return { success: true, message: data.message };
    }

    return { success: false, message: data.message };
  };

  const register = async (nombre, email, password, direccion = '', telefono = '') => {
    const response = await fetch('http://localhost:8081/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre,
        email,
        password,
        direccion,
        telefono,
        rol: 'USER',
      }),
    });

    const data = await response.json();

    if (data.success) {
      setUser(data.user);
      return { success: true, message: data.message };
    }

    return { success: false, message: data.message };
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
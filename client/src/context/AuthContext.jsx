import { createContext, useContext, useState } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('aerodrive_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (credentials) => {
    const { data } = await axios.post('/auth/login', credentials);
    localStorage.setItem('aerodrive_token', data.data.token);
    localStorage.setItem('aerodrive_user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = () => {
    localStorage.removeItem('aerodrive_token');
    localStorage.removeItem('aerodrive_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

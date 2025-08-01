"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

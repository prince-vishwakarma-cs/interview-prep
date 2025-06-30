import React, { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../utils/axios";
import { API_PATHS } from "../utils/api";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error("User not authenticated",error)
        clearUser()
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token); // Save token
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token"); // Optionally clear token on logout
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
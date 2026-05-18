import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Check auth state
  const getAuthState = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/is-auth`);

      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      // if (error.response?.status !== 401) {
      //   // toast.error(
      //   //   error.response?.data?.message || error.message
      //   // );
      // }

      if (error.response?.status !== 401) {
        toast.error("An error occurred."); 
      }

      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  // Get logged in user data
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!backendUrl) {
      console.error("VITE_BACKEND_URL is missing");
      return;
    }

    getAuthState();
  }, [backendUrl]);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};

import axios from 'axios';
import { createContext } from 'react';
axios.defaults.withCredentials = true; 

// import React, { createContext, useEffect, useState } from 'react';
// import { toast } from 'react-toastify';

export const appContent = createContext();

export const AppContextProvider = ({ children }) => {
  // const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userData, setUserData] = useState(false);

  // const getAuthState = async () => {
  //   try {
  //     const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
  //     if (data.success) {
  //       setIsLoggedIn(true);
  //       getUserData();
  //     } else {
  //       setIsLoggedIn(false);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //     setIsLoggedIn(false);
  //   }
  // };

  // const getUserData = async () => {
  //   try {
  //     const { data } = await axios.get(backendUrl + "/api/user/data");
  //     data.success ? setUserData(data.userData) : toast.error(data.message);
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  // useEffect(() => {
  //   getAuthState();
  // }, []);

  const value = {
    // backendUrl,
    // isLoggedIn,
    // setIsLoggedIn,
    // userData,
    // setUserData,
    // getUserData,
  };

  return (
    <appContent.Provider value={value}>
      {children}
    </appContent.Provider>
  );
};

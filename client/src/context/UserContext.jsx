import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext({
  user: null,  // Default user value is null
  setUserDetails: () => {}  // Default function to avoid undefined errors
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user data is saved in localStorage
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);  // Load saved user data
    }
  }, []);

  const setUserDetails = (userDetails) => {
    setUser(userDetails);
    localStorage.setItem('user', JSON.stringify(userDetails));  // Save user data to localStorage
  };

  return (
    <UserContext.Provider value={{ user, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

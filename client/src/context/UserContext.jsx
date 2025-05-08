import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext({
  user: null,
  setUserDetails: () => {},
  isLoading: true // Add loading state
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const setUserDetails = (userDetails) => {
    try {
      setUser(userDetails);
      localStorage.setItem('user', JSON.stringify(userDetails));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUserDetails, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
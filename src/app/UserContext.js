import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    // Fetch user data from your API (MongoDB backend)
    async function fetchUser() {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched user data:", data); // <-- Debug log
          setUser(data);
        } else {
          setUser(null);
          setError("Failed to fetch user");
        }
      } catch (err) {
        setUser(null);
        setError("Network error");
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    // Return a default value to avoid destructuring errors
    return { user: null, loading: false, error: null };
  }
  return context;
}

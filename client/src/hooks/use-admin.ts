import { useState, useEffect } from "react";

interface Admin {
  id: number;
  email: string;
}

export function useAdmin() {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    // Check if admin is stored in localStorage
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        localStorage.removeItem("admin");
      }
    }
  }, []);

  const login = (adminData: Admin) => {
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  return {
    admin,
    login,
    logout,
    isAuthenticated: !!admin,
  };
}

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  id: string;
  username: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Optional: Auto-login if user is found in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post("/api/signin", {
        username,
        password,
      });

      if (response.status === 200) {
        const loggedInUser = response.data.user;
        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        router.push("/dashboard"); // Redirect after login
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Failed to login");
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const response = await axios.post("/api/signup", {
        username,
        password,
      });

      if (response.status === 200) {
        // After signup, automatically log the user in
        const newUser = response.data.user;
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        router.push("/dashboard"); // Redirect after signup
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Failed to signup");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

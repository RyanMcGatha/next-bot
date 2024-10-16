"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // To redirect users to /dashboard

interface Error {
  message: string;
}

export default function HomePage() {
  const { login, signup, logout, user } = useAuth(); // Add `signup` method from AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(true); // Toggle between login/signup
  const router = useRouter(); // For navigation

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await login(username, password);
    } catch (error) {
      if ((error as Error).message.includes("user-not-found")) {
        setIsExistingUser(false); // Switch to sign-up mode if user not found
      } else {
        console.error("Failed to login:", error);
      }
    }
  };

  const handleSignup = async () => {
    try {
      await signup(username, password);
      router.push("/dashboard"); // Redirect to dashboard after sign-up
    } catch (error) {
      console.error("Failed to sign up:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg font-semibold mb-4">
            Logged in as: {user.username}
          </p>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md w-80 text-black">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isExistingUser ? "Login" : "Sign Up"}
          </h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full mb-4 px-3 py-2 border rounded text-black"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full mb-6 px-3 py-2 border rounded text-black"
          />
          <button
            onClick={isExistingUser ? handleLogin : handleSignup}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isExistingUser ? "Login" : "Sign Up"}
          </button>
          <p
            className="mt-4 text-center text-sm text-gray-600 cursor-pointer"
            onClick={() => setIsExistingUser(!isExistingUser)}
          >
            {isExistingUser
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </p>
        </div>
      )}
    </div>
  );
}

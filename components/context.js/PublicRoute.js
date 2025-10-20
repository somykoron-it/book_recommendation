"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

const PublicRoute = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Wait for auth state to load
    if (isLoggedIn === null) return; // still loading

    if (isLoggedIn) {
      // Redirect logged-in users to /explore
      router.replace("/explore");
    } else {
      setChecking(false); // Allow rendering for public users
    }
  }, [isLoggedIn, router]);

  if (checking || isLoggedIn === null) {
    // Show loader while checking auth
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  return children;
};

export default PublicRoute;

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for AuthProvider to fetch user
    if (isLoggedIn === null) return; // still loading
    if (!isLoggedIn) {
      router.replace("/"); // redirect to login/home
    } else {
      setLoading(false); // user is logged in
    }
  }, [isLoggedIn, router]);

  if (loading || isLoggedIn === null) {
    // show a loader while checking auth
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PublicRoute = ({ children }) => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      // Redirect logged-in users to /home
      router.replace("/explore");
    } else {
      setChecking(false); // Allow rendering for public
    }
  }, [router]);

  if (checking) return null; // Or a loading spinner

  return children;
};

export default PublicRoute;

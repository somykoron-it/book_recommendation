"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      setAuthorized(true);
    } else {
      router.replace("/"); // redirect to login/home
    }
  }, [router]);

  if (!authorized) return null; // or loading spinner

  return children;
};

export default PrivateRoute;

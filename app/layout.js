// app/layout.js (server component)
import "./globals.css";
import { Merriweather, Open_Sans } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/LandingPage/Navbar";
import { LoaderProvider } from "../components/context.js/LoaderContext";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { AuthProviderClient } from "@/components/context.js/AuthContext";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default async function RootLayout({ children }) {
  // Read the cookie on the server
  const token = cookies().get("token")?.value;
  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      user = { _id: decoded.userId };
    } catch (err) {
      console.log("Invalid token", err);
    }
  }

  return (
    <html lang="en">
      <body
        className={`${merriweather.variable} ${openSans.variable} antialiased bg-white min-h-screen flex flex-col`}
      >
        <LoaderProvider>
          <AuthProviderClient initialUser={user}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              toastStyle={{ backgroundColor: "#1e3a8a", color: "#fff" }}
            />
          </AuthProviderClient>
        </LoaderProvider>
      </body>
    </html>
  );
}

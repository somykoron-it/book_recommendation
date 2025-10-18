import "./globals.css";
import { Merriweather, Open_Sans } from "next/font/google";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/LandingPage/Navbar";
import { LoaderProvider } from "../components/context.js/LoaderContext";

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

export const metadata = {
  title: "Book Library",
  description: "Explore and manage your favorite books with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${merriweather.variable} ${openSans.variable} antialiased bg-white min-h-screen flex flex-col`}
      >
        <LoaderProvider>
          <Navbar />

          {/* Page content */}
          <main className="flex-1">{children}</main>

          {/* Toast Notifications */}
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
            toastStyle={{
              backgroundColor: "#1e3a8a",
              color: "#fff",
            }}
          />
        </LoaderProvider>
      </body>
    </html>
  );
}

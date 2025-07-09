"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setIsUserDropdownOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogin = () => {
    setUser({ name: "John Doe", email: "john@example.com" });
    router.push("/dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setIsUserDropdownOpen(false);
    router.push("/");
  };

  const navLinks = [
    { href: "/features", label: "Features" },
    // { href: "/templates", label: "Templates" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg transform group-hover:rotate-6 transition-transform duration-300"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                className="h-10 w-10 relative"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 20 Q30 10 50 20 V80 Q30 70 10 80 Z" fill="white" />
                <path d="M50 20 Q70 10 90 20 V80 Q70 70 50 80 Z" fill="white" />
                <path
                  d="M50 35 L52 40 L57 41 L52 42 L50 47 L48 42 L43 41 L48 40 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="ml-2 text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Inkspire
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex space-x-8 ml-10">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-1 font-semibold transition-colors duration-200 ${
                  isActive(href)
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                {label}
                {isActive(href) && (
                  <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-600 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth + Hamburger */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                  }}
                  className="flex items-center space-x-2"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline text-sm text-gray-700">
                    {user.name.split(" ")[0]}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isUserDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-100 rounded-md py-2 z-50">
                    <div className="px-4 py-2 border-b text-sm">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-t"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden lg:inline  text-gray-600 hover:text-indigo-600 font-semibold transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile/Tablet Hamburger */}
            <button
              className="lg:hidden text-gray-500 hover:text-gray-800 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center text-center space-y-6 text-lg font-medium overflow-hidden">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 ${
                isActive(href)
                  ? "text-indigo-600 font-semibold"
                  : "text-gray-700 hover:text-indigo-600"
              }`}
            >
              {label}
            </Link>
          ))}

          {!user ? (
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-indigo-600"
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-indigo-600"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

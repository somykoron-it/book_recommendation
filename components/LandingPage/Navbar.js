"use client";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in on client side
    const loggedIn = localStorage.getItem("isLoggedIn") ? true : false;
    setIsLoggedIn(loggedIn);
  }, []);

  const navItems = [
    { label: "Explore", href: "/explore" },
    { label: "My Books", href: "/my-books" },
    { label: "Social", href: "/social" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
            >
              BookWise
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Notification Bell */}
                <Link
                  href="/notifications"
                  className="relative flex items-center justify-center rounded-lg h-9 w-9 hover:bg-accent transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </Link>

                {/* User Avatar with Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative h-8 w-8 rounded-full hover:opacity-80 transition-opacity">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="User"
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/notifications" className="cursor-pointer">
                        Notifications
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Not logged in state
              <div className="hidden sm:flex gap-2">
                <Link
                  href="/login"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/10 text-primary dark:bg-primary/20 dark:hover:bg-primary/30 hover:bg-primary/20 text-sm font-bold leading-normal tracking-wide transition-colors"
                >
                  <span className="truncate">Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors"
                >
                  <span className="truncate">Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden flex items-center justify-center rounded-lg h-9 w-9 hover:bg-accent transition-colors">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Navigation */}
                  <div className="flex-1 p-6">
                    <nav className="flex flex-col space-y-4">
                      {navItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${
                            isActive(item.href)
                              ? "text-primary bg-primary/10"
                              : "text-foreground hover:text-primary hover:bg-accent"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>

                    {/* Additional mobile menu items for logged in users */}
                    {isLoggedIn && (
                      <div className="pt-6 mt-6 border-t">
                        <div className="flex flex-col space-y-4">
                          <Link
                            href="/notifications"
                            className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${
                              isActive("/notifications")
                                ? "text-primary bg-primary/10"
                                : "text-foreground hover:text-primary hover:bg-accent"
                            }`}
                          >
                            Notifications
                          </Link>
                          <Link
                            href="/profile"
                            className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${
                              isActive("/profile")
                                ? "text-primary bg-primary/10"
                                : "text-foreground hover:text-primary hover:bg-accent"
                            }`}
                          >
                            Profile
                          </Link>
                          <Link
                            href="/settings"
                            className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${
                              isActive("/settings")
                                ? "text-primary bg-primary/10"
                                : "text-foreground hover:text-primary hover:bg-accent"
                            }`}
                          >
                            Settings
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Auth Buttons */}
                  {!isLoggedIn && (
                    <div className="p-6 border-t bg-muted/20">
                      <div className="flex flex-col gap-3">
                        <Link
                          href="/login"
                          className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary/10 text-primary dark:bg-primary/20 dark:hover:bg-primary/30 hover:bg-primary/20 text-sm font-bold leading-normal tracking-wide transition-colors"
                        >
                          <span className="truncate">Login</span>
                        </Link>
                        <Link
                          href="/register"
                          className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors"
                        >
                          <span className="truncate">Sign Up</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Logout button for mobile */}
                  {isLoggedIn && (
                    <div className="p-6 border-t bg-muted/20">
                      <button
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-bold leading-normal tracking-wide transition-colors"
                      >
                        <span className="truncate">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

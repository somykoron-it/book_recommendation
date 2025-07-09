"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import { toast } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";

// Define form schema
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/\d/, "Password must include at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must include at least one special character"
    ),
});

export default function RegisterForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Redirecting to login...");
        router.push("/login?registered=true");
      } else {
        setError(
          result.message || "Registration failed. Please try again."
        );
        toast.error("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);
    try {
      window.location.href = "/api/auth/google";
    } catch (err) {
      console.error("Google sign-up error:", err);
      setError("Failed to initiate Google sign-up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <Link
        href="/"
        className="absolute top-4 left-4 hidden lg:flex items-center px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
      >
        <FiArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100/50 backdrop-blur-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Welcome and Logo */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 flex flex-col justify-center items-start text-white">
            <div className="flex items-center mb-6">
              <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    dscoreboard
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Create Your <span className="text-white">Inkspire</span> Account
            </h2>
            <p className="mt-4 text-sm opacity-90 max-w-xs">
              Join our community of book lovers and start your reading
              adventure.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="py-8 px-6 lg:px-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-center">
                <svg
                  className="h-5 w-5 text-red-500 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-red-700">
                  {error}
                </span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <Input
                id="username"
                type="text"
                label="Username"
                register={register("username")}
                error={errors.username?.message}
                autoComplete="username"
              />

              <Input
                id="email"
                type="email"
                label="Email address"
                register={register("email")}
                error={errors.email?.message}
                autoComplete="email"
              />

              <Input
                id="password"
                type="password"
                label="Password"
                register={register("password")}
                error={errors.password?.message}
                autoComplete="new-password"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200"
                    >
                      Terms of Service
                    </Link>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-md text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] ${
                  isLoading ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.24 10.667H6.614v2.666h5.626c-.532 2.666-2.826 4-5.626 4-3.333 0-6-2.667-6-6s2.667-6 6-6c1.593 0 2.826.666 3.893 1.666l1.893-1.893C10.24 2.667 8.347 2 6.614 2 2.947 2 0 4.947 0 8.667s2.947 6.666 6.614 6.666c3.893 0 6.373-2.666 6.373-6.666 0-.373-.04-.706-.107-1z"
                      fill="#FFC107"
                    />
                    <path
                      d="M24 8.667c0-.667-.053-1.333-.213-1.947H12.24v3.947h6.666c-.293 1.6-1.173 2.96-2.373 3.867l1.893 1.466c1.387-1.28 2.347-3.2 2.347-5.333"
                      fill="#00AC47"
                    />
                    <path
                      d="M6.614 14c-.906 0-1.733-.293-2.373-.8l-1.893 1.467c1.333 2.133 3.733 3.533 6.266 3.533 2.027 0 3.947-.667 5.267-1.813l-1.893-1.467c-1.093.734-2.453 1.08-3.974 1.08"
                      fill="#EA4335"
                    />
                    <path
                      d="M12.347 6.533c1.52 0 2.88.534 3.947 1.574l1.893-1.894c-1.333-1.24-3.253-2-5.84-2-2.533 0-4.933 1.4-6.266 3.533L7.974 9.24c.64-.507 1.467-.707 2.373-.707"
                      fill="#3C79E6"
                    />
                  </svg>
                  Sign up with Google
                </button>
              </div>
            </div> */}

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
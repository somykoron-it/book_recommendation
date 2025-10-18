import RegisterForm from "@/components/Auth/RegisterForm";
import PublicRoute from "@/components/context.js/PublicRoute";

// This is a Server Component by default, as it doesn't have 'use client'
// It renders the client component RegisterForm.
export default function RegisterPage() {
  return (
    <PublicRoute>
      {/* You can add a main heading or other layout elements here specific to the page */}
      <RegisterForm />
    </PublicRoute>
  );
}

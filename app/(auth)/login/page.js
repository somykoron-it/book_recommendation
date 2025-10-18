import LoginForm from "@/components/Auth/LoginForm";
import PublicRoute from "@/components/context.js/PublicRoute";
import Navbar from "@/components/LandingPage/Navbar";

// This is a Server Component by default
export default function LoginPage() {
  return (
    <PublicRoute>
      {/* Any layout specific to the login page can go here */}
      <LoginForm />
    </PublicRoute>
  );
}

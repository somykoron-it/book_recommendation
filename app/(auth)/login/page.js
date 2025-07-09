import LoginForm from "@/app/components/Auth/LoginForm";
import PublicRoute from "@/app/components/context.js/PublicRoute";

// This is a Server Component by default
export default function LoginPage() {
  return (
    <PublicRoute>
      {/* Any layout specific to the login page can go here */}
      <LoginForm />
    </PublicRoute>
  );
}
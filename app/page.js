import PublicRoute from "../components/context.js/PublicRoute";
import HeroSection from "../components/LandingPage/HeroSection";

export default function LandingPage() {
  return (
    <PublicRoute>
      <div className="flex flex-col bg-white">
        {/* Hero Section */}
        <HeroSection />
      </div>
    </PublicRoute>
  );
}

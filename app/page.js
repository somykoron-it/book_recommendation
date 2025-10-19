import PublicRoute from "../components/context.js/PublicRoute";
import HeroSection from "../components/LandingPage/HeroSection";

export default function LandingPage() {
  return (
    <PublicRoute>
      <div className="flex flex-col items-center justify-center bg-white lg:min-h-[94dvh]">
        {/* Hero Section */}
        <HeroSection />
      </div>
    </PublicRoute>
  );
}

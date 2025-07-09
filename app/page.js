import Navbar from "./components/LandingPage/Navbar";
import HeroSection from "./components/LandingPage/HeroSection";
import TrustIndicators from "./components/LandingPage/TrustIndicators";
import Features from "./components/LandingPage/Features";
import Testimonials from "./components/LandingPage/Testimonials";
import CTA from "./components/LandingPage/CTA";
import Footer from "./components/LandingPage/Footer";
import PublicRoute from "./components/context.js/PublicRoute";

export default function LandingPage() {
  return (
    <PublicRoute>
      {" "}
      <div className="min-h-screen flex flex-col bg-white">
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        {/* Trust Indicators */}
        <TrustIndicators />

        {/* Features Section */}
        <Features />

        {/* Testimonials */}
        <Testimonials />

        {/* Final CTA */}
        <CTA />

        {/* Footer */}
        <Footer />
      </div>
    </PublicRoute>
  );
}

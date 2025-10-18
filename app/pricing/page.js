"use client";

import PublicRoute from "../../components/context.js/PublicRoute";
import Navbar from "../../components/LandingPage/Navbar";
import Link from "next/link";
import { HiOutlineClock } from "react-icons/hi";

const PricingPage = () => {
  return (
    <PublicRoute>
      <Navbar />

      <section className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-white to-indigo-50/30 px-4 text-center">
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 max-w-xl w-full border border-gray-100">
          <div className="flex items-center justify-center mb-4 text-indigo-600">
            <HiOutlineClock className="h-12 w-12" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pricing Coming Soon
          </h1>

          <p className="text-gray-600 text-base md:text-lg mb-6">
            We're crafting flexible, reader-first pricing plans for everyone —
            from casual readers to book clubs and publishers.
          </p>

          <Link
            href="/"
            className="inline-block mt-2 px-6 py-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 font-semibold transition duration-300"
          >
            Back to Home
          </Link>
        </div>

        {/* <p className="mt-8 text-sm text-gray-400">
          Want early access or custom plans?{" "}
          <a
            href="/contact"
            className="text-indigo-500 underline hover:text-indigo-700"
          >
            Contact us
          </a>
        </p> */}
      </section>
    </PublicRoute>
  );
};

export default PricingPage;

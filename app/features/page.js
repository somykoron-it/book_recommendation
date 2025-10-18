"use client";

import PublicRoute from "../../components/context.js/PublicRoute";
import Navbar from "../../components/LandingPage/Navbar";
import Link from "next/link";
import {
  HiOutlineStar,
  HiOutlineBell,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineSearchCircle,
  HiOutlineThumbUp,
} from "react-icons/hi";

export default function FeaturesPage() {
  const FEATURES = [
    {
      title: "Personalized Recommendations",
      description:
        "Get book suggestions tailored to your taste based on reading history, ratings, and genres.",
      icon: <HiOutlineThumbUp className="w-10 h-10 text-indigo-600" />,
    },
    {
      title: "Reading Lists",
      description:
        "Organize your books into 'Want to Read', 'Currently Reading', and 'Favorites'.",
      icon: <HiOutlineClipboardList className="w-10 h-10 text-indigo-600" />,
    },
    {
      title: "Reviews & Ratings",
      description:
        "Read trusted community reviews and contribute your own to help others discover gems.",
      icon: <HiOutlineStar className="w-10 h-10 text-indigo-600" />,
    },
    {
      title: "Advanced Search",
      description:
        "Easily filter books by genre, length, author, language, rating, and publication year.",
      icon: <HiOutlineSearchCircle className="w-10 h-10 text-indigo-600" />,
    },
    {
      title: "Social Features",
      description:
        "Follow friends, track their reading progress, and exchange book recommendations.",
      icon: <HiOutlineUsers className="w-10 h-10 text-indigo-600" />,
    },
    {
      title: "Smart Notifications",
      description:
        "Stay updated with personalized alerts for new releases, trending books, and milestones.",
      icon: <HiOutlineBell className="w-10 h-10 text-indigo-600" />,
    },
  ];

  return (
    <PublicRoute>
      <Navbar />

      <section className="bg-gradient-to-b from-white to-indigo-50/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Read Better
            </h1>
            <p className="text-lg text-gray-600">
              Discover how{" "}
              <span className="text-indigo-600 font-semibold">Inkspire</span>{" "}
              empowers your reading journey through intuitive features built for
              readers.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-300 shadow-sm"
            >
              Get Started for Free
              <svg
                className="ml-2 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 010-2h10.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </PublicRoute>
  );
}

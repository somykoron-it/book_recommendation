"use client";

import PublicRoute from "../../components/context.js/PublicRoute";
import Navbar from "../../components/LandingPage/Navbar";
import Link from "next/link";

const About = () => {
  return (
    <PublicRoute>
      <Navbar />

      <section className="bg-gradient-to-b from-white to-indigo-50/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-indigo-600">Inkspire</span>
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Inkspire is a modern reading platform built for book lovers, book
            clubs, and publishers to explore, track, and share their reading
            journeys — all in one place.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                Discover Books You’ll Love
              </h3>
              <p className="text-gray-700">
                Inkspire’s smart recommendation engine helps you uncover titles
                based on your interests, history, and community ratings — no
                more decision fatigue.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                Build Your Library
              </h3>
              <p className="text-gray-700">
                Create custom reading lists like "Want to Read", "Favorites", or
                "Book Club Picks" and keep track of your progress with ease.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                Engage with a Community
              </h3>
              <p className="text-gray-700">
                Connect with fellow readers, join conversations, and explore
                reviews that go beyond star ratings — real insights from real
                readers.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                For Publishers Too
              </h3>
              <p className="text-gray-700">
                Inkspire isn't just for readers — it's a space for publishers to
                reach engaged audiences and gather feedback in meaningful ways.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe books have the power to inspire change, build
              communities, and spark imagination. Inkspire exists to make
              reading more accessible, social, and joyful — for everyone.
            </p>
          </div>

          <div className="mt-12">
            <Link
              href="/signup"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-300"
            >
              Join the Community
            </Link>
          </div>
        </div>
      </section>
    </PublicRoute>
  );
};

export default About;

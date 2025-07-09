"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function HeroSection() {
  const heroRef = useRef(null);
  const bookStackRef = useRef(null);
  const textRotatorRef = useRef(null);
  const texts = [
    "Favorite Book",
    "Best Seller",
    "Hidden Gem",
    "Life-Changing Read",
  ];

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    // Text rotator animation
    let currentIndex = 0;

    const animateText = () => {
      const textElement = textRotatorRef.current;
      if (!textElement) return;

      gsap.to(textElement, {
        opacity: 0,
        y: 30,
        duration: 1.2, // Increased duration for smoother fade-out
        ease: "power3.inOut", // Smoother easing
        onComplete: () => {
          currentIndex = (currentIndex + 1) % texts.length;
          textElement.textContent = texts[currentIndex];
          gsap.to(textElement, {
            opacity: 1,
            y: 0,
            duration: 1.2, // Increased duration for smoother fade-in
            ease: "power3.inOut", // Smoother easing
          });
        },
      });
    };

    const interval = setInterval(animateText, 4000); // Increased interval for longer display

    // Book stack animation
    if (bookStackRef.current) {
      const books = bookStackRef.current.querySelectorAll(".book");

      gsap.from(books, {
        y: 80, // Increased initial offset for more dramatic entrance
        opacity: 0,
        stagger: 0.2, // Slightly increased stagger for better pacing
        duration: 1.2, // Longer duration for smoother entrance
        ease: "back.out(1.4)", // More pronounced bounce effect
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 80%", // Start animation earlier for better visibility
          toggleActions: "play none none none",
        },
      });

      // Continuous subtle animation with increased intensity
      gsap.to(books[0], {
        y: -15, // Increased vertical movement
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(books[1], {
        rotation: -8, // Increased rotation for more noticeable effect
        y: -10, // Added slight vertical movement
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(books[2], {
        rotation: 6, // Increased rotation
        y: -8, // Added slight vertical movement
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={heroRef}
      className="bg-gradient-to-b from-white to-indigo-50/30 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Discover Your Next{" "}
              <span className="text-indigo-600 relative inline-block h-[72px] overflow-hidden">
                <span ref={textRotatorRef} className="block relative">
                  Favorite Book
                </span>
                <span
                  className="absolute bottom-2 left-0 w-full h-2 bg-indigo-100 rounded-full -z-10"
                  style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  }}
                ></span>
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-lg">
              Our intelligent book management system helps you organize,
              discover, and track your reading journey. Perfect for book lovers
              and collectors alike.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="relative text-xl overflow-hidden group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10">Get Started - It's Free</span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
              </Link>
              <Link
                href="/books"
                className="border-2 text-xl border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-100 transition-colors hover:shadow-md"
              >
                Browse Library
              </Link>
            </div>
            <div className="mt-10 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-10 w-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-indigo-600 font-medium shadow-sm"
                  >
                    {item === 4 ? "5K+" : `U${item}`}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Trusted by{" "}
                <span className="font-medium text-indigo-600">5,000+</span> book
                enthusiasts
              </div>
            </div>
          </div>

          {/* Right Book Illustration */}
          <div
            ref={bookStackRef}
            className="order-1 lg:order-2 relative h-[400px] lg:h-[500px] flex items-center justify-center"
          >
            {/* Book Stack */}
            <div className="relative w-full max-w-md h-full">
              {/* Book 3 (Back) */}
              <div className="book absolute bottom-40 left-1/2 w-48 h-64 bg-white rounded-lg shadow-lg border border-gray-100 overflow-bidden rotate-2 origin-bottom">
                <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50 p-4 flex flex-col">
                  <div className="h-4 bg-emerald-200 rounded-full mb-3"></div>
                  <div className="h-4 bg-emerald-200 rounded-full w-3/4 mb-3"></div>
                  <div className="h-4 bg-emerald-100 rounded-full w-1/2 mb-6"></div>
                  <div className="flex-1 flex items-end justify-end">
                    <div className="text-xs text-emerald-600 font-medium bg-white/80 px-2 py-1 rounded-full shadow-sm">
                      ★ 4.8
                    </div>
                  </div>
                </div>
              </div>

              {/* Book 2 (Middle) */}
              <div className="book absolute bottom-48 left-1/2 w-48 h-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden -rotate-3 origin-bottom">
                <div className="h-full bg-gradient-to-br from-yellow-50 to-amber-50 p-4 flex flex-col">
                  <div className="h-4 bg-amber-200 rounded-full mb-3"></div>
                  <div className="h-4 bg-amber-200 rounded-full w-3/4 mb-3"></div>
                  <div className="h-4 bg-amber-100 rounded-full w-1/2 mb-6"></div>
                  <div className="flex-1 flex items-end justify-end">
                    <div className="text-xs text-amber-600 font-medium bg-white/80 px-2 py-1 rounded-full shadow-sm">
                      85% read
                    </div>
                  </div>
                </div>
              </div>

              {/* Book 1 (Front) */}
              <div className="book absolute bottom-56 left-1/2 w-48 h-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden origin-bottom">
                <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex flex-col">
                  <div className="h-4 bg-indigo-200 rounded-full mb-3"></div>
                  <div className="h-4 bg-indigo-200 rounded-full w-3/4 mb-3"></div>
                  <div className="h-4 bg-indigo-100 rounded-full w-1/2 mb-6"></div>
                  <div className="h-2 bg-indigo-100 rounded-full mb-2"></div>
                  <div className="h-2 bg-indigo-100 rounded-full mb-2"></div>
                  <div className="h-2 bg-indigo-100 rounded-full mb-2"></div>
                  <div className="flex-1 flex items-end justify-end">
                    <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      NEW
                    </div>
                  </div>
                </div>
              </div>

              {/* Reading Stats */}
              <div className="absolute left-0 top-1/2 transform translate-y-1/2 bg-white p-4 rounded-xl shadow-lg border border-gray-100 z-10">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Your progress
                </div>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  12 of 16 books this year
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-8 -right-8 bg-indigo-100 w-32 h-32 rounded-full opacity-80 filter blur-lg"></div>
              <div className="absolute bottom-0 -left-8 bg-yellow-100 w-24 h-24 rounded-full opacity-80 filter blur-lg"></div>

              {/* Floating Book Icons */}
              <div className="absolute top-8 left-8 animate-float">
                <svg
                  className="w-12 h-12 text-indigo-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18 2h-6a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2zM4 2H2a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V4a2 2 0 00-2-2z" />
                </svg>
              </div>
              <div
                className
                performans="absolute bottom-8 right-8 animate-float-delay"
              >
                <svg
                  className="w-10 h-10 text-amber-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385V4.804zM11 4.804A7.968 7.968 0 0114.5 4c1.255 0 2.443.29 3.5.804v10A7.969 7.969 0 0014.5 14c-1.669 0-3.218.51-4.5 1.385V4.804z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg); /* Increased float height and rotation */
          }
        }
        @keyframes floatDelay {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(-4deg); /* Increased float height and rotation */
          }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite; /* Slightly faster for more dynamic feel */
        }
        .animate-float-delay {
          animation: floatDelay 4.5s ease-in-out 1s infinite; /* Slightly faster */
        }
      `}</style>
    </section>
  );
}

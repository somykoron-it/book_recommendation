"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function CTA() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const buttonRefs = useRef([]);

  gsap.registerPlugin(ScrollTrigger);

  // Assign refs with safety
  const setButtonRef = (el, index) => {
    buttonRefs.current[index] = el;
  };

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    // Animate content block
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animate buttons + hover effect
    buttonRefs.current.forEach((button, index) => {
      if (!button) return;

      gsap.fromTo(
        button,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: index * 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      const handleEnter = () => {
        gsap.to(button, {
          scale: 1.05,
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleLeave = () => {
        gsap.to(button, {
          scale: 1,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      };

      button.addEventListener("mouseenter", handleEnter);
      button.addEventListener("mouseleave", handleLeave);

      // Cleanup listeners
      return () => {
        button.removeEventListener("mouseenter", handleEnter);
        button.removeEventListener("mouseleave", handleLeave);
      };
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-gradient-to-b from-white to-indigo-50/20 overflow-hidden"
    >
      {/* Background blurs */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-100 rounded-full opacity-30 blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-100 rounded-full opacity-30 blur-3xl translate-x-1/4 translate-y-1/4"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div ref={contentRef}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Ready to transform your{" "}
            <span className="text-indigo-600">reading experience</span>?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join our community of passionate readers and unlock personalized
            book recommendations today
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div ref={(el) => setButtonRef(el, 0)}>
              <Link
                href="/register"
                className="relative text-xl overflow-hidden group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10">Get Started - It's Free</span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
              </Link>
            </div>

            {/* <div ref={(el) => setButtonRef(el, 1)}>
              <Link
                href="/demo"
                className="border-2 text-xl border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-100 transition-colors hover:shadow-md"
              >
                Watch Demo
              </Link>
            </div> */}
          </div>

          {/* Small notes */}
          <div className="mt-8 flex items-center justify-center space-x-2 text-gray-500">
            <svg
              className="w-5 h-5 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>No credit card required</span>
            <span className="mx-1">•</span>
            <svg
              className="w-5 h-5 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>7-day free trial</span>
          </div>
        </div>

        {/* Book icons (decorative) */}
        <div className="absolute bottom-8 left-8 opacity-30">
          <svg
            className="w-12 h-12 text-indigo-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385V4.804zM11 4.804A7.968 7.968 0 0114.5 4c1.255 0 2.443.29 3.5.804v10A7.969 7.969 0 0014.5 14c-1.669 0-3.218.51-4.5 1.385V4.804z" />
          </svg>
        </div>
        <div className="absolute top-12 right-12 opacity-30">
          <svg
            className="w-12 h-12 text-indigo-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385V4.804zM11 4.804A7.968 7.968 0 0114.5 4c1.255 0 2.443.29 3.5.804v10A7.969 7.969 0 0014.5 14c-1.669 0-3.218.51-4.5 1.385V4.804z" />
          </svg>
        </div>
      </div>
    </section>
  );
}

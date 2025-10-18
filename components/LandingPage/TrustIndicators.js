"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function TrustIndicators() {
  const sectionRef = useRef(null);
  const logoRefs = useRef([]);
  const contentRef = useRef(null);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    // Section animation
    gsap.from(contentRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Logo animations
    logoRefs.current.forEach((logo, index) => {
      gsap.fromTo(
        logo,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.2)",
          delay: index * 0.1,
          scrollTrigger: {
            trigger: logo,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      logo.addEventListener("mouseenter", () => {
        gsap.to(logo, {
          opacity: 1,
          scale: 1.1,
          y: -5,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      logo.addEventListener("mouseleave", () => {
        gsap.to(logo, {
          opacity: 0.9,
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    return () => {
      logoRefs.current.forEach((logo) => {
        if (logo) {
          logo.removeEventListener("mouseenter", () => {});
          logo.removeEventListener("mouseleave", () => {});
        }
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-white to-indigo-50/30 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-100 rounded-full opacity-20 filter blur-3xl -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-100 rounded-full opacity-20 filter blur-3xl translate-y-1/3"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Readers & Publishers{" "}
            <span className="text-indigo-600">Worldwide</span>
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of book lovers and industry leaders who rely on our
            platform for their reading journey
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-12 md:gap-16">
          {[
            {
              name: "BookClub",
              icon: "M12 4v16m8-8H4",
              stat: "1M+ Members",
              color: "text-indigo-600",
            },
            {
              name: "ReadWell",
              icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              stat: "500K+ Reviews",
              color: "text-purple-600",
            },
            {
              name: "Literary+",
              icon: "M12 8v8m4-4H8",
              stat: "10K+ Publishers",
              color: "text-amber-600",
            },
            {
              name: "PageTurner",
              icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
              stat: "5M+ Books",
              color: "text-emerald-600",
            },
          ].map((brand, index) => (
            <div
              key={brand.name}
              ref={(el) => (logoRefs.current[index] = el)}
              className="flex flex-col items-center opacity-90 hover:opacity-100 transition-all cursor-pointer group"
            >
              <div
                className={`relative mb-4 p-6 rounded-2xl bg-white shadow-md group-hover:shadow-lg transition-all duration-300 ${brand.color.replace(
                  "text",
                  "border"
                )} border-t-4`}
              >
                <svg
                  className={`w-12 h-12 ${brand.color} mb-2`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={brand.icon}
                  />
                </svg>
              </div>
              <h3 className="text-gray-800 font-semibold text-lg mb-1">
                {brand.name}
              </h3>
              <p className="text-gray-500 text-sm">{brand.stat}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-16 max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="flex -space-x-2 mr-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-10 w-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-indigo-600 font-medium"
                >
                  {`U${item}`}
                </div>
              ))}
            </div>
            <div>
              <div className="text-indigo-600 font-medium">
                Book Club Community
              </div>
              <div className="text-sm text-gray-500">5,000+ active members</div>
            </div>
          </div>
          <blockquote className="text-gray-700 italic">
            "Our book club has found more quality recommendations through this
            platform than anywhere else. The personalized suggestions and
            community features have transformed how we discover and discuss
            books."
          </blockquote>
          <div className="mt-4 flex items-center">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              Rated 4.9/5 by our community
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

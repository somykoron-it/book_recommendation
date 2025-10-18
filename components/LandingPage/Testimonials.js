"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function Testimonials() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  gsap.registerPlugin(ScrollTrigger);

  const setCardRef = (el, index) => {
    cardRefs.current[index] = el;
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    cardRefs.current.forEach((card, index) => {
      if (!card) return; // skip if ref is null

      // Scroll animation
      gsap.fromTo(
        card,
        { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Hover effect
      const handleEnter = () => {
        gsap.to(card, {
          y: -10,
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
          duration: 0.3,
          ease: "power2.out",
        });
      };
      const handleLeave = () => {
        gsap.to(card, {
          y: 0,
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
          duration: 0.3,
          ease: "power2.out",
        });
      };

      card.addEventListener("mouseenter", handleEnter);
      card.addEventListener("mouseleave", handleLeave);

      // Cleanup
      return () => {
        card.removeEventListener("mouseenter", handleEnter);
        card.removeEventListener("mouseleave", handleLeave);
      };
    });
  }, []);

  const testimonials = [
    {
      quote:
        "I've discovered more great books in 3 months with Inkspire than in 3 years without it!",
      author: "Sarah J.",
      role: "Avid Reader",
    },
    {
      quote:
        "The recommendation engine is scarily accurate. I love this. It knows my taste better than I do!",
      author: "Michael T.",
      role: "Book Club Leader",
    },
    {
      quote:
        "Finally a book app that helps me actually find books I'll enjoy, not just browse endlessly.",
      author: "Priya K.",
      role: "Librarian",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-indigo-50/20 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-100 rounded-full opacity-30 blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-100 rounded-full opacity-30 blur-3xl translate-x-1/4 translate-y-1/4"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-indigo-600">Readers Say</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Don’t just take our word for it – hear from our community of book
            lovers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={(el) => setCardRef(el, index)}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <svg
                className="w-8 h-8 text-indigo-200 mb-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 11h3v10H3zm7 0h3v10H10z" />
              </svg>
              <p className="text-gray-700 italic text-base leading-relaxed mb-6">
                {testimonial.quote}
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-4">
                  {testimonial.author[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="mt-6 h-1 w-0 group-hover:w-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

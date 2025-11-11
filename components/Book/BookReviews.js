// components/Book/BookReviews.jsx
"use client";
import { useState, useEffect } from "react";
import StarRating from "./StarRating";

const BookReviews = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/books/${bookId}/reviews`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch reviews");

        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchReviews();
    }
  }, [bookId]);

  const ReviewItem = ({ review }) => (
    <div className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 border border-zinc-200/50 dark:border-zinc-700/50 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
      <div className="flex flex-col space-y-3">
        {/* Rating and Date in one line */}
        <div className="flex items-center justify-between">
          <StarRating rating={review.rating} size="lg" />
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Review Text */}
        <p className="text-zinc-700 dark:text-zinc-300 text-medium font-semibold leading-relaxed line-clamp-3">
          {review.reviewText}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="mt-12">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Reviews
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white/50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200/50 dark:border-zinc-700/50 animate-pulse"
            >
              <div className="flex justify-between mb-3">
                <div className="h-4 bg-zinc-300 dark:bg-zinc-600 rounded w-20"></div>
                <div className="h-3 bg-zinc-300 dark:bg-zinc-600 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-zinc-300 dark:bg-zinc-600 rounded"></div>
                <div className="h-3 bg-zinc-300 dark:bg-zinc-600 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400 text-sm">
            Error loading reviews: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Reader Reviews ({reviews.length})
        </h2>
        {reviews.length > 0 && (
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            What readers are saying
          </p>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-zinc-300 dark:text-zinc-600 mb-3">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            No reviews yet for this book
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <ReviewItem key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookReviews;

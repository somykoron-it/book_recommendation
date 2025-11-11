"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RefreshCcw } from "lucide-react";
import NewBookCard from "../Book/NewBookCard";

const Recommendation = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/books/recommendation");
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      const data = await res.json();
      setBooks(data.books || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleBookClick = (book) => {
    router.push(`/explore/${book._id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-background-dark dark:text-background-light">
              Recommended Books for You
            </h1>
            <p className="text-sm text-slate-500">
              Curated from our best-rated collection
            </p>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">
                Loading recommendations...
              </p>
            </div>
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <NewBookCard
                key={book._id}
                book={book}
                onBookClick={handleBookClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-slate-300 dark:text-slate-600 text-6xl mb-4">
              📚
            </div>
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-3">
              No recommendations available
            </h3>
            <p className="text-slate-500 dark:text-slate-500 max-w-md mx-auto">
              Please check back later or refresh to see new book suggestions.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Recommendation;

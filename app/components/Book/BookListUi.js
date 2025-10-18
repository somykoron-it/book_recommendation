"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NewBookCard from "./NewBookCard";
import BookFilters from "./BookFilters";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
} from "lucide-react";

const BookListUi = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    genres: [],
    publicationYear: [1900, new Date().getFullYear()],
    minRating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Fetch books from API
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (filters.genres.length > 0)
        params.set("genre", filters.genres.join(","));
      if (filters.minRating) params.set("minRating", filters.minRating);
      params.set("startYear", filters.publicationYear[0]);
      params.set("endYear", filters.publicationYear[1]);
      params.set("page", currentPage);
      params.set("limit", 12);

      const res = await fetch(`/api/books?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(data.books || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch books when filters, search query, or page changes
  useEffect(() => {
    fetchBooks();
  }, [searchQuery, filters, currentPage]);

  // Navigate to single book page
  const handleBookClick = (book) => {
    router.push(`/explore/${book._id}`);
  };

  // Enhanced Pagination Component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const delta = 1; // Number of pages to show on each side of current page
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else {
        if (totalPages > 1) rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        {/* Page Info */}
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing page{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {currentPage}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {totalPages}
          </span>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-1">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-slate-500 dark:text-slate-400"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 min-w-[40px] ${
                    currentPage === page
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="flex max-w-7xl mx-auto">
        {/* Filters Sidebar */}
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 mt-2">
            Filters
          </h2>
          <BookFilters filters={filters} onFiltersChange={setFilters} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Search Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            {/* Search Results Title */}
            <div className="flex-1">
              {searchQuery ? (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Search results for:
                  </p>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    "{searchQuery}"
                  </h1>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    Book Library
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Browse our collection of {books.length} book
                    {books.length !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>

            {/* Search Box */}
            <div className="relative w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search books by title or author..."
                  className="w-full lg:w-80 px-4 py-3 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Books Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">
                  Loading books...
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <NewBookCard
                  key={book._id}
                  book={book}
                  onBookClick={handleBookClick}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && books.length === 0 && (
            <div className="text-center py-16">
              <div className="text-slate-300 dark:text-slate-600 text-6xl mb-4">
                📚
              </div>
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-3">
                {searchQuery ? "No books found" : "No books available"}
              </h3>
              <p className="text-slate-500 dark:text-slate-500 max-w-md mx-auto">
                {searchQuery
                  ? `No books found for "${searchQuery}". Try adjusting your search terms or filters.`
                  : "Try adjusting your filters to see more books."}
              </p>
            </div>
          )}

          {/* Pagination */}
          <Pagination />
        </div>
      </main>
    </div>
  );
};

export default BookListUi;

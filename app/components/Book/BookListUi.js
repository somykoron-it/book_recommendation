"use client";
import { useState, useEffect } from "react";
import NewBookCard from "./NewBookCard";
import BookFilters from "./BookFilters";

const BookListUi = () => {
  const [books, setBooks] = useState([]);
  console.log("books on component", books)
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    genres: [],
    publicationYear: [1900, new Date().getFullYear()],
    minRating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

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

      const res = await fetch(`/api/books?${params.toString()}`);
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

  const handleBookClick = (book) => {
    console.log("Book clicked:", book);
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Book Library
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {books.length} books found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {/* Search Box */}
            <div className="relative max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on new search
                }}
                placeholder="Search books by title or author..."
                className="w-full px-4 py-3 pl-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          {loading ? (
            <p className="text-slate-600 dark:text-slate-400">
              Loading books...
            </p>
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
            <div className="text-center py-12">
              <div className="text-slate-400 dark:text-slate-500 text-6xl mb-4">
                📚
              </div>
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                No books found
              </h3>
              <p className="text-slate-500 dark:text-slate-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 mx-1 text-slate-900 dark:text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookListUi;

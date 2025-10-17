"use client";
// components/BookListUi.jsx
import { useState, useMemo } from "react";
import BookCard from "./BookCard";
import BookFilters from "./BookFilters";
import NewBookCard from "./NewBookCard";
import { mockBooks } from "./fakeData";

const BookListUi = () => {
  const [books] = useState(mockBooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    genres: [],
    publicationYear: [1900, new Date().getFullYear()],
    minRating: 0,
  });

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      // Genre filter
      const matchesGenre =
        filters.genres.length === 0 ||
        filters.genres.some((genre) => book.genres.includes(genre));

      // Publication year filter
      const bookYear = new Date(book.publicationDate).getFullYear();
      const matchesYear =
        bookYear >= filters.publicationYear[0] &&
        bookYear <= filters.publicationYear[1];

      // Rating filter
      const matchesRating = book.avgRating >= filters.minRating;

      return matchesSearch && matchesGenre && matchesYear && matchesRating;
    });
  }, [books, searchQuery, filters]);

  const handleBookClick = (book) => {
    console.log(book);
  };

  const closeBookDetail = () => {
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="flex flex-1 max-w-7xl mx-auto">
        {/* Filters Sidebar */}
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 mt-2">
            Filters
          </h2>
          <BookFilters books={books} onFiltersChange={setFilters} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Search Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Book Library
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {filteredBooks.length} books found
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative max-w-md mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Books Grid - Fewer columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <NewBookCard
                key={book._id}
                book={book}
                onBookClick={handleBookClick}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredBooks.length === 0 && (
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
        </div>
      </main>
    </div>
  );
};

export default BookListUi;

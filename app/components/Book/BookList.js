"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookCard from "./BookCard";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { FiSearch, FiFilter, FiX, FiLogOut, FiUser } from "react-icons/fi";
import Pagination from "./Pagination";

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 12;
  const name = localStorage.getItem("user") || "User";

  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedGenre, setSelectedGenre] = useState(
    searchParams.get("genre") || ""
  );
  const [selectedAuthor, setSelectedAuthor] = useState(
    searchParams.get("author") || ""
  );
  const [minRating, setMinRating] = useState(
    searchParams.get("minRating") || ""
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const genres = [
    "Fiction",
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Thriller",
    "Romance",
    "History",
    "Biography",
    "Self-Help",
    "Childrens",
    "Education",
    "Non-Fiction",
    "Horror",
    "Poetry",
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.set("q", searchTerm);
        if (selectedGenre) params.set("genre", selectedGenre);
        if (selectedAuthor) params.set("author", selectedAuthor);
        if (minRating) params.set("minRating", minRating);
        params.set("page", currentPage.toString());
        params.set("limit", booksPerPage.toString());

        const res = await fetch(`/api/books?${params.toString()}`);
        const data = await res.json();

        console.log("Fetched API response:", data);

        if (!res.ok) throw new Error(data.message || "Failed to fetch books");

        const booksList = Array.isArray(data.books) ? data.books : [];
        setBooks(booksList);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message || "Error loading books");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm, selectedGenre, selectedAuthor, minRating, currentPage]);
  

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (selectedGenre) params.set("genre", selectedGenre);
    if (selectedAuthor) params.set("author", selectedAuthor);
    if (minRating) params.set("minRating", minRating);
    router.replace(`/books?${params.toString()}`);
  }, [searchTerm, selectedGenre, selectedAuthor, minRating]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("");
    setSelectedAuthor("");
    setMinRating("");
    setMobileFiltersOpen(false);
    setCurrentPage(1);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  const activeFilters = [
    searchTerm && `Search: "${searchTerm}"`,
    selectedGenre && `Genre: ${selectedGenre}`,
    selectedAuthor && `Author: ${selectedAuthor}`,
    minRating && `Rating: ${minRating}+`,
  ].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center mr-3">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13
                C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13
                C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13
                C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Inkspire</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <FiUser className="text-gray-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
              {name}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-gray-500 hover:text-gray-700 flex items-center cursor-pointer"
            title="Logout"
          >
            <FiLogOut className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="mb-8">
        <div className="md:hidden mb-4">
          <Button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="w-full flex items-center justify-center"
            size="sm"
          >
            <FiFilter className="mr-2" />
            {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <div
          className={`${
            mobileFiltersOpen ? "block" : "hidden"
          } md:block bg-white p-4 rounded-lg border`}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search Field */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Search
              </label>
              <div className="relative">
                <Input
                  className="pr-10 h-10 text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Title, author, or keywords..."
                />
                <FiSearch className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Genre
              </label>
              <div className="relative">
                <FiFilter className="absolute left-3 top-2.5 text-gray-400" />
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full pl-10 pr-3 h-10 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Author Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Author
              </label>
              <div className="relative">
                <Input
                  className="pr-10 h-10 text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  placeholder="Filter by author"
                />
                <FiUser className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Min Rating Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Min Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 h-10 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Any</option>
                <option value="1">★ 1+</option>
                <option value="2">★★ 2+</option>
                <option value="3">★★★ 3+</option>
                <option value="4">★★★★ 4+</option>
                <option value="4.5">★★★★☆ 4.5+</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-500">Active Filters:</span>
              {activeFilters.map((filter, i) => (
                <span
                  key={i}
                  className="flex items-center bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full"
                >
                  {filter}
                  <button
                    onClick={handleClearFilters}
                    className="ml-1 text-indigo-500 hover:text-indigo-700"
                  >
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <Button
                onClick={handleClearFilters}
                size="sm"
                className="ml-2 text-xs"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="text-center p-6 bg-red-50 text-red-600 rounded-lg max-w-md mx-auto">
          {error}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 border border-gray-100 rounded-lg bg-gray-50">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No books found
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Try adjusting your search or filters.
          </p>
          <div className="mt-4">
            <Button onClick={handleClearFilters} size="sm">
              Clear filters
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default BookList;

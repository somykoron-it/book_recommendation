"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const BookDetailPage = () => {
  const { bookId } = useParams(); // Get bookId from URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch book details
  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/books/${bookId}`);
        if (!res.ok) throw new Error("Failed to fetch book");
        const data = await res.json();
        setBook(data.book);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Loading book...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Book not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {book.title}
        </h1>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <img
            src={book.coverImageUrl || "/placeholder.jpg"}
            alt={book.title}
            className="w-full max-w-xs object-cover rounded mb-4"
          />
          <p className="text-lg text-slate-700 dark:text-slate-300">
            <strong>Author:</strong> {book.author}
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            <strong>Genres:</strong> {book.genres?.join(", ") || "None"}
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            <strong>Rating:</strong> {book.averageRating || 0} / 5
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            <strong>Published:</strong>{" "}
            {new Date(book.publicationDate).getFullYear()}
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            <strong>ISBN:</strong> {book.isbn || "N/A"}
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-300 mt-4">
            <strong>Summary:</strong> {book.summary || "No summary available"}
          </p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Library
        </button>
      </main>
    </div>
  );
};

export default BookDetailPage;

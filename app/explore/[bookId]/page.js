"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BookDetails from "@/components/Book/BookDetails";
import NewBookCard from "@/components/Book/NewBookCard";


const BookDetailPage = () => {
  const { bookId } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch book details and similar books
  useEffect(() => {
    if (!bookId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch single book
        const bookRes = await fetch(`/api/books/${bookId}`, {
          credentials: "include",
        });
        if (!bookRes.ok) throw new Error("Failed to fetch book");
        const bookData = await bookRes.json();
        setBook(bookData.book);

        // Fetch similar books
        const similarRes = await fetch(`/api/books/similar/${bookId}`, {
          credentials: "include",
        });
        if (!similarRes.ok) throw new Error("Failed to fetch similar books");
        const similarData = await similarRes.json();
        setSimilarBooks(similarData.similarBooks || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId]);

  const handleSimilarBookClick = (similarBook) => {
    router.push(`/explore/${similarBook._id}`);
  };
  const handleBackClick = () => {
    router.push("/explore");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="animate-pulse text-zinc-600 dark:text-zinc-400">
          Loading book...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Book not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            <span
              onClick={handleBackClick}
              className="hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
            >
              Explore
            </span>
            <span className="mx-2">/</span>
            <span className="text-zinc-900 dark:text-white">Book Details</span>
          </nav>

          {/* Book Details Component */}
          <BookDetails book={book} />

          {/* Similar Books Section */}
          {similarBooks.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                Similar Books
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Books you might enjoy based on this selection
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {similarBooks.map((similarBook) => (
                  <NewBookCard
                    key={similarBook._id}
                    book={similarBook}
                    onBookClick={handleSimilarBookClick}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookDetailPage;

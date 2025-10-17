"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import NewBookCard from "@/app/components/Book/NewBookCard";
import { Button } from "@/components/ui/button";
import { BiSolidBookAdd } from "react-icons/bi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MdOutlineBookmarkAdd, MdBookmark } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import StarRating from "@/app/components/Book/StarRating";


const BookDetailPage = () => {
  const { bookId } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistAnimating, setWishlistAnimating] = useState(false);

  // Fetch book details and similar books
  useEffect(() => {
    if (!bookId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch single book
        const bookRes = await fetch(`/api/books/${bookId}`);
        if (!bookRes.ok) throw new Error("Failed to fetch book");
        const bookData = await bookRes.json();
        setBook(bookData.book);

        // Fetch similar books
        const similarRes = await fetch(`/api/books/similar/${bookId}`);
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

  const handleWishlistToggle = async () => {
    setWishlistAnimating(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        // await fetch(`/api/wishlist/${bookId}`, { method: 'DELETE' });
      } else {
        // Add to wishlist
        // await fetch(`/api/wishlist`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ bookId })
        // });
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error("Wishlist update failed:", error);
    }

    setTimeout(() => setWishlistAnimating(false), 600);
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
            <span className="hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer">
              Explore
            </span>
            <span className="mx-2">/</span>
            <span className="text-zinc-900 dark:text-white">Book Details</span>
          </nav>

          {/* Book Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column - Cover Image & Genres */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div
                className="w-full max-w-xs aspect-[2/3] bg-center bg-no-repeat bg-cover rounded-xl shadow-lg transition-transform duration-300 hover:shadow-xl"
                style={{
                  backgroundImage: `url("${
                    book.coverImageUrl || "/placeholder.jpg"
                  }")`,
                }}
              ></div>

              {/* Genres */}
              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                {book.genres?.map((genre, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 dark:bg-primary/20 px-3 transition-colors hover:bg-primary/20"
                  >
                    <p className="text-primary text-xs font-medium">{genre}</p>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Right Column - Book Information */}
            <div className="md:col-span-2 relative">
              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className={`absolute -top-2 right-0 p-3 rounded-full transition-all duration-300 ${
                  wishlistAnimating ? "scale-110" : "scale-100"
                } ${
                  isInWishlist
                    ? "text-primary bg-primary/10"
                    : "text-zinc-400 hover:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {isInWishlist ? (
                  <MdBookmark className="w-6 h-6" />
                ) : (
                  <MdOutlineBookmarkAdd className="w-6 h-6" />
                )}
              </button>

              <h1 className="text-4xl font-bold text-zinc-900 dark:text-white pr-16">
                {book.title}
              </h1>
              <p className="text-lg mt-1 text-zinc-600 dark:text-zinc-400">
                by {book.author} ({new Date(book.publicationDate).getFullYear()}
                )
              </p>

              <p className="mt-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {book.summary || "No summary available"}
              </p>

              {/* Rating Section */}
              <Card className="mt-6 p-6 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border-0 shadow-sm">
                <CardContent className="flex flex-wrap gap-x-8 gap-y-6 items-start p-0">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-5xl font-bold text-zinc-900 dark:text-white">
                      {book.averageRating?.toFixed(1) || "0.0"}
                    </p>
                    <StarRating
                      rating={book.averageRating || 0}
                      size="lg"
                      className="justify-center"
                    />
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {book.reviewCount || 0}{" "}
                      {book.reviewCount === 1 ? "review" : "reviews"}
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="flex-1 min-w-[240px] grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2 text-sm">
                    {[5, 4, 3, 2, 1].map((starCount) => (
                      <div key={starCount} className="contents group">
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-600 dark:text-zinc-400 font-medium w-3">
                            {starCount}
                          </span>
                          <StarRating
                            rating={starCount}
                            size="sm"
                            maxStars={1}
                            className="!gap-0"
                          />
                        </div>
                        <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${(6 - starCount) * 20}%` }}
                          ></div>
                        </div>
                        <span className="text-zinc-500 dark:text-zinc-500 font-mono text-right text-xs">
                          {`${(6 - starCount) * 20}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="flex-1 sm:flex-none justify-center px-6 py-3 rounded-lg bg-primary text-white font-semibold text-sm shadow-lg hover:bg-primary/90 transition-all transform hover:scale-[1.02] flex items-center gap-2 group">
                  <BiSolidBookAdd className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Add to Reading List
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none justify-center px-6 py-3 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all border-zinc-300 dark:border-zinc-600 flex items-center gap-2 group"
                >
                  <FiEdit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Write a Review
                </Button>
              </div>
            </div>
          </div>

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
                  <div
                    key={similarBook._id}
                    className="flex flex-col gap-3 cursor-pointer group"
                    onClick={() => handleSimilarBookClick(similarBook)}
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                      <div
                        className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover"
                        style={{
                          backgroundImage: `url("${
                            similarBook.coverImageUrl || "/placeholder.jpg"
                          }")`,
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm leading-tight text-zinc-800 dark:text-zinc-200 group-hover:text-primary transition-colors line-clamp-2">
                        {similarBook.title}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {similarBook.author}
                      </p>
                    </div>
                  </div>
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

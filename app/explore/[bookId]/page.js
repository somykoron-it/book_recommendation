import Image from "next/image";
import Link from "next/link";
import {
  FiStar,
  FiBookOpen,
  FiCalendar,
  FiBookmark,
  FiArrowLeft,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
} from "react-icons/fi";

async function getBookDetails(bookId) {
  if (!bookId || typeof bookId !== "string" || bookId.length !== 24) {
    throw new Error("Invalid book ID provided for fetching details.");
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/books/${bookId}`;
    const response = await fetch(apiUrl, { cache: "no-store" });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch book details");
    }

    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export default async function BookDetailsPage({ params }) {
  const { bookId } = params;

  let book;
  let error;

  try {
    book = await getBookDetails(bookId);
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 0 001.414-1.414L11.414 10l1.293-1.293a1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading book details
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <p className="mt-1">Attempted Book ID: {bookId}</p>
              </div>
            </div>
          </div>
        </div>
        <Link
          href="/books"
          className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <FiArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // Social media share URLs
  const shareUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  }/books/${bookId}`;
  const shareText = `Check out "${book.title}" by ${book.author} on Inkspire!`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    shareUrl
  )}&title=${encodeURIComponent(book.title)}&summary=${encodeURIComponent(
    shareText
  )}`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Logo Header */}
      <header className="mb-8 text-center">
        <div className="inline-flex items-center bg-white p-3 rounded-xl shadow-sm border border-gray-200">
          <div className="h-10 w-10 rounded-md bg-indigo-600 flex items-center justify-center mr-3">
            <svg
              className="h-6 w-6 text-white"
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
          <h1 className="text-2xl font-semibold text-gray-800">Inkspire</h1>
        </div>
      </header>

      {/* Back to Books Button */}
      <Link
        href="/books"
        className="mb-6 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
      >
        <FiArrowLeft className="h-4 w-4 mr-2" />
        Back to Books
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="md:flex">
          {/* Book Cover */}
          <div className="md:w-1/3 p-6 flex justify-center bg-gray-50">
            <div className="relative w-full max-w-xs aspect-[2/3]">
              <Image
                src={
                  book.coverImage ||
                  book.coverImageUrl ||
                  "/default-book-cover.png"
                }
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover rounded-lg shadow-md"
                priority
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="md:w-2/3 p-6 md:p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {book.title}
                </h1>
                <h2 className="text-xl text-indigo-600 mt-1">
                  By {book.author}
                </h2>
              </div>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
                <FiBookmark className="h-5 w-5" />
              </button>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-gray-600">
                <FiStar className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="font-medium">
                  {book.averageRating ? book.averageRating.toFixed(1) : "N/A"}
                  <span className="text-gray-400 ml-1">/5</span>
                </span>
              </div>

              {book.genre && (
                <div className="flex items-center text-gray-600">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                    {book.genre}
                  </span>
                </div>
              )}

              {book.publicationYear && (
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{book.publicationYear}</span>
                </div>
              )}

              {book.pageCount && (
                <div className="flex items-center text-gray-600">
                  <FiBookOpen className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{book.pageCount} pages</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Description */}
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About this book
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Additional Info */}
            {book.isbn && (
              <div className="mt-6 text-sm text-gray-500">
                <p>
                  <strong>ISBN:</strong> {book.isbn}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors cursor-pointer">
                Add to Reading List
              </button>
              <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors cursor-pointer">
                Write a Review
              </button>
            </div>

            {/* Social Media Sharing */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Share:</span>
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                title="Share on Facebook"
              >
                <FiFacebook className="h-5 w-5" />
              </a>
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                title="Share on Twitter"
              >
                <FiTwitter className="h-5 w-5" />
              </a>
              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                title="Share on LinkedIn"
              >
                <FiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

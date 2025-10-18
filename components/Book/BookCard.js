"use client";

import Image from "next/image";
import Link from "next/link";
import { FiStar } from "react-icons/fi";

function BookCard({ book }) {
  if (!book) return null;

  const imageUrl = book.coverImage?.startsWith("http")
    ? book.coverImage
    : book.coverImageUrl?.startsWith("/")
    ? book.coverImageUrl
    : "/default-book-cover.jpg";

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      <Link
        href={`/books/${book._id}`}
        className="flex flex-col h-full relative z-10"
      >
        {/* Book Cover (for layout) */}
        <div className="relative pt-[150%] overflow-hidden">
          <Image
            src={imageUrl}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority
          />
        </div>

        {/* Book Info */}
        <div className="p-4 flex flex-col flex-grow bg-white z-10 transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
          <div className="mb-3">
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
              {book.genre}
            </span>
          </div>
          <div className="flex items-center mt-auto">
            <div className="flex items-center">
              <div className="flex mr-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(book.averageRating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700 ml-1">
                {book.averageRating ? book.averageRating.toFixed(1) : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Hover Overlay with Blurred Background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out z-20">
          {/* Background blur image */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 blur-sm brightness-90 transition-transform duration-500"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />

          {/* Description Centered */}
          <div className="relative z-10 flex items-center justify-center h-full px-6 text-center">
            <div className="bg-white/80 p-4 rounded-lg shadow-md backdrop-blur-sm transition-all duration-300">
              <p className="text-gray-900 text-sm font-semibold line-clamp-5">
                {book.description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BookCard;

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BiSolidBookAdd } from "react-icons/bi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MdOutlineBookmarkAdd, MdBookmark } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import StarRating from "@/app/components/Book/StarRating";

const BookDetails = ({ book }) => {
  const router = useRouter();
  const [isInReadingList, setIsInReadingList] = useState(false);
  const [readingListAnimating, setReadingListAnimating] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user ID from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("UserId");
    if (storedUserId) {
      setUserId(storedUserId);
      checkReadingListStatus(storedUserId);
    } else {
      setLoading(false);
    }
  }, [book._id]);

  // Check if book is in user's reading lists
  const checkReadingListStatus = async (userId) => {
    try {
      const res = await fetch(`/api/readinglists?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch reading lists");

      const data = await res.json();
      const bookInList = data.readingLists.find((list) =>
        list.books.some((bookItem) => bookItem._id === book._id)
      );

      if (bookInList) {
        setIsInReadingList(true);
      }
    } catch (error) {
      console.error("Failed to check reading list status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadingListToggle = async () => {
    if (!userId) {
      alert("Please log in to add books to your reading list");
      return;
    }

    setReadingListAnimating(true);

    try {
      // Add to reading list
      const res = await fetch("/api/readinglists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          bookId: book._id,
          listType: "Want to Read",
        }),
      });

      if (!res.ok) throw new Error("Failed to add to reading list");
    
      setIsInReadingList(true);
    } catch (error) {
      console.error("Reading list update failed:", error);
    }

    setTimeout(() => setReadingListAnimating(false), 600);
  };


  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="w-full max-w-xs aspect-[2/3] bg-zinc-200 dark:bg-zinc-700 rounded-xl animate-pulse"></div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          <div className="h-20 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
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
        {/* Reading List Button */}
        <button
          onClick={handleReadingListToggle}
          disabled={!userId || isInReadingList}
          className={`absolute -top-2 right-0 p-3 rounded-full transition-all duration-300 ${
            readingListAnimating ? "scale-110" : "scale-100"
          } ${
            isInReadingList
              ? "text-green-600 bg-green-100 dark:bg-green-900/30"
              : "text-zinc-400 hover:text-green-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          } ${
            !userId || isInReadingList ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title={
            !userId
              ? "Please log in to use reading lists"
              : isInReadingList
              ? "Book added to reading list"
              : "Add to reading list"
          }
        >
          {isInReadingList ? (
            <MdBookmark className="w-6 h-6" />
          ) : (
            <MdOutlineBookmarkAdd className="w-6 h-6" />
          )}
        </button>

        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white pr-16">
          {book.title}
        </h1>
        <p className="text-lg mt-1 text-zinc-600 dark:text-zinc-400">
          by {book.author} ({new Date(book.publicationDate).getFullYear()})
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
        <div className="mt-6">
          <div className="flex flex-wrap gap-3 mb-3">
            <Button
              onClick={handleReadingListToggle}
              disabled={!userId || isInReadingList}
              className={`flex-1 sm:flex-none justify-center px-6 py-3 rounded-lg font-semibold text-sm shadow-lg transition-all transform hover:scale-[1.02] flex items-center gap-2 group ${
                isInReadingList
                  ? "bg-green-600 hover:bg-green-600 text-white"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              <BiSolidBookAdd className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {isInReadingList
                ? "Added to Reading List"
                : "Add to Reading List"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none justify-center px-6 py-3 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all border-zinc-300 dark:border-zinc-600 flex items-center gap-2 group"
            >
              <FiEdit className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Write a Review
            </Button>
          </div>

          {!userId && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
              Please log in to use reading list features
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

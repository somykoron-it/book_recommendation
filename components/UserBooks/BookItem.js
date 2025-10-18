"use client";

import { useState } from "react";
import Image from "next/image";


const BookItem = ({
  bookItem,
  activeTab,
  onStatusChange,
  onRemoveBook,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async () => {
    if (activeTab === "finished-reading") return;

    setIsUpdating(true);
    const statuses = ["Want to Read", "Currently Reading", "Finished Reading"];
    const currentIndex = statuses.indexOf(bookItem.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    await onStatusChange(bookItem.bookId?._id, nextStatus);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    await onRemoveBook(bookItem.bookId?._id);
  };

  return (
    <div className="bg-background-light dark:bg-subtle-dark/40 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-shadow hover:shadow-md">
      {/* Book Info */}
      <div className="flex items-center gap-4 overflow-hidden flex-1 min-w-0">
        <div className="flex-shrink-0">
          <Image
            width={80}
            height={120}
            src={bookItem.bookId?.coverImageUrl || "/book-placeholder.jpg"}
            alt={bookItem.bookId?.title}
            className="w-12 h-18 sm:w-14 sm:h-20 object-cover rounded"
          />
        </div>
        <div className="overflow-hidden flex-1 min-w-0">
          <h3 className="font-semibold text-foreground-light dark:text-foreground-dark truncate text-base sm:text-lg">
            {bookItem.bookId?.title}
          </h3>
          <p className="text-sm text-muted-light dark:text-muted-dark truncate mb-1">
            {bookItem.bookId?.author}
          </p>
          {/* Status badge - visible on mobile */}
          <div className="sm:hidden">
            <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
              {bookItem.status}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end sm:justify-center gap-2 flex-shrink-0">
        {activeTab !== "finished-reading" && (
          <button
            onClick={handleStatusChange}
            disabled={isUpdating}
            className="p-2 rounded-full text-muted-light dark:text-muted-dark hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Change status"
          >
            {isUpdating ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                fill="currentColor"
                height="20"
                viewBox="0 0 256 256"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V48a8,8,0,0,1,16,0v72h80A8,8,0,0,1,224,128Z"></path>
              </svg>
            )}
          </button>
        )}
        <button
          onClick={handleRemove}
          className="p-2 rounded-full text-muted-light dark:text-muted-dark hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
          title="Remove from list"
        >
          <svg
            fill="currentColor"
            height="20"
            viewBox="0 0 256 256"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BookItem;

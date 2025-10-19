"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import BookItem from "./BookItem";
import { toast } from "react-toastify";

const UsersBooks = () => {
  const [readingList, setReadingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("want-to-read");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  useEffect(() => {
    const userId = localStorage.getItem("UserId");
    if (!userId) {
      alert("Please log in to view your reading list");
      setLoading(false);
      return;
    }

    const fetchReadingList = async () => {
      try {
        const res = await fetch(`/api/readinglists?userId=${userId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch reading list");
        const data = await res.json();
        setReadingList(data.readingList);
      } catch (error) {
        console.error("Error fetching reading list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingList();
  }, []);

  const handleStatusChange = async (bookId, newStatus) => {
    try {
      const userId = localStorage.getItem("UserId");

      if (!readingList?._id) {
        const createRes = await fetch("/api/readinglists", {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            bookId,
            status: newStatus,
          }),
        });

        if (createRes.ok) {
          const data = await createRes.json();
          setReadingList(data.readingList);
        }
        return;
      }

      const res = await fetch(`/api/readinglists/${readingList._id}`, {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          bookId,
          status: newStatus,
          action: "updateStatus",
        }),
      });

      if (res.ok) {
        const updatedRes = await fetch(`/api/readinglists?userId=${userId}`);
        const data = await updatedRes.json();
        toast.success("Updated successfully!");
        setReadingList(data.readingList);
      }
    } catch (error) {
      console.error("Error updating book status:", error);
    }
  };

  const handleRemoveBook = async (bookId) => {
    try {
      const userId = localStorage.getItem("UserId");

      if (!readingList?._id) {
        console.error("No reading list found");
        return;
      }

      const res = await fetch(`/api/readinglists/${readingList._id}`, {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          bookId,
          action: "removeBook",
        }),
      });

      if (res.ok) {
        const updatedRes = await fetch(`/api/readinglists?userId=${userId}`);
        const data = await updatedRes.json();
        toast.success("Book removed successfully!");
        setReadingList(data.readingList);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  // Filter books by status
  const getBooksByStatus = (status) => {
    if (!readingList?.books) return [];
    return readingList.books.filter((bookItem) => bookItem.status === status);
  };

  const wantToReadBooks = getBooksByStatus("Want to Read");
  const currentlyReadingBooks = getBooksByStatus("Currently Reading");
  const finishedReadingBooks = getBooksByStatus("Finished Reading");

  // Get current books based on active tab
  const getCurrentBooks = () => {
    switch (activeTab) {
      case "want-to-read":
        return wantToReadBooks;
      case "currently-reading":
        return currentlyReadingBooks;
      case "finished-reading":
        return finishedReadingBooks;
      default:
        return [];
    }
  };

  // Pagination logic
  const currentBooks = getCurrentBooks();
  const totalPages = Math.ceil(currentBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooksPage = currentBooks.slice(
    indexOfFirstBook,
    indexOfLastBook
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasBooks =
    readingList && readingList.books && readingList.books.length > 0;

  if (!hasBooks) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
          No books in your reading list yet
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          Start adding books to see them here
        </p>
      </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground-light dark:text-foreground-dark mb-6">
          My Books
        </h1>

        {/* Custom Tabs Navigation - Improved for mobile */}
        <div className="border-b border-subtle-light dark:border-subtle-dark/20 mb-6 overflow-x-auto">
          <nav aria-label="Tabs" className="flex min-w-max">
            <button
              onClick={() => {
                setActiveTab("want-to-read");
                setCurrentPage(1);
              }}
              className={`cursor-pointer whitespace-nowrap py-3 sm:py-4 px-3 sm:px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "want-to-read"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-light dark:text-muted-dark hover:text-foreground-light dark:hover:text-foreground-dark hover:border-subtle-light dark:hover:border-subtle-dark"
              }`}
            >
              Want to Read
              <span className="ml-2 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                {wantToReadBooks.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("currently-reading");
                setCurrentPage(1);
              }}
              className={`cursor-pointer whitespace-nowrap py-3 sm:py-4 px-3 sm:px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "currently-reading"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-light dark:text-muted-dark hover:text-foreground-light dark:hover:text-foreground-dark hover:border-subtle-light dark:hover:border-subtle-dark"
              }`}
            >
              Currently Reading
              <span className="ml-2 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                {currentlyReadingBooks.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("finished-reading");
                setCurrentPage(1);
              }}
              className={`cursor-pointer whitespace-nowrap py-3 sm:py-4 px-3 sm:px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "finished-reading"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-light dark:text-muted-dark hover:text-foreground-light dark:hover:text-foreground-dark hover:border-subtle-light dark:hover:border-subtle-dark"
              }`}
            >
              Finished Reading
              <span className="ml-2 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                {finishedReadingBooks.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-3 sm:space-y-4">
          {currentBooksPage.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-3">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {activeTab === "want-to-read" &&
                  'No books in your "Want to Read" list yet.'}
                {activeTab === "currently-reading" &&
                  'No books in your "Currently Reading" list yet.'}
                {activeTab === "finished-reading" &&
                  'No books in your "Finished Reading" list yet.'}
              </p>
            </div>
          ) : (
            currentBooksPage.map((bookItem) => (
              <BookItem
                key={bookItem._id}
                bookItem={bookItem}
                activeTab={activeTab}
                onStatusChange={handleStatusChange}
                onRemoveBook={handleRemoveBook}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </main>
  );
};

export default UsersBooks;

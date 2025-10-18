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

const UsersBooks = () => {
  const [readingList, setReadingList] = useState(null);
  console.log("readingList", readingList)
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
        const res = await fetch(`/api/readinglists?userId=${userId}`);
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
        setReadingList(data.readingList);
        setCurrentPage(1); // Reset to first page after removal
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
      <p className="text-center py-10 text-gray-500">Loading your books...</p>
    );
  }

  const hasBooks =
    readingList && readingList.books && readingList.books.length > 0;

  if (!hasBooks) {
    return (
      <p className="text-center py-10 text-gray-500">
        No books in your reading list yet.
      </p>
    );
  }

  // Book item component with improved UI
  const BookItem = ({ bookItem }) => (
    <div className="bg-background-light dark:bg-subtle-dark/40 p-4 rounded-lg flex items-center justify-between transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4 overflow-hidden flex-1 min-w-0">
        <img
          src={bookItem.bookId?.coverImageUrl || "/book-placeholder.jpg"}
          alt={bookItem.bookId?.title}
          className="w-14 h-20 object-cover rounded flex-shrink-0"
        />
        <div className="overflow-hidden flex-1 min-w-0">
          <h3 className="font-semibold text-foreground-light dark:text-foreground-dark truncate text-lg">
            {bookItem.bookId?.title}
          </h3>
          <p className="text-sm text-muted-light dark:text-muted-dark truncate mb-1">
            {bookItem.bookId?.author}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {activeTab !== "finished-reading" && (
          <button
            onClick={() => {
              const statuses = [
                "Want to Read",
                "Currently Reading",
                "Finished Reading",
              ];
              const currentIndex = statuses.indexOf(bookItem.status);
              const nextStatus = statuses[(currentIndex + 1) % statuses.length];
              handleStatusChange(bookItem.bookId?._id, nextStatus);
            }}
            className="p-2 rounded-full text-muted-light dark:text-muted-dark hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
            title="Change status"
          >
            <svg
              fill="currentColor"
              height="20"
              viewBox="0 0 256 256"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V48a8,8,0,0,1,16,0v72h80A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
        )}
        <button
          onClick={() => handleRemoveBook(bookItem.bookId?._id)}
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

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark mb-6">
          My Books
        </h1>

        {/* Custom Tabs Navigation */}
        <div className="border-b border-subtle-light dark:border-subtle-dark/20 mb-6">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab("want-to-read");
                setCurrentPage(1);
              }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "want-to-read"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-light dark:text-muted-dark hover:text-foreground-light dark:hover:text-foreground-dark hover:border-subtle-light dark:hover:border-subtle-dark"
              }`}
            >
              Want to Read ({wantToReadBooks.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("currently-reading");
                setCurrentPage(1);
              }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "currently-reading"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-light dark:text-muted-dark hover:text-foreground-light dark:hover:text-foreground-dark hover:border-subtle-light dark:hover:border-subtle-dark"
              }`}
            >
              Currently Reading ({currentlyReadingBooks.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("finished-reading");
                setCurrentPage(1);
              }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "finished-reading"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-light dark:text-muted-dark hover:text-foreground-light dark:hover:text-foreground-dark hover:border-subtle-light dark:hover:border-subtle-dark"
              }`}
            >
              Finished Reading ({finishedReadingBooks.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {currentBooksPage.length === 0 ? (
            <p className="text-center py-10 text-gray-500">
              {activeTab === "want-to-read" &&
                'No books in your "Want to Read" list yet.'}
              {activeTab === "currently-reading" &&
                'No books in your "Currently Reading" list yet.'}
              {activeTab === "finished-reading" &&
                'No books in your "Finished Reading" list yet.'}
            </p>
          ) : (
            currentBooksPage.map((bookItem) => (
              <BookItem key={bookItem._id} bookItem={bookItem} />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
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

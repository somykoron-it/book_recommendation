"use client";

import { useEffect, useState } from "react";

const UsersBooks = () => {
  const [readingList, setReadingList] = useState(null);
  console.log("reading List", readingList)
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500">Loading your books...</p>
    );
  }

  if (!readingList || readingList.books.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No books in your reading list yet.
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        📚 Your Reading List
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {readingList.books.map((bookItem) => (
          <div
            key={bookItem._id}
            className="bg-white dark:bg-zinc-800 shadow rounded-lg overflow-hidden p-4"
          >
            <img
              src={bookItem.bookId?.coverImageUrl}
              alt={bookItem.bookId?.title}
              className="w-full h-64 object-cover rounded mb-3"
            />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-2">
              {bookItem.bookId?.title}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              {bookItem.bookId?.author}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium">Status:</span>
              <select
                value={bookItem.status}
                onChange={(e) =>
                  handleStatusChange(bookItem.bookId?._id, e.target.value)
                }
                className="text-xs p-1 border border-gray-300 rounded bg-white dark:bg-zinc-700 dark:text-white"
              >
                <option value="Want to Read">Want to Read</option>
                <option value="Currently Reading">Currently Reading</option>
                <option value="Finished Reading">Finished Reading</option>
              </select>
            </div>

            <button
              onClick={async () => {
                try {
                  const userId = localStorage.getItem("UserId");
                  const res = await fetch(
                    `/api/readinglists/${readingList._id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        userId,
                        bookId: bookItem.bookId?._id,
                        action: "removeBook",
                      }),
                    }
                  );

                  if (res.ok) {
                    const updatedRes = await fetch(
                      `/api/readinglists?userId=${userId}`
                    );
                    const data = await updatedRes.json();
                    setReadingList(data.readingList);
                  }
                } catch (error) {
                  console.error("Error removing book:", error);
                }
              }}
              className="w-full text-sm bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Remove from List
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersBooks;

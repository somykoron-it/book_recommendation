"use client";

import { useEffect, useState } from "react";

const UsersBooks = () => {
  const [readingLists, setReadingLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("UserId");
    if (!userId) {
      alert("Please log in to view your reading list");
      setLoading(false);
      return;
    }

    const fetchReadingLists = async () => {
      try {
        const res = await fetch(`/api/readinglists?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch reading lists");
        const data = await res.json();
        setReadingLists(data.readingLists || []);
      } catch (error) {
        console.error("Error fetching reading list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingLists();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500">Loading your books...</p>
    );
  }

  if (readingLists.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No books in your reading list yet.
      </p>
    );
  }

  return (
    <>
      {" "}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          📚 Your Reading Lists
        </h1>

        {readingLists.map((list) => (
          <div key={list._id} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
              {list.listType}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {list.books.map((book) => (
                <div
                  key={book._id}
                  className="bg-white dark:bg-zinc-800 shadow rounded-lg overflow-hidden p-3 hover:scale-[1.02] transition-transform"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h3 className="mt-2 text-sm font-bold text-zinc-900 dark:text-white line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {book.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UsersBooks;

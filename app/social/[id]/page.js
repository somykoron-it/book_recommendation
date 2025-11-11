"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaUserPlus } from "react-icons/fa6";
import PrivateRoute from "@/components/context.js/PrivateRoute";

const Page = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [readingList, setReadingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  // Get current user ID
  const getCurrentUserId = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("UserId");
    }
    return null;
  };

  // Fetch user data
  const fetchUserData = async () => {
    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      setError("You must be logged in to view profiles");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [userResponse, readingListResponse] = await Promise.all([
        fetch(`/api/users/${id}`, {
          headers: { "x-user-id": currentUserId },
        }),
        fetch(`/api/users/${id}/readinglist`, {
          headers: { "x-user-id": currentUserId },
        }),
      ]);

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await userResponse.json();
      setUser(userData.user);
      setIsFollowing(userData.user.isFollowing);

      if (readingListResponse.ok) {
        const readingListData = await readingListResponse.json();
        setReadingList(readingListData.readingList);
      }
    } catch (err) {
      setError("Failed to load user profile");
      console.error("Fetch user error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      const currentUserId = getCurrentUserId();

      const url = isFollowing
        ? `/api/users/follow?targetUserId=${id}`
        : "/api/users/follow";

      const options = {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
        },
        ...(isFollowing ? {} : { body: JSON.stringify({ targetUserId: id }) }),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(
          `Failed to ${isFollowing ? "unfollow" : "follow"} user`
        );
      }

      const result = await response.json();

      // Update local state
      setIsFollowing(!isFollowing);
      if (user) {
        setUser({
          ...user,
          followerCount: result.followerCount,
        });
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
      setError(`Failed to ${isFollowing ? "unfollow" : "follow"} user`);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={fetchUserData}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">User not found</p>
      </div>
    );
  }

  // Status mapping for display
  const statusDisplayMap = {
    "Currently Reading": "Currently Reading",
    "Want to Read": "Want to Read",
    "Finished Reading": "Finished Books",
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-background-light dark:bg-background-dark py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Updated Profile Header */}
          <div className="bg-white dark:bg-slate-900/50 p-6 sm:p-8 rounded-xl shadow-md @container">
            <div className="flex flex-col @[480px]:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Avatar */}
                <div
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-cover bg-center ring-4 ring-primary/20"
                  style={{
                    backgroundImage: `url("${user.avatar}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>

                {/* User Info */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                    {user.username}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-6 mt-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-slate-800 dark:text-white">
                        {user.followerCount}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Followers
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-slate-800 dark:text-white">
                        {user.followingCount}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Following
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-slate-800 dark:text-white">
                        {readingList?.totalBooks || 0}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Books
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow Button */}
              <button
                onClick={handleFollowToggle}
                className="w-full @[480px]:w-auto bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FaUserPlus />
                <span>{isFollowing ? "Unfollow" : "Follow"}</span>
              </button>
            </div>
          </div>

          {/* Updated Reading List Section */}
          <div className="mt-12">
            {readingList ? (
              Object.entries(readingList.booksByStatus)
                .filter(([status, books]) => books.length > 0)
                .map(([status, books]) => (
                  <section key={status} className="mt-12 first:mt-0">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 px-2">
                      {statusDisplayMap[status] || status} ({books.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                      {books.map((book) => (
                        <div key={book.id} className="space-y-2 group">
                          <div
                            className="aspect-[3/4] w-full bg-cover bg-center rounded-lg overflow-hidden shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300"
                            style={{
                              backgroundImage: `url("${book.coverImage}")`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          ></div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                            {book.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-background-dark/70 dark:text-background-light/70 text-lg">
                  Loading reading list...
                </p>
              </div>
            )}

            {readingList && readingList.totalBooks === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-background-dark/70 dark:text-background-light/70 text-lg">
                  No books in reading list yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default Page;

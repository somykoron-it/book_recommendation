"use client";
import { useState, useEffect } from "react";

import UserCard from "./UserCard";
import Following from "./Following";
import Followers from "./Followers";

const SocialPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [followLoadingIds, setFollowLoadingIds] = useState(new Set());


  // Get current user ID from your auth context or localStorage
  const getCurrentUserId = () => {
    // TODO: Replace this with your actual auth context or token
    if (typeof window !== "undefined") {
      return localStorage.getItem("UserId") || "current-user-id";
    }
    return "current-user-id";
  };

  // Search users with debounce
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const currentUserId = getCurrentUserId();

        const response = await fetch(
          `/api/users/search?q=${encodeURIComponent(
            searchQuery
          )}&page=1&limit=20`,
          {
            headers: {
              "x-user-id": currentUserId,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to search users");
        }

        const data = await response.json();
        console.log("Search results:", data); // Debug log
        setSearchResults(data.users || []);
      } catch (err) {
        setError("Failed to search users");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleFollowToggle = async (targetUserId, currentIsFollowing) => {
    setFollowLoadingIds((prev) => new Set(prev).add(targetUserId));
    try {
      const currentUserId = getCurrentUserId();

      const url = currentIsFollowing
        ? `/api/users/follow?targetUserId=${targetUserId}`
        : "/api/users/follow";

      const options = {
        method: currentIsFollowing ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
        },
        ...(currentIsFollowing
          ? {}
          : { body: JSON.stringify({ targetUserId }) }),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Failed to update follow status");
      }

      const result = await response.json();

      // Update local state
      setSearchResults((prev) =>
        prev.map((user) =>
          user && user.id === targetUserId
            ? {
                ...user,
                isFollowing: !currentIsFollowing,
                followerCount: result.followerCount,
              }
            : user
        )
      );
    } catch (err) {
      console.error("Follow toggle error:", err);
      setError("Failed to update follow status");
    } finally {
      // Remove loading state
      setFollowLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(targetUserId);
        return next;
      });
    }
  };

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="">
        <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-background-dark dark:text-background-light">
            Social Connections
          </h1>
          <div className="relative w-full md:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                className="h-5 w-5 text-background-dark/50 dark:text-background-light/50"
                fill="currentColor"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <input
              className="form-input w-full rounded-lg border-primary/20 bg-background-light dark:bg-background-dark text-background-dark dark:text-background-light placeholder-background-dark/50 dark:placeholder-background-light/50 py-3 pl-12 pr-4 focus:border-primary focus:ring-primary"
              placeholder="Search for users"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-12">
          {searchQuery ? (
            <div>
              <h2 className="mb-4 text-2xl font-bold text-background-dark dark:text-background-light">
                Search Results
                {searchResults.length > 0 && ` (${searchResults.length})`}
              </h2>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults
                    .filter((user) => user) // Filter out any undefined users
                    .map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        onFollowToggle={handleFollowToggle}
                        isLoading={followLoadingIds.has(user.id)}
                      />
                    ))
                ) : (
                  <p className="text-center text-background-dark/70 dark:text-background-light/70 py-8">
                    {searchQuery.trim()
                      ? "No users found"
                      : "Start typing to search users"}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <Following />
              <Followers />
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default SocialPage;

"use client";
import { useState, useEffect } from "react";
import UserCard from "./UserCard";

const Followers = () => {
  const [followerUsers, setFollowerUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get current user ID
  const getCurrentUserId = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("UserId");
    }
    return null;
  };

  // Fetch followers
  const fetchFollowers = async () => {
    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/users/me/followers", {
        headers: {
          "x-user-id": currentUserId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch followers");
      }

      const data = await response.json();
      setFollowerUsers(data.users || []);
    } catch (err) {
      setError("Failed to load followers");
      console.error("Fetch followers error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle follow/unfollow for followers
  const handleFollowToggle = async (targetUserId, currentIsFollowing) => {
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
      setFollowerUsers((prev) =>
        prev.map((user) =>
          user.id === targetUserId
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

      // Re-fetch to ensure state is correct
      fetchFollowers();
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="mb-4 text-2xl font-bold text-background-dark dark:text-background-light">
          Followers
        </h2>
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-background-dark dark:text-background-light">
        Followers ({followerUsers.length})
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {followerUsers.length > 0 ? (
          followerUsers.map((user) => (
            <UserCard
              isFollowers={true}
              key={user.id}
              user={user}
              onFollowToggle={handleFollowToggle}
            />
          ))
        ) : (
          <p className="text-background-dark/70 dark:text-background-light/70 py-4 text-center">
            No followers yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Followers;

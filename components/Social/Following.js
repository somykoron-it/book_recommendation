"use client";
import { useState, useEffect } from "react";
import UserCard from "./UserCard";

const Following = () => {
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get current user ID
  const getCurrentUserId = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("UserId");
    }
    return null;
  };

  // Fetch following users
  const fetchFollowingUsers = async () => {
    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/users/me/following", {
        headers: {
          "x-user-id": currentUserId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch following list");
      }

      const data = await response.json();
      setFollowingUsers(data.users || []);
    } catch (err) {
      setError("Failed to load following list");
      console.error("Fetch following error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle unfollow
  const handleFollowToggle = async (targetUserId, currentIsFollowing) => {
    try {
      const currentUserId = getCurrentUserId();

      const response = await fetch(
        `/api/users/follow?targetUserId=${targetUserId}`,
        {
          method: "DELETE",
          headers: {
            "x-user-id": currentUserId,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unfollow user");
      }

      // Remove from local state
      setFollowingUsers((prev) =>
        prev.filter((user) => user.id !== targetUserId)
      );
    } catch (err) {
      console.error("Unfollow error:", err);
      setError("Failed to unfollow user");
    }
  };

  useEffect(() => {
    fetchFollowingUsers();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="mb-4 text-2xl font-bold text-background-dark dark:text-background-light">
          Following
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
        Following ({followingUsers.length})
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {followingUsers.length > 0 ? (
          followingUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onFollowToggle={handleFollowToggle}
            />
          ))
        ) : (
          <p className="text-background-dark/70 dark:text-background-light/70 py-4 text-center">
            Not following anyone yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Following;

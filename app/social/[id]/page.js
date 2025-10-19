"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [readingList, setReadingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

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

  const ReadingListSection = () => {
    if (!readingList) return null;

    return (
      <div className="space-y-6">
        {/* Reading Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {readingList.totalBooks}
            </div>
            <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
              Total Books
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {readingList.booksByStatus["Currently Reading"]?.length || 0}
            </div>
            <div className="text-sm text-yellow-600/70 dark:text-yellow-400/70">
              Reading Now
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {readingList.booksByStatus["Finished Reading"]?.length || 0}
            </div>
            <div className="text-sm text-green-600/70 dark:text-green-400/70">
              Completed
            </div>
          </div>
        </div>

        {/* Books by Status */}
        {Object.entries(readingList.booksByStatus).map(
          ([status, books]) =>
            books.length > 0 && (
              <div
                key={status}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-bold text-background-dark dark:text-background-light mb-4">
                  {status} ({books.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {books.slice(0, 8).map((book) => (
                    <div
                      key={book.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <div
                        className="w-full h-32 bg-cover bg-center rounded mb-2"
                        style={{
                          backgroundImage: `url("${book.coverImage}")`,
                          backgroundSize: "cover",
                        }}
                      ></div>
                      <h4 className="font-semibold text-background-dark dark:text-background-light text-sm line-clamp-2">
                        {book.title}
                      </h4>
                      <p className="text-xs text-background-dark/70 dark:text-background-light/70 mt-1">
                        by {book.author}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {book.genres?.slice(0, 2).map((genre, index) => (
                          <span
                            key={index}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {books.length > 8 && (
                  <button className="mt-4 text-primary text-sm font-medium hover:text-primary/80">
                    View all {books.length} books →
                  </button>
                )}
              </div>
            )
        )}

        {readingList.totalBooks === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-background-dark/70 dark:text-background-light/70 text-lg">
              No books in reading list yet
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-primary/20"
              style={{
                backgroundImage: `url("${user.avatar}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-background-dark dark:text-background-light">
                {user.username}
              </h1>
              <p className="text-background-dark/70 dark:text-background-light/70 mt-1">
                {user.email}
              </p>
              <p className="text-background-dark/70 dark:text-background-light/70 text-sm mt-2">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Follow Button */}
            <button
              onClick={handleFollowToggle}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-8 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-background-dark dark:text-background-light">
                {user.followerCount}
              </p>
              <p className="text-background-dark/70 dark:text-background-light/70 text-sm">
                Followers
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-background-dark dark:text-background-light">
                {user.followingCount}
              </p>
              <p className="text-background-dark/70 dark:text-background-light/70 text-sm">
                Following
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-background-dark dark:text-background-light">
                {readingList?.totalBooks || 0}
              </p>
              <p className="text-background-dark/70 dark:text-background-light/70 text-sm">
                Books
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium ${
              activeTab === "profile"
                ? "border-b-2 border-primary text-primary"
                : "text-background-dark/70 dark:text-background-light/70"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("reading")}
            className={`px-4 py-2 font-medium ${
              activeTab === "reading"
                ? "border-b-2 border-primary text-primary"
                : "text-background-dark/70 dark:text-background-light/70"
            }`}
          >
            Reading List ({readingList?.totalBooks || 0})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Followers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-background-dark dark:text-background-light mb-4">
                Followers ({user.followers?.length || 0})
              </h2>
              <div className="space-y-3">
                {user.followers && user.followers.length > 0 ? (
                  user.followers.slice(0, 5).map((follower) => (
                    <div key={follower._id} className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url("${follower.avatar}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <span className="font-medium text-background-dark dark:text-background-light">
                        {follower.username}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-background-dark/70 dark:text-background-light/70 text-center py-4">
                    No followers yet
                  </p>
                )}
                {user.followers && user.followers.length > 5 && (
                  <p className="text-primary text-sm text-center pt-2">
                    +{user.followers.length - 5} more followers
                  </p>
                )}
              </div>
            </div>

            {/* Following */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-background-dark dark:text-background-light mb-4">
                Following ({user.following?.length || 0})
              </h2>
              <div className="space-y-3">
                {user.following && user.following.length > 0 ? (
                  user.following.slice(0, 5).map((following) => (
                    <div
                      key={following._id}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-10 h-10 rounded-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url("${following.avatar}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <span className="font-medium text-background-dark dark:text-background-light">
                        {following.username}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-background-dark/70 dark:text-background-light/70 text-center py-4">
                    Not following anyone
                  </p>
                )}
                {user.following && user.following.length > 5 && (
                  <p className="text-primary text-sm text-center pt-2">
                    +{user.following.length - 5} more users
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <ReadingListSection />
        )}
      </div>
    </div>
  );
};

export default Page;

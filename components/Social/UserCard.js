"use client";

import { useRouter } from "next/navigation";

const UserCard = ({
  user,
  onFollowToggle,
  isFollowers = false,
  isLoading = false,
}) => {
  const router = useRouter();

  if (!user) return null;

  const {
    id = "",
    username = "Unknown User",
    avatar = "",
    followerCount = 0,
    isFollowing = false,
  } = user;

  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (id && onFollowToggle && !isLoading) {
      onFollowToggle(id, isFollowing);
    }
  };

  const handleCardClick = () => {
    if (id) {
      router.push(`/social/${id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex items-center justify-between rounded-lg bg-background-light p-4 shadow-sm dark:bg-background-dark cursor-pointer hover:bg-background-light/80 dark:hover:bg-background-dark/80"
    >
      <div className="flex items-center gap-4">
        <div
          className="h-14 w-14 flex-shrink-0 rounded-full bg-cover bg-center border border-primary/20"
          style={{ backgroundImage: `url("${avatar}")` }}
        />
        <div>
          <p className="font-semibold text-background-dark dark:text-background-light">
            {username}
          </p>
          <p className="text-sm text-background-dark/70 dark:text-background-light/70">
            {followerCount} {followerCount === 1 ? "follower" : "followers"}
          </p>
        </div>
      </div>

      {!isFollowers && (
        <button
          onClick={handleButtonClick}
          disabled={isLoading}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center cursor-pointer gap-2 ${
            isFollowing
              ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20"
              : "bg-primary text-white hover:bg-primary/90"
          } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Processing
            </>
          ) : isFollowing ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
        </button>
      )}
    </div>
  );
};

export default UserCard;

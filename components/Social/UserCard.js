"use client"; // Add this since we're using client-side features (useRouter)

import { useRouter } from "next/navigation";

const UserCard = ({ user, onFollowToggle, isFollowers = false }) => {
  const router = useRouter();

  // Safe destructuring with default values
  const {
    id = "",
    username = "Unknown User",
    avatar = "",
    followerCount = 0,
    isFollowing = false,
  } = user || {};
  
  // Don't render if no user data
  if (!user) {
    return null;
  }

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent card click event from firing
    if (id && onFollowToggle) {
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
          style={{
            backgroundImage: `url("${avatar}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div>
          <p className="font-semibold text-background-dark dark:text-background-light">
            {username}
          </p>
          <p className="text-sm text-background-dark/70 dark:text-background-light/70">
            {followerCount} {followerCount === 1 ? "follower" : "followers"}
          </p>
        </div>
      </div>
      {isFollowers ? (
        <></>
      ) : (
        <button
          onClick={handleButtonClick}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isFollowing
              ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default UserCard;

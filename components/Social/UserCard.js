// import { useRouter } from "next/navigation";

const UserCard = ({ name, description, avatar, isFollowing }) => {
//   const router = useRouter();

//   const handleClick = () => {
//     router.push(`/social/${encodeURIComponent(name)}`);
//   };

  return (
    <div
      className="flex items-center justify-between rounded-lg bg-background-light p-4 shadow-sm dark:bg-background-dark cursor-pointer hover:bg-background-light/80 dark:hover:bg-background-dark/80"
    //   onClick={handleClick}
    >
      <div className="flex items-center gap-4">
        <div
          className="h-14 w-14 flex-shrink-0 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url("${avatar}")` }}
        ></div>
        <div>
          <p className="font-semibold text-background-dark dark:text-background-light">
            {name}
          </p>
          <p className="text-sm text-background-dark/70 dark:text-background-light/70">
            {description}
          </p>
        </div>
      </div>
      <button
        className={`rounded-lg px-4 py-2 text-sm font-medium ${
          isFollowing
            ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
            : "bg-primary text-white hover:bg-primary/90"
        }`}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default UserCard;


import users from "./MocUser";
import UserCard from "./UserCard";

const Followers = () => {
  const followerUsers = users.filter((user) => !user.isFollowing);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-background-dark dark:text-background-light">
        Followers
      </h2>
      <div className="space-y-4">
        {followerUsers.length > 0 ? (
          followerUsers.map((user) => (
            <UserCard
              key={user.name}
              name={user.name}
              description={user.description}
              avatar={user.avatar}
              isFollowing={user.isFollowing}
            />
          ))
        ) : (
          <p className="text-background-dark/70 dark:text-background-light/70">
            No followers yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Followers;

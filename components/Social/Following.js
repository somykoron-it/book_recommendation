import users from "./MocUser";
import UserCard from "./UserCard";

const Following = () => {
  const followingUsers = users.filter((user) => user.isFollowing);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-background-dark dark:text-background-light">
        Following
      </h2>
      <div className="space-y-4">
        {followingUsers.length > 0 ? (
          followingUsers.map((user) => (
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
            Not following anyone
          </p>
        )}
      </div>
    </div>
  );
};

export default Following;

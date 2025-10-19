
import users from "./MocUser";
import UserCard from "./UserCard";

const Suggestions = () => {
  const suggestedUsers = users.slice(0, 3); // Suggest first 3 users for simplicity

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-background-dark dark:text-background-light">
        Suggestions
      </h2>
      <div className="space-y-4">
        {suggestedUsers.length > 0 ? (
          suggestedUsers.map((user) => (
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
            No suggestions available
          </p>
        )}
      </div>
    </div>
  );
};

export default Suggestions;

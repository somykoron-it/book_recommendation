"use client";
import { useState } from "react";

import UserCard from "./UserCard";
import Following from "./Following";
import Followers from "./Followers";
// import Suggestions from "./Suggestions";
import users from "./MocUser";

const SocialPageCombine = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 px-10 py-8">
      <div className="mx-auto max-w-4xl">
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
        <div className="space-y-12">
          {searchQuery ? (
            <div>
              <h2 className="mb-4 text-2xl font-bold text-background-dark dark:text-background-light">
                Search Results
              </h2>
              <div className="space-y-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
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
                    No users found
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <Following />
              <Followers />
              {/* <Suggestions /> */}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default SocialPageCombine;

// app/api/users/search/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

// Authentication helper (same as follow route)
function getCurrentUser(request) {
  const userId = request.headers.get("x-user-id");

  if (!userId || userId === "undefined" || userId === "null") {
    return null;
  }

  return {
    id: userId,
  };
}

export async function GET(request) {
  await dbConnect();

  try {
    const currentUser = getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        { message: "You must be logged in to search users" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build search filter
    let searchFilter = {};

    if (query.trim()) {
      searchFilter = {
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      };
    }

    // Exclude current user from results
    searchFilter._id = { $ne: currentUser.id };

    // Get users with pagination
    const users = await User.find(searchFilter)
      .select("username avatar followers following createdAt")
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchFilter);

    // Check follow status for each user
    const currentUserDoc = await User.findById(currentUser.id).select(
      "following"
    );
    const currentUserFollowing = currentUserDoc.following.map((id) =>
      id.toString()
    );

    const usersWithFollowStatus = users.map((user) => ({
      id: user._id,
      username: user.username,
      avatar: user.avatar,
      followerCount: user.followers.length,
      followingCount: user.following.length,
      createdAt: user.createdAt,
      isFollowing: currentUserFollowing.includes(user._id.toString()),
      isCurrentUser: user._id.toString() === currentUser.id,
    }));

    return NextResponse.json(
      {
        users: usersWithFollowStatus,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page < Math.ceil(totalUsers / limit),
          hasPrev: page > 1,
        },
        searchQuery: query,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Search users error:", error);
    return NextResponse.json(
      { message: "Failed to search users", error: error.message },
      { status: 500 }
    );
  }
}

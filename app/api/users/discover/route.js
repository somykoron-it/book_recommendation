// app/api/users/discover/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

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
        { message: "You must be logged in to view users" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "createdAt";

    const skip = (page - 1) * limit;

    // Exclude current user and get popular users (most followers)
    const users = await User.find({ _id: { $ne: currentUser.id } })
      .select("username avatar followers following createdAt")
      .sort({ followers: -1, createdAt: -1 }) // Sort by most followers first
      .skip(skip)
      .limit(limit)
      .lean();

    const totalUsers = await User.countDocuments({
      _id: { $ne: currentUser.id },
    });

    // Check follow status
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
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Discover users error:", error);
    return NextResponse.json(
      { message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}

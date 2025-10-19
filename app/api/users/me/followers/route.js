// app/api/users/me/followers/route.js
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
        { message: "You must be logged in" },
        { status: 401 }
      );
    }

    // Get current user with populated followers details
    const user = await User.findById(currentUser.id)
      .populate("followers", "username avatar following")
      .select("followers");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Transform the data
    const followerUsers = user.followers.map((followerUser) => ({
      id: followerUser._id,
      username: followerUser.username,
      avatar: followerUser.avatar,
      followingCount: followerUser.following.length,
      isFollowing: true, // Since they're following the current user
    }));

    return NextResponse.json(
      {
        message: "Followers list fetched successfully",
        users: followerUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch followers error:", error);
    return NextResponse.json(
      { message: "Failed to fetch followers list", error: error.message },
      { status: 500 }
    );
  }
}

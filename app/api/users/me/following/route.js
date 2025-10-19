// app/api/users/me/following/route.js
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

    // Get current user with populated following details
    const user = await User.findById(currentUser.id)
      .populate("following", "username avatar followers")
      .select("following");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Transform the data
    const followingUsers = user.following.map((followedUser) => ({
      id: followedUser._id,
      username: followedUser.username,
      avatar: followedUser.avatar,
      followerCount: followedUser.followers.length,
      isFollowing: true,
    }));

    return NextResponse.json(
      {
        message: "Following list fetched successfully",
        users: followingUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch following error:", error);
    return NextResponse.json(
      { message: "Failed to fetch following list", error: error.message },
      { status: 500 }
    );
  }
}

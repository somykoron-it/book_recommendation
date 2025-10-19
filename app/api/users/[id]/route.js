// app/api/users/[id]/route.js
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

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const currentUser = getCurrentUser(request);
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const user = await User.findById(id)
      .select("-password")
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if current user is following this user
    let isFollowing = false;
    if (currentUser) {
      const currentUserDoc = await User.findById(currentUser.id).select(
        "following"
      );
      isFollowing = currentUserDoc?.following.includes(id) || false;
    }

    return NextResponse.json(
      {
        message: "User fetched successfully",
        user: {
          ...user.toObject(),
          followerCount: user.followers.length,
          followingCount: user.following.length,
          isFollowing,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch user error:", error);
    return NextResponse.json(
      { message: "Failed to fetch user", error: error.message },
      { status: 500 }
    );
  }
}

// Helper function
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// app/api/auth/user/me/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request) {
  await dbConnect();

  try {
    // Get user ID from query parameters or headers
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Alternative: Get from headers if you prefer
    // const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User fetched successfully",
        user: {
          ...user.toObject(),
          followerCount: user.followers.length,
          followingCount: user.following.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch current user error:", error);
    return NextResponse.json(
      { message: "Failed to fetch user", error: error.message },
      { status: 500 }
    );
  }
}

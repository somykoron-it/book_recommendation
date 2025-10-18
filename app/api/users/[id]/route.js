// app/api/users/[id]/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    const user = await User.findById(id)
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
    console.error("Fetch user error:", error);
    return NextResponse.json(
      { message: "Failed to fetch user", error: error.message },
      { status: 500 }
    );
  }
}

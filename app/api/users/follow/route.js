// app/api/users/follow/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in to follow users" },
        { status: 401 }
      );
    }

    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json(
        { message: "Target user ID is required" },
        { status: 400 }
      );
    }

    // Prevent users from following themselves
    if (session.user.id === targetUserId) {
      return NextResponse.json(
        { message: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    const currentUser = await User.findById(session.user.id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if already following
    if (currentUser.following.includes(targetUserId)) {
      return NextResponse.json(
        { message: "You are already following this user" },
        { status: 400 }
      );
    }

    // Add to following list of current user
    currentUser.following.push(targetUserId);

    // Add to followers list of target user
    targetUser.followers.push(session.user.id);

    await Promise.all([currentUser.save(), targetUser.save()]);

    return NextResponse.json(
      {
        message: "Successfully followed user",
        followingCount: currentUser.following.length,
        followerCount: targetUser.followers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json(
      { message: "Failed to follow user", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in to unfollow users" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("targetUserId");

    if (!targetUserId) {
      return NextResponse.json(
        { message: "Target user ID is required" },
        { status: 400 }
      );
    }

    const currentUser = await User.findById(session.user.id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if actually following
    if (!currentUser.following.includes(targetUserId)) {
      return NextResponse.json(
        { message: "You are not following this user" },
        { status: 400 }
      );
    }

    // Remove from following list
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );

    // Remove from followers list
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== session.user.id
    );

    await Promise.all([currentUser.save(), targetUser.save()]);

    return NextResponse.json(
      {
        message: "Successfully unfollowed user",
        followingCount: currentUser.following.length,
        followerCount: targetUser.followers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unfollow error:", error);
    return NextResponse.json(
      { message: "Failed to unfollow user", error: error.message },
      { status: 500 }
    );
  }
}

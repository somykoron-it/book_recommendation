// app/api/users/follow/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

// Simple authentication helper (replace with your actual auth method)
function getCurrentUser(request) {
  // Option 1: Get user from headers (if using token-based auth)
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");

  // Option 2: Get from cookies (if using session cookies)
  // const cookieHeader = request.headers.get('cookie');
  // Parse cookies and extract user info

  if (!userId) {
    return null;
  }

  return {
    id: userId,
    email: userEmail,
  };
}

export async function POST(request) {
  await dbConnect();

  try {
    const currentUser = getCurrentUser(request);

    if (!currentUser) {
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
    if (currentUser.id === targetUserId) {
      return NextResponse.json(
        { message: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    const currentUserDoc = await User.findById(currentUser.id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if already following
    if (currentUserDoc.following.includes(targetUserId)) {
      return NextResponse.json(
        { message: "You are already following this user" },
        { status: 400 }
      );
    }

    // Add to following list of current user
    currentUserDoc.following.push(targetUserId);

    // Add to followers list of target user
    targetUser.followers.push(currentUser.id);

    await Promise.all([currentUserDoc.save(), targetUser.save()]);

    return NextResponse.json(
      {
        message: "Successfully followed user",
        followingCount: currentUserDoc.following.length,
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
    const currentUser = getCurrentUser(request);

    if (!currentUser) {
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

    const currentUserDoc = await User.findById(currentUser.id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if actually following
    if (!currentUserDoc.following.includes(targetUserId)) {
      return NextResponse.json(
        { message: "You are not following this user" },
        { status: 400 }
      );
    }

    // Remove from following list
    currentUserDoc.following = currentUserDoc.following.filter(
      (id) => id.toString() !== targetUserId
    );

    // Remove from followers list
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUser.id
    );

    await Promise.all([currentUserDoc.save(), targetUser.save()]);

    return NextResponse.json(
      {
        message: "Successfully unfollowed user",
        followingCount: currentUserDoc.following.length,
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

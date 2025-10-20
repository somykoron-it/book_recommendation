// app/api/users/follow/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

// Enhanced authentication helper
function getCurrentUser(request) {
  const userId = request.headers.get("x-user-id");

  // Add some basic validation
  if (!userId || userId === "undefined" || userId === "null") {
    return null;
  }

  return {
    id: userId,
  };
}

// Validate MongoDB ObjectId
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
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

    // Validate ObjectId format
    if (!isValidObjectId(targetUserId)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
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

    // Verify current user exists
    const currentUserExists = await User.findById(currentUser.id);
    if (!currentUserExists) {
      return NextResponse.json(
        { message: "Your account not found" },
        { status: 404 }
      );
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if already following using MongoDB query for better performance
    const isAlreadyFollowing = await User.findOne({
      _id: currentUser.id,
      following: targetUserId,
    });

    if (isAlreadyFollowing) {
      return NextResponse.json(
        { message: "You are already following this user" },
        { status: 400 }
      );
    }

    // Use atomic operations to update both users
    await Promise.all([
      // Add to current user's following
      User.findByIdAndUpdate(currentUser.id, {
        $addToSet: { following: targetUserId },
      }),
      // Add to target user's followers
      User.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: currentUser.id },
      }),
    ]);

    // ADD THIS: Create follow notification
    await Notification.create({
      recipient: targetUserId, // The user being followed gets notified
      sender: currentUser.id,
      type: "follow",
    });

    // Get updated counts
    const [updatedCurrentUser, updatedTargetUser] = await Promise.all([
      User.findById(currentUser.id),
      User.findById(targetUserId),
    ]);

    return NextResponse.json(
      {
        message: "Successfully followed user",
        followingCount: updatedCurrentUser.following.length,
        followerCount: updatedTargetUser.followers.length,
        targetUser: {
          id: targetUser._id,
          username: targetUser.username,
          avatar: targetUser.avatar,
        },
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

    // Validate ObjectId format
    if (!isValidObjectId(targetUserId)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Verify users exist
    const [currentUserDoc, targetUser] = await Promise.all([
      User.findById(currentUser.id),
      User.findById(targetUserId),
    ]);

    if (!currentUserDoc || !targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if actually following
    const isFollowing = currentUserDoc.following.includes(targetUserId);
    if (!isFollowing) {
      return NextResponse.json(
        { message: "You are not following this user" },
        { status: 400 }
      );
    }

    // Use atomic operations to update both users
    await Promise.all([
      // Remove from current user's following
      User.findByIdAndUpdate(currentUser.id, {
        $pull: { following: targetUserId },
      }),
      // Remove from target user's followers
      User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUser.id },
      }),
    ]);

    // ADD THIS: Create unfollow notification
    await Notification.create({
      recipient: targetUserId, // The user being unfollowed gets notified
      sender: currentUser.id,
      type: "unfollow",
    });

    // Get updated counts
    const [updatedCurrentUser, updatedTargetUser] = await Promise.all([
      User.findById(currentUser.id),
      User.findById(targetUserId),
    ]);

    return NextResponse.json(
      {
        message: "Successfully unfollowed user",
        followingCount: updatedCurrentUser.following.length,
        followerCount: updatedTargetUser.followers.length,
        targetUser: {
          id: targetUser._id,
          username: targetUser.username,
          avatar: targetUser.avatar,
        },
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

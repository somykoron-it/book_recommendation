// app/api/notifications/route.js
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

function getCurrentUser(request) {
  const userId = request.headers.get("x-user-id");
  if (!userId || userId === "undefined" || userId === "null") {
    return null;
  }
  return { id: userId };
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

    const notifications = await Notification.find({
      recipient: currentUser.id,
    })
      .populate("sender", "username avatar")
      .sort({ createdAt: -1 })
      .limit(50); // Simple limit

    const formattedNotifications = notifications.map((notification) => ({
      id: notification._id,
      type: notification.type,
      sender: {
        id: notification.sender._id,
        username: notification.sender.username,
        avatar: notification.sender.avatar,
      },
      message:
        notification.type === "follow"
          ? "started following you"
          : "unfollowed you",
      date: notification.createdAt,
    }));

    return NextResponse.json({
      notifications: formattedNotifications,
    });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json(
      { message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

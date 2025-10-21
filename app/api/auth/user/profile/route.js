// app/api/auth/user/profile/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(request) {
  await dbConnect();

  try {
    const formData = await request.formData();

    const userId = formData.get("userId");
    const username = formData.get("username");
    const email = formData.get("email");
    const avatarFile = formData.get("avatar");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Find current user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Handle avatar file upload if provided
    let avatarBase64 = user.avatar;
    if (avatarFile && avatarFile.size > 0) {
      // Validate file type
      if (!avatarFile.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "Please upload an image file" },
          { status: 400 }
        );
      }

      // Validate file size (max 2MB)
      if (avatarFile.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Image size must be less than 2MB" },
          { status: 400 }
        );
      }

      // Convert file to base64
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const mimeType = avatarFile.type;

      // Create data URL
      avatarBase64 = `data:${mimeType};base64,${base64}`;
    }

    // Check if username is taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return NextResponse.json(
          { message: "Username is already taken" },
          { status: 400 }
        );
      }
      user.username = username;
    }

    // Check if email is taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return NextResponse.json(
          { message: "Email is already taken" },
          { status: 400 }
        );
      }
      user.email = email;
    }

    // Update avatar if new one was uploaded
    if (avatarFile && avatarFile.size > 0) {
      user.avatar = avatarBase64;
    }

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Failed to update profile", error: error.message },
      { status: 500 }
    );
  }
}

// app/api/auth/user/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    // Get all users (excluding passwords and follower/following arrays for list view)
    const users = await User.find({}, "-password -followers -following");

    return NextResponse.json(
      { message: "Users fetched successfully", users },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json(
      { message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}

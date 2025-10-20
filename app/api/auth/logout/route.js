import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create a response that removes the token cookie
    const response = NextResponse.json({
      success: true,
      message: "Logged out",
    });

    // Set the cookie to expire immediately
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0, // expires immediately
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}

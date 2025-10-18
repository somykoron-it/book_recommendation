// middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  // If there is no token, block access
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Optionally attach decoded user data to the request
    req.user = decoded;

    // Continue request
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

// ✅ Protect all routes under /api/protected/*
export const config = {
  matcher: ["/api/protected/:path*"],
};

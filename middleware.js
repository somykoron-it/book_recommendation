import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

// Protect all routes under /api/protected/*
export const config = {
  matcher: [
    "/api/protected/:path*",
    "/api/readinglists/:path*",
    "/api/books/:path*",
    "/api/reviews/:path*",
  ],
};

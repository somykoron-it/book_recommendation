import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const bookId = searchParams.get("bookId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    let query = {};
    if (userId) query.userId = userId;
    if (bookId) query.bookId = bookId;

    const skip = (page - 1) * limit;

    const reviews = await Review.find(query)
      .populate("userId", "username email") // Adjust fields based on your User model
      .populate("bookId", "title author coverImageUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    return NextResponse.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const { userId, bookId, rating, reviewText } = await request.json();

    if (!userId || !bookId || !rating || !reviewText) {
      return NextResponse.json(
        {
          error: "All fields are required: userId, bookId, rating, reviewText",
        },
        { status: 400 }
      );
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ userId, bookId });
    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this book" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      userId,
      bookId,
      rating,
      reviewText,
    });

    // Populate the created review with user and book details
    await review.populate("userId", "username email");
    await review.populate("bookId", "title author");

    return NextResponse.json(
      { message: "Review created successfully", review },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "You have already reviewed this book" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

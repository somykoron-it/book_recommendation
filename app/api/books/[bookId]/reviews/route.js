// app/api/books/[bookId]/reviews/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import Book from "@/models/Book";
import User from "@/models/User";

export async function POST(request, { params }) {
  try {
    await dbConnect();

    // Get the bookId from params
    const { bookId } = await params;

    // Parse request body
    const body = await request.json();
    const { userId, rating, reviewText } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!rating) {
      return NextResponse.json(
        { error: "Rating is required" },
        { status: 400 }
      );
    }

    if (!reviewText) {
      return NextResponse.json(
        { error: "Review text is required" },
        { status: 400 }
      );
    }

    // Validate rating
    const numericRating = parseInt(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: "Rating must be a number between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate review text length
    if (reviewText.trim().length < 10) {
      return NextResponse.json(
        { error: "Review text must be at least 10 characters long" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Check for existing review
    const existingReview = await Review.findOne({
      userId: userId,
      bookId: bookId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this book" },
        { status: 400 }
      );
    }

    // Create new review
    const review = await Review.create({
      userId,
      bookId,
      rating: numericRating,
      reviewText: reviewText.trim(),
    });

    // Populate user info
    const populatedReview = await Review.findById(review._id)
      .populate("userId", "username email name")
      .populate("bookId", "title author");

    // Update book rating stats
    await updateBookRating(bookId);

    return NextResponse.json(
      {
        success: true,
        message: "Review created successfully",
        review: {
          _id: populatedReview._id,
          rating: populatedReview.rating,
          reviewText: populatedReview.reviewText,
          createdAt: populatedReview.createdAt,
          user: populatedReview.userId,
          book: populatedReview.bookId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in review API:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "You have already reviewed this book" },
        { status: 400 }
      );
    }

    // Handle MongoDB CastError (invalid ObjectId)
    if (error.name === "CastError") {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

// Helper function to update book rating
async function updateBookRating(bookId) {
  try {
    const reviews = (await Review.find({ bookId })) || [];

    const totalReviews = Array.isArray(reviews) ? reviews.length : 0;

    if (totalReviews > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0
      );
      const averageRating = totalRating / totalReviews;

      await Book.findByIdAndUpdate(bookId, {
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: totalReviews,
      });
    } else {
      await Book.findByIdAndUpdate(bookId, {
        averageRating: 0,
        reviewCount: 0,
      });
    }
  } catch (error) {
    console.error("Error updating book rating:", error);
  }
}

// GET method to fetch reviews for a book
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { bookId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Verify book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ bookId })
      .populate("userId", "username name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ bookId });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { bookId: book._id } },
      {
        $group: {
          _id: "$bookId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      reviews,
      book: {
        _id: book._id,
        title: book.title,
        author: book.author,
      },
      ratingStats: ratingStats[0] || {
        averageRating: 0,
        totalReviews: 0,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching book reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch book reviews" },
      { status: 500 }
    );
  }
}

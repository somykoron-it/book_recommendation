import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    const review = await Review.findById(id)
      .populate("userId", "username email")
      .populate("bookId", "title author coverImageUrl genres");

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const { rating, reviewText, userId } = await request.json();

    if (!rating || !reviewText) {
      return NextResponse.json(
        { error: "Rating and review text are required" },
        { status: 400 }
      );
    }

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if the user updating the review is the owner
    if (review.userId.toString() !== userId) {
      return NextResponse.json(
        { error: "You can only update your own reviews" },
        { status: 403 }
      );
    }

    review.rating = rating;
    review.reviewText = reviewText;
    review.updatedAt = Date.now();

    await review.save();

    await review.populate("userId", "username email");
    await review.populate("bookId", "title author");

    return NextResponse.json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const { userId } = await request.json(); // Get userId from request body to verify ownership

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if the user deleting the review is the owner
    if (review.userId.toString() !== userId) {
      return NextResponse.json(
        { error: "You can only delete your own reviews" },
        { status: 403 }
      );
    }

    await Review.findByIdAndDelete(id);

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}

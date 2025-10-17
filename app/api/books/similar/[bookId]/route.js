import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { bookId } = params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return NextResponse.json({ message: "Invalid Book ID" }, { status: 400 });
    }

    const currentBook = await Book.findById(bookId).lean();

    if (!currentBook) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    // Find similar books: matching at least one genre, exclude current book, sort by rating desc, limit 5
    const similarBooks = await Book.find({
      genres: { $in: currentBook.genres },
      _id: { $ne: currentBook._id },
    })
      .sort({ averageRating: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({ similarBooks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching similar books:", error);
    return NextResponse.json(
      {
        message: "Something went wrong fetching similar books",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

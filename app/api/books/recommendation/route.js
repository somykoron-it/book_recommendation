import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    // Find top-rated books (rating >= 4)
    const topBooks = await Book.find({ averageRating: { $gte: 4 } })
      .sort({ averageRating: -1 })
      .lean();

    if (!topBooks || topBooks.length === 0) {
      return NextResponse.json(
        { message: "No top-rated books found", books: [] },
        { status: 200 }
      );
    }

    // Shuffle array randomly
    const shuffled = topBooks.sort(() => Math.random() - 0.5);

    // Pick between 6 and 10 books
    const count = Math.floor(Math.random() * 5) + 6;
    const recommended = shuffled.slice(0, count);

    return NextResponse.json({ books: recommended }, { status: 200 });
  } catch (error) {
    console.error("Error fetching recommended books:", error);
    return NextResponse.json(
      {
        message: "Something went wrong fetching recommendations",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

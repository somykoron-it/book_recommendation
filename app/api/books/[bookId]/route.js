import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { bookId } = params; // Get bookId from dynamic route

    if (!bookId) {
      return NextResponse.json(
        { message: "Book ID is required" },
        { status: 400 }
      );
    }

    const book = await Book.findById(bookId).lean();

    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }


    return NextResponse.json({ book }, { status: 200 });
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { message: "Something went wrong fetching book", error: error.message },
      { status: 500 }
    );
  }
}

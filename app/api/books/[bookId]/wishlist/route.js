import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  await dbConnect();

  const { bookId } = params;

  try {
    const body = await request.json();
    const { wishlist } = body;

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { wishlist },
      { new: true }
    );

    if (!updatedBook) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    console.error(`Error updating book wishlist:`, error);
    return NextResponse.json(
      { message: "Failed to update wishlist", error: error.message },
      { status: 500 }
    );
  }
}

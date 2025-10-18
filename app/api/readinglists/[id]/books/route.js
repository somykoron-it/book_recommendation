import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ReadingList from "@/models/ReadingList";

export async function POST(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const { userId, bookId } = await request.json();

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "User ID and Book ID are required" },
        { status: 400 }
      );
    }

    const readingList = await ReadingList.findOne({ _id: id, userId });

    if (!readingList) {
      return NextResponse.json(
        { error: "Reading list not found" },
        { status: 404 }
      );
    }

    // Add book if not already in list
    if (!readingList.books.includes(bookId)) {
      readingList.books.push(bookId);
      await readingList.save();
    }

    await readingList.populate("books");

    return NextResponse.json({
      message: "Book added to reading list",
      readingList,
    });
  } catch (error) {
    console.error("Error adding book to reading list:", error);
    return NextResponse.json(
      { error: "Failed to add book to reading list" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const bookId = searchParams.get("bookId");

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "User ID and Book ID are required" },
        { status: 400 }
      );
    }

    const readingList = await ReadingList.findOne({ _id: id, userId });

    if (!readingList) {
      return NextResponse.json(
        { error: "Reading list not found" },
        { status: 404 }
      );
    }

    // Remove book from list
    readingList.books = readingList.books.filter(
      (book) => book.toString() !== bookId
    );

    await readingList.save();
    await readingList.populate("books");

    return NextResponse.json({
      message: "Book removed from reading list",
      readingList,
    });
  } catch (error) {
    console.error("Error removing book from reading list:", error);
    return NextResponse.json(
      { error: "Failed to remove book from reading list" },
      { status: 500 }
    );
  }
}

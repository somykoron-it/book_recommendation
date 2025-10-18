// app/api/readinglists/[id]/books/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ReadingList from "@/models/ReadingList";

export async function POST(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const { userId, bookId, status = "Want to Read" } = await request.json();

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "User ID and Book ID are required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = [
      "Want to Read",
      "Currently Reading",
      "Finished Reading",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const readingList = await ReadingList.findOne({ _id: id, userId });

    if (!readingList) {
      return NextResponse.json(
        { error: "Reading list not found" },
        { status: 404 }
      );
    }

    // Check if book already exists in reading list
    const existingBookIndex = readingList.books.findIndex(
      (book) => book.bookId.toString() === bookId
    );

    if (existingBookIndex !== -1) {
      // Update existing book status
      readingList.books[existingBookIndex].status = status;
      readingList.books[existingBookIndex].updatedAt = new Date();
    } else {
      // Add new book to reading list
      readingList.books.push({
        bookId,
        status,
        addedAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await readingList.save();
    await readingList.populate("books.bookId");

    return NextResponse.json({
      message: "Book added/updated in reading list",
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

export async function PUT(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const { userId, bookId, status } = await request.json();

    if (!userId || !bookId || !status) {
      return NextResponse.json(
        { error: "User ID, Book ID, and Status are required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = [
      "Want to Read",
      "Currently Reading",
      "Finished Reading",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const readingList = await ReadingList.findOne({ _id: id, userId });

    if (!readingList) {
      return NextResponse.json(
        { error: "Reading list not found" },
        { status: 404 }
      );
    }

    // Find and update book status
    const bookIndex = readingList.books.findIndex(
      (book) => book.bookId.toString() === bookId
    );

    if (bookIndex === -1) {
      return NextResponse.json(
        { error: "Book not found in reading list" },
        { status: 404 }
      );
    }

    readingList.books[bookIndex].status = status;
    readingList.books[bookIndex].updatedAt = new Date();

    await readingList.save();
    await readingList.populate("books.bookId");

    return NextResponse.json({
      message: "Book status updated successfully",
      readingList,
    });
  } catch (error) {
    console.error("Error updating book status:", error);
    return NextResponse.json(
      { error: "Failed to update book status" },
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
      (book) => book.bookId.toString() !== bookId
    );

    await readingList.save();
    await readingList.populate("books.bookId");

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

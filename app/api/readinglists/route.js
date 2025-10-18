// app/api/readinglists/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ReadingList from "@/models/ReadingList";

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    let readingList = await ReadingList.findOne({ userId }).populate(
      "books.bookId"
    );

    if (!readingList) {
      // Return empty structure if no reading list exists
      return NextResponse.json({
        readingList: {
          userId,
          books: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Filter by status if provided
    if (status) {
      const filteredBooks = readingList.books.filter(
        (book) => book.status === status
      );
      readingList = {
        ...readingList.toObject(),
        books: filteredBooks,
      };
    }

    return NextResponse.json({ readingList });
  } catch (error) {
    console.error("Error fetching reading list:", error);
    return NextResponse.json(
      { error: "Failed to fetch reading list" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const { userId, bookId, status = "Want to Read" } = await request.json();

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "User ID and book ID are required" },
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

    // Find or create reading list for user
    let readingList = await ReadingList.findOne({ userId });

    if (readingList) {
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
    } else {
      // Create new reading list
      readingList = new ReadingList({
        userId,
        books: [
          {
            bookId,
            status,
            addedAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });
    }

    await readingList.save();
    await readingList.populate("books.bookId");

    return NextResponse.json(
      { message: "Book added to reading list", readingList },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating/updating reading list:", error);
    return NextResponse.json(
      { error: "Failed to update reading list" },
      { status: 500 }
    );
  }
}

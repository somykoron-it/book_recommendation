import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ReadingList from "@/models/ReadingList";
import { v4 as uuidv4 } from "uuid";

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const listType = searchParams.get("listType");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    let query = { userId };
    if (listType) {
      query.listType = listType;
    }

    const readingLists = await ReadingList.find(query)
      .populate("books")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ readingLists });
  } catch (error) {
    console.error("Error fetching reading lists:", error);
    return NextResponse.json(
      { error: "Failed to fetch reading lists" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const { userId, listType, bookId } = await request.json();

    if (!userId || !listType || !bookId) {
      return NextResponse.json(
        { error: "User ID, list type, and book ID are required" },
        { status: 400 }
      );
    }

    // Validate list type
    const validListTypes = [
      "Want to Read",
      "Currently Reading",
      "Finished Reading",
    ];
    if (!validListTypes.includes(listType)) {
      return NextResponse.json({ error: "Invalid list type" }, { status: 400 });
    }

    // Check if the list already exists for this user
    let readingList = await ReadingList.findOne({ userId, listType });

    if (readingList) {
      // Add book to existing list if not already present
      if (!readingList.books.includes(bookId)) {
        readingList.books.push(bookId);
        await readingList.save();
      }
    } else {
      // Create new reading list
      readingList = await ReadingList.create({
        userId,
        listType,
        books: [bookId],
      });
    }

    await readingList.populate("books");

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

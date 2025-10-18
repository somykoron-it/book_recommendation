import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ReadingList from "@/models/ReadingList";

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const readingList = await ReadingList.findOne({ _id: id, userId }).populate(
      "books"
    );

    if (!readingList) {
      return NextResponse.json(
        { error: "Reading list not found" },
        { status: 404 }
      );
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

export async function PUT(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const { userId, action, bookId, listType } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    let readingList = await ReadingList.findOne({ _id: id, userId });

    if (!readingList) {
      return NextResponse.json(
        { error: "Reading list not found" },
        { status: 404 }
      );
    }

    if (action === "addBook" && bookId) {
      if (!readingList.books.includes(bookId)) {
        readingList.books.push(bookId);
      }
    } else if (action === "removeBook" && bookId) {
      readingList.books = readingList.books.filter(
        (book) => book.toString() !== bookId
      );
    } else if (action === "updateType" && listType) {
      readingList.listType = listType;
    }

    await readingList.save();
    await readingList.populate("books");

    return NextResponse.json({
      message: "Reading list updated successfully",
      readingList,
    });
  } catch (error) {
    console.error("Error updating reading list:", error);
    return NextResponse.json(
      { error: "Failed to update reading list" },
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

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const readingList = await ReadingList.findOneAndDelete({ _id: id, userId });

    if (!readingList) {
      return NextResponse.json(
        { error: "Reading list not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Reading list deleted successfully" });
  } catch (error) {
    console.error("Error deleting reading list:", error);
    return NextResponse.json(
      { error: "Failed to delete reading list" },
      { status: 500 }
    );
  }
}

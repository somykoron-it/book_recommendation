// app/api/readinglists/[id]/route.js
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
      "books.bookId"
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
    const { userId, bookId, status, action } = await request.json();

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

    // Update book status
    if (action === "updateStatus" && bookId && status) {
      const validStatuses = [
        "Want to Read",
        "Currently Reading",
        "Finished Reading",
      ];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

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
    } else if (action === "removeBook" && bookId) {
      // Remove book from reading list
      readingList.books = readingList.books.filter(
        (book) => book.bookId.toString() !== bookId
      );
    } else {
      return NextResponse.json(
        { error: "Invalid action or missing parameters" },
        { status: 400 }
      );
    }

    await readingList.save();
    await readingList.populate("books.bookId");

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

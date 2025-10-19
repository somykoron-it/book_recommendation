import dbConnect from "@/lib/mongodb";
import ReadingList from "@/models/ReadingList";
import { NextResponse } from "next/server";

function getCurrentUser(request) {
  const userId = request.headers.get("x-user-id");

  if (!userId || userId === "undefined" || userId === "null") {
    return null;
  }
  return { id: userId };
}

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const currentUser = getCurrentUser(request);
    const { id: targetUserId } = params;

    if (!currentUser) {
      return NextResponse.json(
        { message: "You must be logged in" },
        { status: 401 }
      );
    }

    // Find or create reading list for the target user
    let readingList = await ReadingList.findOne({ userId: targetUserId })
      .populate("books.bookId", "title author coverImageUrl summary genres")
      .sort({ "books.addedAt": -1 });

    // If no reading list exists, create an empty one
    if (!readingList) {
      readingList = await ReadingList.create({
        userId: targetUserId,
        books: [],
      });
    }

    // Group books by status for easier display
    const booksByStatus = {
      "Want to Read": [],
      "Currently Reading": [],
      "Finished Reading": [],
    };

    readingList.books.forEach((book) => {
      if (booksByStatus[book.status] && book.bookId) {
        booksByStatus[book.status].push({
          id: book.bookId._id,
          title: book.bookId.title,
          author: book.bookId.author,
          coverImage: book.bookId.coverImageUrl || "/default-book-cover.jpg",
          description: book.bookId.summary,
          genres: book.bookId.genres,
          status: book.status,
          addedAt: book.addedAt,
          updatedAt: book.updatedAt,
        });
      }
    });

    return NextResponse.json(
      {
        message: "Reading list fetched successfully",
        readingList: {
          id: readingList._id,
          userId: readingList.userId,
          booksByStatus,
          totalBooks: readingList.books.length,
          createdAt: readingList.createdAt,
          updatedAt: readingList.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch reading list error:", error);
    return NextResponse.json(
      { message: "Failed to fetch reading list", error: error.message },
      { status: 500 }
    );
  }
}

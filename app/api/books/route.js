import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";
import { NextResponse } from "next/server";

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "";
    const genre = searchParams.get("genre") || "";
    const author = searchParams.get("author") || "";
    const minRating = searchParams.get("minRating") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    let filter = {};

    // Search conditions
    if (query) {
      const regex = new RegExp(query, "i");
      filter.$or = [
        { title: { $regex: regex } },
        { author: { $regex: regex } },
        { description: { $regex: regex } },
        { genre: { $regex: regex } },
      ];
    }

    if (genre) filter.genre = new RegExp(genre, "i");
    if (author) filter.author = new RegExp(author, "i");
    if (minRating && !isNaN(parseFloat(minRating))) {
      filter.averageRating = { $gte: parseFloat(minRating) };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / limit);

    const books = await Book.find(filter)
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        books,
        totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { message: "Something went wrong fetching books", error: error.message },
      { status: 500 }
    );
  }
}

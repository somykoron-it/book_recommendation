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
    const startYear = parseInt(searchParams.get("startYear") || "0");
    const endYear = parseInt(
      searchParams.get("endYear") || new Date().getFullYear()
    );
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    let filter = {};

    // Text search in title, author, summary, genres
    if (query) {
      const regex = new RegExp(query, "i");
      filter.$or = [
        { title: { $regex: regex } },
        { author: { $regex: regex } },
        { summary: { $regex: regex } },
        { genres: { $regex: regex } },
      ];
    }

    // Genre filter (FIXED: Handle multiple genres with OR condition)
    // if (genre) {
    //   const genreArray = genre.split(",");
    //   // Use $in operator to match books that have ANY of the selected genres
    //   filter.genres = { $in: genreArray.map((g) => new RegExp(g.trim(), "i")) };
    // }

    // Genre filter (match any genre in the array)
    if (genre) {
      filter.genres = { $in: [new RegExp(genre, "i")] };
    }

    // Author filter
    if (author) {
      filter.author = { $regex: new RegExp(author, "i") };
    }

    // Minimum rating filter
    if (minRating && !isNaN(parseFloat(minRating))) {
      filter.averageRating = { $gte: parseFloat(minRating) };
    }

    // Log the filter for debugging
    console.log("Search Params:", Object.fromEntries(searchParams));
    console.log("Filter:", filter);

    // Aggregation pipeline to handle publicationDate
    const pipeline = [
      // Apply text and other filters
      { $match: filter },
      // Add a field for the year extracted from publicationDate
      {
        $addFields: {
          year: { $year: "$publicationDate" },
        },
      },
      // Apply year range filter
      {
        $match: {
          year: { $gte: startYear, $lte: endYear },
        },
      },
      // Sort by title
      { $sort: { title: 1 } },
      // Pagination
      { $skip: (page - 1) * limit },
      { $limit: limit },
      // Remove temporary year field
      { $project: { year: 0 } },
    ];

    // Count total documents for pagination
    const countPipeline = [
      { $match: filter },
      {
        $addFields: {
          year: { $year: "$publicationDate" },
        },
      },
      {
        $match: {
          year: { $gte: startYear, $lte: endYear },
        },
      },
      { $count: "total" },
    ];

    const [booksResult, countResult] = await Promise.all([
      Book.aggregate(pipeline).exec(),
      Book.aggregate(countPipeline).exec(),
    ]);

    const totalBooks = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalBooks / limit);

    return NextResponse.json(
      { books: booksResult, totalPages, currentPage: page },
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

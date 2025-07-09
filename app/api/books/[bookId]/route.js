import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  await dbConnect();

  const { bookId } = await params;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.error(`Error fetching book with ID ${bookId}:`, error);
    if (error.name === 'CastError') {
      return NextResponse.json({ message: 'Invalid book ID format' }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Something went wrong fetching the book', error: error.message },
      { status: 500 }
    );
  }
}

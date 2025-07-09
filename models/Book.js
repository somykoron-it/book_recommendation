import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the book'],
    trim: true,
    minlength: 1,
  },
  author: {
    type: String,
    required: [true, 'Please provide an author for the book'],
    trim: true,
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre for the book'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for the book'],
    minlength: 10,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  coverImageUrl: {
    type: String,
    default: '/images/default-book-cover.png', // Default image if none provided
  },
  publicationYear: {
    type: Number,
    required: [true, 'Please provide the publication year'],
    min: 1000, // Reasonable min year
    max: new Date().getFullYear(), // Max year is current year
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true, // Allows null values to be unique, important if ISBN is optional
    trim: true,
  },
  // Add more fields as needed, e.g., pages, publisher, etc.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);

export default Book;
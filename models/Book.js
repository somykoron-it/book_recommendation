import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for the book"],
    trim: true,
    minlength: 1,
  },
  author: {
    type: String,
    required: [true, "Please provide an author for the book"],
    trim: true,
  },
  genres: {
    type: [String],
    required: [true, "At least one genre is required."],
    validate: {
      validator: (arr) => arr.length > 0,
      message: "At least one genre is required.",
    },
  },
  summary: {
    type: String,
    required: [true, "Please provide a summary for the book"],
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
    default: "/images/default-book-cover.png",
  },
  publicationDate: {
    type: Date,
    required: [true, "Please provide the publication date"],
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);
export default Book;

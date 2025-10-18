import mongoose from "mongoose";

const ReadingListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
    index: true,
  },
  books: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: [true, "Book ID is required"],
      },
      status: {
        type: String,
        required: [true, "Status is required"],
        enum: ["Want to Read", "Currently Reading", "Finished Reading"],
        default: "Want to Read",
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      // Optional: You can add more fields like progress, rating, etc.
      /*
      progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      */
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
ReadingListSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Also update the updatedAt for any modified book entries
  if (this.books && this.isModified("books")) {
    const now = new Date();
    this.books.forEach((book) => {
      if (book.isModified()) {
        book.updatedAt = now;
      }
    });
  }

  next();
});

// Compound index for efficient queries
ReadingListSchema.index({ userId: 1 });
ReadingListSchema.index({ "books.bookId": 1 });
ReadingListSchema.index({ "books.status": 1 });

const ReadingList =
  mongoose.models.ReadingList ||
  mongoose.model("ReadingList", ReadingListSchema);
export default ReadingList;

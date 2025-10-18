import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: [true, "Book ID is required"],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot be more than 5"],
  },
  reviewText: {
    type: String,
    required: [true, "Review text is required"],
    minlength: [10, "Review text must be at least 10 characters long"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure one review per user per book
ReviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

// Update the updatedAt field before saving
ReviewSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the model
export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);

import mongoose from "mongoose";

const ReadingListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
    index: true,
  },
  listType: {
    type: String,
    required: [true, "List type is required"],
    enum: ["Want to Read", "Currently Reading", "Finished Reading"],
    index: true,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
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
  next();
});

// Compound index for efficient queries
ReadingListSchema.index({ userId: 1, listType: 1 });

const ReadingList =
  mongoose.models.ReadingList ||
  mongoose.model("ReadingList", ReadingListSchema);
export default ReadingList;

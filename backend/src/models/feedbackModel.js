import mongoose from 'mongoose';

    // Logic for submitting feedback  or complaints
    /* --- Feedback parameters --- */
    // name , email message ,
    //  company,[optional]
    // rating[0-5]

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    company: { type: String, default: "" },
    rating: {
      type: Number,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
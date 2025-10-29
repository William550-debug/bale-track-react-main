import mongoose from "mongoose";

const baleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    baleType: {
      type: String,
      required: true,
      enum: ["cotton", "jute", "wool"],
      required: true,
      lowercase: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },

    transactionType: {
      type: String,
      enum: ["purchase", "sale"],
      required: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Bale = mongoose.model("Bale", baleSchema);
export default Bale;

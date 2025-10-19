import mongoose from "mongoose";

const savingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    savingsType: {
      type: String,
      required: true,
      enum: ["personal", "business", "target"],
      lowercase: true,
      trim: true,
    },
    savingsAmount: {
      type: Number,
      required: true,
      min: [1, "Amount must be at least 1"],
    },
    savingsDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    targetAmount: {
      type: Number,
      min: [0, "Target amount cannot be negative"],
      default: null, // Explicit default value
    },
    targetName: {
      type: String,
      trim: true,
      default: null, // Explicit default value
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual for progress calculation
savingsSchema.virtual("progress").get(function () {
  if (this.savingsType === "target" && this.targetAmount) {
    return Math.min(
      Math.round((this.savingsAmount / this.targetAmount) * 100),
      100
    );
  }
  return 0;
});

// Indexes remain the same
savingsSchema.index({ user: 1, savingsType: 1 });
savingsSchema.index({ user: 1, savingsDate: 1 });

const Savings = mongoose.model("Savings", savingsSchema);
export default Savings;

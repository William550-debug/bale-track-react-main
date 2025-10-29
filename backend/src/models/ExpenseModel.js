import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expenseType: {
      type: String,
      required: true,
      enum: ["transport", "utilities", "salaries", "supplies", "other"],
      required: true,
      lowercase: true,
      trim: true,
    },

    expenseDescription: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    expenseAmount: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },

    expenseDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    period: {
      month: Number,
      quarter: Number,
      year: Number,
    },
  },
  {
    timestamps: true,
  }
);

expenseSchema.pre("save", function (next) {
  const date = this.expenseDate || new Date();
  this.period = {
    month: date.getMonth() + 1,
    quarter: Math.floor(date.getMonth() / 3) + 1,
    year: date.getFullYear(),
  };
  next();
});

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;

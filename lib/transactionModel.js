import mongoose from "mongoose";

if (process.env.NODE_ENV !== "production") {
  mongoose.models = {};
}
const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true, default: Date.now },
    type: {
      type: String,
      required: true,
      enum: ["Expense", "Income"],
    },
    fromTo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    amount: {
      type: String,
      required: true,
    },
    updatedInBooks: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;

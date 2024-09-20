import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  state: { type: String, required: true },
});

export const Transaction = mongoose.model("Transaction", transactionSchema);

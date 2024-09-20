import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  state: { type: String, required: true },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

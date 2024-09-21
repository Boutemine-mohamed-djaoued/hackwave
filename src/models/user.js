import mongoose from "mongoose";

const infoSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
    cards:[{type:mongoose.Schema.Types.ObjectId, ref: "Card"}],
    phoneNumber: { type: String, required: true },
  },
  { discriminatorKey: "role", collection: "infos" }
);

const Info = mongoose.model("Info", infoSchema);

const Client = Info.discriminator(
  "Client",
  new mongoose.Schema({
    clientType: { type: String },
  })
);

const Agent = Info.discriminator(
  "Agent",
  new mongoose.Schema({
    onCall: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    activeTicket: { type: mongoose.Schema.Types.ObjectId ,ref:"Ticket"},
  })
);

export { Agent, Client };

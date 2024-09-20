import mongoose from "mongoose";

const infoSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
    phoneNumber: { type: String, required: true, unique: true },
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
    ticket: { type: String },
  })
);

export { Agent, Client };

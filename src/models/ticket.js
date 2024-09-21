import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  state: { type: String,enum:["new","open","closed","onhold"], required: true },
  info:{type:String,required:true},
  priority: {type: Number,required:true}
}, {
  timestamps:true
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket

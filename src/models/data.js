import mongoose from "mongoose";

const generalSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const problemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const General = mongoose.model("General", generalSchema);
const Problem = mongoose.model("Problem", problemSchema);

export { General, Problem };

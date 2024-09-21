import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  _id : {
    type : mongoose.Types.ObjectId,
    required:true,
  }, 
  cardNumber: {
    type:String,
    required:true
  },
  amount: {
    type:String,
    required:true,
  },
  type: {
    type:String,
    enum:["IN","OUT"],
    required:true,
  },
  status: {
    type:String,
    enum:["Completed","Failed"],
    required:true,  
  },
  description: {
    type:String,
    required:true,
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction

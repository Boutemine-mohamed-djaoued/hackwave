import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    number:{type:String,required:true},
    bank:{type:String,required:true},
    status:{type:String,required:true},
    amount:{type:String,required:true},
    max: {type:String,required:true},
    note: {type:String,required:true},
})

const Card = mongoose.model("Card",cardSchema)
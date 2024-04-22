import mongoose from "mongoose";
import { userCollection } from "./usersModel.js";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String, 
        required: true,
        index: true,
        unique: true,
        max: 100
    },
    purchase_datetime: {
        type: Date, 
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true 
    }
    
})

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
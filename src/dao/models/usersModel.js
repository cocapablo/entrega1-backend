import mongoose from "mongoose";
import { cartCollection } from "./cartsModel.js";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: true,
        max: 100
    },
    last_name: {
        type: String, 
        required: true,
        max: 100
    },
    email: {
        type: String, 
        required: true,
        index: true,
        unique: true,
        max: 50
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String, 
        required: true,
        max: 10
    },
    role: {
        type: String,
        required: true,
        max: 10
    },
    cart : {
        type: mongoose.Schema.Types.ObjectId,
        ref: cartCollection,
        required: false 
    }
    
})

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
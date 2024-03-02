import mongoose from "mongoose";

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
    }
})

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
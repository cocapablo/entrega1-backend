import mongoose from "mongoose";

export const chatCollection = "messages";

const chatSchema = new mongoose.Schema({
    user: {
        type: String, 
        required: true,
        max: 100
    },
    message: {
        type: String, 
        required: true,
        max: 500
    }
})


const chatModel = mongoose.model(chatCollection, chatSchema);

export default chatModel;
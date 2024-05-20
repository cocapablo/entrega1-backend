import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

//import { userCollection } from "./usersModel.js";

export const productCollection = "products";

let userCollection = "users";

const productSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        max: 100
    },
    description: {
        type: String, 
        required: true,
        max: 300
    },
    price: {
        type: Number, 
        required: true,
    },
    thumbnail: {
        type: String, 
        required: true,
        max: 500
    },
    code: {
        type: String, 
        required: true,
        max: 100
    },
    stock: {
        type: Number, 
        required: true,
    },
    category: {
        type: String, 
        required: true,
        max: 100
    },
    status: {
        type: Boolean , 
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userCollection,
        required: false, 
    }


})

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
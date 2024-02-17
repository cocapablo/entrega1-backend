import mongoose from "mongoose";

export const productCollection = "products";

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
    }


})


const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
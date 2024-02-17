import mongoose from "mongoose";
import { productCollection } from "./products.model.js";

export const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products : [
        { 
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: productCollection,
                required: true 
            },
            quantity : {
                type: Number,
                required: true
            }
        }
    ]

})


const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
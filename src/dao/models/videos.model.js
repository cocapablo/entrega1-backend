import mongoose from "mongoose";


export const videosCollection = "videos";


const videosSchema = new mongoose.Schema({
    titulo: {
        type: String, 
        required: true,
        max: 100
    },
    descripcion: {
        type: String, 
        required: true,
        max: 500
    },
    src: {
        type: String,
        required: true,
        max: 500
    }

})


const videosModel = mongoose.model(videosCollection, videosSchema);

export default videosModel;
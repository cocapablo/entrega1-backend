import mongoose from "mongoose";


export const actividadesCollection = "actividades";


const actividadesSchema = new mongoose.Schema({
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
    srcImagen: {
        type: String,
        required: true,
        max: 500
    },
    altImagen: {
        type: String,
        required: true,
        max: 100
    }

})


const actividadesModel = mongoose.model(actividadesCollection, actividadesSchema);

export default actividadesModel;
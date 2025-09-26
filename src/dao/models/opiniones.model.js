import mongoose from "mongoose";


export const opinionesCollection = "opiniones";


const opinionesSchema = new mongoose.Schema({
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
    prioridad: {
        type: Number, 
        min: 1
    }
         
})


const opinionesModel = mongoose.model(opinionesCollection, opinionesSchema);

export default opinionesModel;
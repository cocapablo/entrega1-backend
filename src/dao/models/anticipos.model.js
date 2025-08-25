import mongoose from "mongoose";


export const anticiposCollection = "anticipos";


const anticiposSchema = new mongoose.Schema({
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
    tipoVista: {
        type: String,
        required: true,
        max: 100
    },
    origenVista: {
        type: String,
        required: true,
        max: 100
    },
    tipoPath: {
        type: String,
        required: true,
        max: 100
    },
    path: {
        type: String,
        required: true,
        max: 100
    }

})


const anticiposModel = mongoose.model(anticiposCollection, anticiposSchema);

export default anticiposModel;
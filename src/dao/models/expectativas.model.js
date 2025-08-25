import mongoose from "mongoose";


export const expectativasCollection = "expectativas";


const expectativasSchema = new mongoose.Schema({
    titulo: {
        type: String, 
        required: true,
        max: 100
    },
    descripcion: {
        type: String, 
        required: true,
        max: 500
    }

})


const expectativasModel = mongoose.model(expectativasCollection, expectativasSchema);

export default expectativasModel;
import mongoose from "mongoose";


export const pedidosdepresupuestoCollection = "pedidosdepresupuesto";


const pedidosdepresupuestoSchema = new mongoose.Schema({
    origen: {
        type: String, 
        required: true,
        max: 100
    },
    nombre: {
        type: String, 
        required: true,
        max: 100
    },
    email: {
        type: String, 
        required: true,
        max: 100
    },
    telefono: {
        type: String, 
        required: true,
        max: 100
    },
    tipodeevento: {
        type: String, 
        required: true,
        max: 100
    },
    localidad: {
        type: String, 
        required: true,
        max: 100
    },
    pais: {
        type: String, 
        required: true,
        max: 100
    },
    cantidaddeinvitados: {
        type: Number, 
        required: true,
    },
    fecha: {
        type: String, 
        required: true,
        max: 100
    },
    comentario: {
        type: String, 
        required: true,
        max: 500
    }

})


const pedidosdepresupuestoModel = mongoose.model(pedidosdepresupuestoCollection, pedidosdepresupuestoSchema);

export default pedidosdepresupuestoModel;
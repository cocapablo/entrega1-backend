import mongoose from "mongoose";
import opinionesModel from "../models/opiniones.model.js";


//Errores
import EErrors from "../../services/errors/enums.js";
import CustomError from "../../services/errors/CustomError.js";

import { generateDatabaseErrorInfo } from "../../services/errors/info.js";

class OpinionesManager {
    #opiniones;
        
    constructor() {
        this.#opiniones = [];
        
    }

    async getOpinionesAsync() {

        try {
            let opinionesBD = await opinionesModel.find();
            //Armo la coleccion de productos con el formato que utilizamos

            this.#opiniones = opinionesBD.map(opinion => {
                return (
                    {
                        id: opinion._id.toString(),
                        titulo: opinion.titulo,
                        descripcion: opinion.descripcion,
                        prioridad: opinion.prioridad ? opinion.prioridad : 1
                    }
                )
            })
        }
        catch (error) {
            
            //Creo un Custom Error
            const miError = CustomError.createError({
                name: "Error devolviendo Opiniones",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }


        return this.#opiniones;
    }

    async addOpinionAsync({titulo = "", descripcion = "", prioridad = 1}) {
        let nuevaOpinion;
        

        try {
            //Validaciones
            if (titulo.trim().length === 0) {
                //throw new Error("ERROR: title vacío");
                CustomError.createError({
                    name: "Error creando una Opinion",
                    cause: "Título vacío",
                    message: "ERROR: Título vacío",
                    code: EErrors.INVALID_TYPES_ERROR
                })

                
            }

            if (descripcion.trim().length === 0) {
                //throw new Error("ERROR: description vacío");
                CustomError.createError({
                    name: "Error creando una Opinion",
                    cause: "Descripcion vacía",
                    message: "ERROR: Descripción vacía",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            //Agrego la Opinion a la Base de Datos

            nuevaOpinion = {
                titulo: titulo,
                descripcion: descripcion,
                prioridad: prioridad 
            }

            let resultado = await opinionesModel.create(nuevaOpinion);


            //Agrego el nuevo id a nuevoPedido
            nuevaOpinion = {
                id: resultado._id.toString(),
                ...nuevaOpinion
            }

                           
        }
        catch (error) {
            //Me fijo si el error es Custom o de la Base de Datos
            if (error.isCustom) {
                throw (error);
            }

            //Es Error de la Base de Datos
            //Creo un Custom Error
            CustomError.createError({
                name: "Error creando una Opinion",
                cause: generateDatabaseErrorInfo(error),
                message: error.toString(),
                code: EErrors.DATABASE_ERROR
            })
        }

        return nuevaOpinion;

    }

    async deleteOpinionAsync(idOpinion) {
        
        //Validaciones
        if (!mongoose.isValidObjectId(idOpinion)) {
            CustomError.createError({
                name: "Error eliminando una Opinion",
                cause: "idOpinion inválido",
                message: "ERROR: idOpinion inválido",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        //Elimino la Opinion de la Base de Datos

        try {
            await opinionesModel.deleteOne({_id: idOpinion});
        }
        catch (error) {
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error eliminando una Opinion",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }

        return true;
    }

    async getOpinionByIdAsync(idOpinion) {
        //Validaciones
        if (!mongoose.isValidObjectId(idOpinion)) {
            CustomError.createError({
                name: "Error obteniendo una Opinion",
                cause: "idOpinion inválido",
                message: "ERROR: idOpinion inválido",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        let opinion;

        try {
            opinion = await opinionesModel.findById(idOpinion);
        }
        catch (error) {
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error obteniendo una Opinion",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }
        if (!opinion) {
            CustomError.createError({
                name: "Error obteniendo una Opinion",
                cause: "Opinion no encontrada",
                message: "ERROR: Opinion no encontrada",
                code: EErrors.NOT_FOUND_ERROR
            })
        }
        //Armo el objeto con el formato que utilizamos
        const opinionFormateada = {
            id: opinion._id.toString(),
            titulo: opinion.titulo,
            descripcion: opinion.descripcion,
            prioridad: opinion.prioridad ? opinion.prioridad : 1
        }
        //Retorno el objeto formateado
        return opinionFormateada;
    }

    async updateOpinionAsync({idOpinion, titulo, descripcion, prioridad}) {
        let opinionCambios = {};

        if (titulo) opinionCambios.titulo = titulo;
        if (descripcion) opinionCambios.descripcion = descripcion;
        if (prioridad) opinionCambios.prioridad = prioridad;

        //Validaciones
        if (!mongoose.isValidObjectId(idOpinion)) {
            CustomError.createError({
                name: "Error actualizando una Opinion",
                cause: "idOpinion inválido",
                message: "ERROR: idOpinion inválido",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        
        let opinionActualizada;
        let resultado;

        try {
            //Actualizo la Opinion en la Base de Datos
            resultado = await opinionesModel.findByIdAndUpdate(
                idOpinion,
                opinionCambios,
                {new: true} //Para que me devuelva el objeto actualizado)
            );  

            if (!resultado) {
                CustomError.createError({
                    name: "Error actualizando una Opinion",
                    cause: "Opinion no encontrada",
                    message: "ERROR: Opinion no encontrada",
                    code: EErrors.DATABASE_ERROR
                })
            }     

            //Armo el objeto con el formato que utilizamos
            opinionActualizada = {
                id: resultado._id.toString(),
                titulo: resultado.titulo,
                descripcion: resultado.descripcion,
                prioridad: resultado.prioridad ? resultado.prioridad : 1
            }
        }
        catch (error) {
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error actualizando una Opinion",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }

        return opinionActualizada;
    }

}

export default OpinionesManager; 
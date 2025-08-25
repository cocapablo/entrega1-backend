import mongoose from "mongoose";
import expectativasModel from "../models/expectativas.model.js";


//Errores
import EErrors from "../../services/errors/enums.js";
import CustomError from "../../services/errors/CustomError.js";

import { generateDatabaseErrorInfo } from "../../services/errors/info.js";

class ExpectativasManager {
    #expectativas;
        
    constructor() {
        this.#expectativas = [];
        
    }

    async getExpectativasAsync() {

        try {
            let expectativasBD = await expectativasModel.find();
            //Armo la coleccion de productos con el formato que utilizamos

            this.#expectativas = expectativasBD.map(expectativa => {
                return (
                    {
                        id: expectativa._id.toString(),
                        titulo: expectativa.titulo,
                        descripcion: expectativa.descripcion
                    }
                )
            })
        }
        catch (error) {
            
            //Creo un Custom Error
            const miError = CustomError.createError({
                name: "Error devolviendo Expectativas",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }


        return this.#expectativas;
    }

    async addExpectativaAsync({titulo = "", descripcion = ""}) {
        let nuevaExpectativa;
        

        try {
            //Validaciones
            if (titulo.trim().length === 0) {
                //throw new Error("ERROR: title vacío");
                CustomError.createError({
                    name: "Error creando una Expectativa",
                    cause: "Título vacío",
                    message: "ERROR: Título vacío",
                    code: EErrors.INVALID_TYPES_ERROR
                })

                
            }

            if (descripcion.trim().length === 0) {
                //throw new Error("ERROR: description vacío");
                CustomError.createError({
                    name: "Error creando una Expectativa",
                    cause: "Descripcion vacía",
                    message: "ERROR: Descripción vacía",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            //Agrego la Expectativa a la Base de Datos

            nuevaExpectativa = {
                titulo: titulo,
                descripcion: descripcion  
            }

            let resultado = await expectativasModel.create(nuevaExpectativa);


            //Agrego el nuevo id a nuevoPedido
            nuevaExpectativa = {
                id: resultado._id.toString(),
                ...nuevaExpectativa
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
                name: "Error creando una Expectativa",
                cause: generateDatabaseErrorInfo(error),
                message: error.toString(),
                code: EErrors.DATABASE_ERROR
            })
        }

        return nuevaExpectativa;

    }

    async deleteExpectativaAsync(idExpectativa) {
        
        //Validaciones
        if (!mongoose.isValidObjectId(idExpectativa)) {
            CustomError.createError({
                name: "Error eliminando una Expectativa",
                cause: "idExpectativa inválido",
                message: "ERROR: idExpectativa inválido",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        //Elimino la Expectativa de la Base de Datos

        try {
            await expectativasModel.deleteOne({_id: idExpectativa});
        }
        catch (error) {
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error eliminando una Expectativa",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }

        return true;
    }

    async getExpectativaByIdAsync(idExpectativa) {
        //Validaciones
        if (!mongoose.isValidObjectId(idExpectativa)) {
            CustomError.createError({
                name: "Error obteniendo una Expectativa",
                cause: "idExpectativa inválido",
                message: "ERROR: idExpectativa inválido",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        let expectativa;

        try {
            expectativa = await expectativasModel.findById(idExpectativa);
        }
        catch (error) {
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error obteniendo una Expectativa",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }
        if (!expectativa) {
            CustomError.createError({
                name: "Error obteniendo una Expectativa",
                cause: "Expectativa no encontrada",
                message: "ERROR: Expectativa no encontrada",
                code: EErrors.NOT_FOUND_ERROR
            })
        }
        //Armo el objeto con el formato que utilizamos
        const expectativaFormateada = {
            id: expectativa._id.toString(),
            titulo: expectativa.titulo,
            descripcion: expectativa.descripcion
        }
        //Retorno el objeto formateado
        return expectativaFormateada;
    }

    async updateExpectativaAsync({idExpectativa, titulo = "", descripcion = ""}) {
        //Validaciones
        if (!mongoose.isValidObjectId(idExpectativa)) {
            CustomError.createError({
                name: "Error actualizando una Expectativa",
                cause: "idExpectativa inválido",
                message: "ERROR: idExpectativa inválido",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        if (titulo.trim().length === 0) {
            CustomError.createError({
                name: "Error actualizando una Expectativa",
                cause: "Título vacío",
                message: "ERROR: Título vacío",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        if (descripcion.trim().length === 0) {
            CustomError.createError({
                name: "Error actualizando una Expectativa",
                cause: "Descripción vacía",
                message: "ERROR: Descripción vacía",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        let expectativaActualizada;

        try {
            //Actualizo la Expectativa en la Base de Datos
            let resultado = await expectativasModel.updateOne(
                {_id: idExpectativa},
                {$set: {titulo: titulo, descripcion: descripcion}}
            );  
            //Si no se actualizó nada, lanzo un error
            if (resultado.modifiedCount === 0) {
                CustomError.createError({
                    name: "Error actualizando una Expectativa",
                    cause: "Expectativa no encontrada o no modificada",
                    message: "ERROR: Expectativa no encontrada o no modificada",
                    code: EErrors.DATABASE_ERROR
                })
            }
            //Armo el objeto con el formato que utilizamos
            expectativaActualizada = {
                id: idExpectativa,
                titulo: titulo,
                descripcion: descripcion
            }
        }
        catch (error) {
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error actualizando una Expectativa",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }
        return expectativaActualizada;
    }

}

export default ExpectativasManager; 
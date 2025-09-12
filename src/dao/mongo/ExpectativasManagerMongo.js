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
                        descripcion: expectativa.descripcion,
                        prioridad: expectativa.prioridad ? expectativa.prioridad : 1
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

    async addExpectativaAsync({titulo = "", descripcion = "", prioridad = 1}) {
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
                descripcion: descripcion,
                prioridad: prioridad 
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
            descripcion: expectativa.descripcion,
            prioridad: expectativa.prioridad ? expectativa.prioridad : 1
        }
        //Retorno el objeto formateado
        return expectativaFormateada;
    }

    async updateExpectativaAsync({idExpectativa, titulo, descripcion, prioridad}) {
        let expectativaCambios = {};

        if (titulo) expectativaCambios.titulo = titulo;
        if (descripcion) expectativaCambios.descripcion = descripcion;
        if (prioridad) expectativaCambios.prioridad = prioridad;

        //Validaciones
        if (!mongoose.isValidObjectId(idExpectativa)) {
            CustomError.createError({
                name: "Error actualizando una Expectativa",
                cause: "idExpectativa inválido",
                message: "ERROR: idExpectativa inválido",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        
        let expectativaActualizada;
        let resultado;

        try {
            //Actualizo la Expectativa en la Base de Datos
            resultado = await expectativasModel.findByIdAndUpdate(
                idExpectativa,
                expectativaCambios,
                {new: true} //Para que me devuelva el objeto actualizado)
            );  

            if (!resultado) {
                CustomError.createError({
                    name: "Error actualizando una Expectativa",
                    cause: "Expectativa no encontrada",
                    message: "ERROR: Expectativa no encontrada",
                    code: EErrors.DATABASE_ERROR
                })
            }     

            //Armo el objeto con el formato que utilizamos
            expectativaActualizada = {
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
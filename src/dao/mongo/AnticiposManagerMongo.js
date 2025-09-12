import mongoose from "mongoose";
import anticiposModel from "../models/anticipos.model.js";


//Errores
import EErrors from "../../services/errors/enums.js";
import CustomError from "../../services/errors/CustomError.js";

import { generateDatabaseErrorInfo } from "../../services/errors/info.js";

class AnticiposManager {
    #anticipos;
        
    constructor() {
        this.#anticipos = [];
        
    }

    async getAnticiposAsync() {

        try {
            let anticiposBD = await anticiposModel.find();
            //Armo la coleccion de anticipos con el formato que utilizamos

            this.#anticipos = anticiposBD.map(anticipo => {
                return (
                    {
                        id: anticipo._id.toString(),
                        titulo: anticipo.titulo,
                        descripcion: anticipo.descripcion,
                        tipoVista: anticipo.tipoVista,
                        origenVista: anticipo.origenVista,
                        tipoPath: anticipo.tipoPath,
                        path: anticipo.path
                    }
                )
            })
        }
        catch (error) {
            
            //Creo un Custom Error
            const miError = CustomError.createError({
                name: "Error devolviendo Anticipos",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }

        return this.#anticipos;
    }

    async addAnticipoAsync({titulo = "", descripcion = "", tipoVista = "", origenVista = "", tipoPath = "", path = ""}) {
        let nuevoAnticipo;
        

        try {
            //Validaciones
            if (titulo.trim().length === 0) {
                //throw new Error("ERROR: titulo vacío");
                CustomError.createError({
                    name: "Error creando un Anticipo",
                    cause: "Título vacío",
                    message: "No se puede crear un anticipo sin título",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            if (descripcion.trim().length === 0) {
                //throw new Error("ERROR: descripcion vacía");
                CustomError.createError({
                    name: "Error creando un Anticipo",
                    cause: "Descripción vacía",
                    message: "No se puede crear un anticipo sin descripción",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            if (tipoVista.trim().length === 0) {
                //throw new Error("ERROR: description vacío");
                CustomError.createError({
                    name: "Error creando un Anticipo",
                    cause: "Tipo de Vista vacío",
                    message: "No se puede crear un anticipo sin tipo de vista",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            if (origenVista.trim().length === 0) {
                //throw new Error("ERROR: description vacío");
                CustomError.createError({
                    name: "Error creando un Anticipo",
                    cause: "Origen de Vista vacío",
                    message: "No se puede crear un anticipo sin origen de vista",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            if (tipoPath.trim().length === 0) {
                //throw new Error("ERROR: description vacío");
                CustomError.createError({
                    name: "Error creando un Anticipo",
                    cause: "Tipo de Path vacío",
                    message: "No se puede crear un anticipo sin tipo de path",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            if (path.trim().length === 0) {
                //throw new Error("ERROR: description vacío");
                CustomError.createError({
                    name: "Error creando un Anticipo",
                    cause: "Path vacío",
                    message: "No se puede crear un anticipo sin path",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            //Agrego el Anticipo a la Base de Datos
            nuevoAnticipo = {
                titulo: titulo,
                descripcion: descripcion,
                tipoVista: tipoVista,
                origenVista: origenVista,
                tipoPath: tipoPath,
                path: path
            }

            let resultado = await anticiposModel.create(nuevoAnticipo);
            //Agrego el nuevo id a nuevoAnticipo
            nuevoAnticipo = {
                id: resultado._id.toString(),
                ...nuevoAnticipo
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
                name: "Error creando un Anticipo",
                cause: generateDatabaseErrorInfo(error),
                message: error.toString(),
                code: EErrors.DATABASE_ERROR
            })
        }

        return nuevoAnticipo;
    }


    async updateAnticipoAsync({idAnticipo, titulo, descripcion, tipoVista, origenVista, tipoPath, path}) {
        let anticipoActualizado;
        let anticipoCambios = {};

        if (titulo) anticipoCambios.titulo = titulo;
        if (descripcion) anticipoCambios.descripcion = descripcion;
        if (tipoVista) anticipoCambios.tipoVista = tipoVista;
        if (origenVista) anticipoCambios.origenVista = origenVista;
        if (tipoPath) anticipoCambios.tipoPath = tipoPath;
        if (path) anticipoCambios.path = path;


        
        //Validaciones
        if (!mongoose.isValidObjectId(idAnticipo)) {
            CustomError.createError({
                name: "Error actualizando una Anticipo",
                cause: "idAnticipo inválido",
                message: "ERROR: idAnticipo inválido",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        try {
            //Actualizo el Anticipo en la Base de Datos

            let resultado = await anticiposModel.findByIdAndUpdate(
                idAnticipo,
                anticipoCambios,
                {new: true} //Para que me devuelva el objeto actualizado
            );

            if (!resultado) {
                CustomError.createError({
                    name: "Error actualizando un Anticipo",
                    cause: "Anticipo no encontrado",
                    message: "ERROR: Anticipo no encontrado",
                    code: EErrors.DATABASE_ERROR
                })
            }

            //Armo el objeto con el formato que utilizamos
            anticipoActualizado = {
                id: resultado._id.toString(),
                titulo: resultado.titulo,
                descripcion: resultado.descripcion,
                tipoVista: resultado.tipoVista,
                origenVista: resultado.origenVista,
                tipoPath: resultado.tipoPath,
                path: resultado.path
            }


        }
        catch (error) {
            //Creo un Custom Error
            CustomError.createError({
                name: "Error actualizando un Anticipo",
                cause: generateDatabaseErrorInfo(error),
                message: error.toString(),
                code: EErrors.DATABASE_ERROR
            })
        }

        return anticipoActualizado;
    }

    async deleteAnticipoAsync(idAnticipo) {
        try {
            //Elimino el Anticipo de la Base de Datos
            let resultado = await anticiposModel.deleteOne({_id: idAnticipo});
            //Si no se eliminó nada, lanzo un error
            if (resultado.deletedCount === 0) {
                CustomError.createError({
                    name: "Error eliminando un Anticipo",
                    cause: "Anticipo no encontrado o no eliminado",
                    message: "ERROR: Anticipo no encontrado o no eliminado",
                    code: EErrors.DATABASE_ERROR
                })
            }
        }
        catch (error) {
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error eliminando un Anticipo",
                cause: generateDatabaseErrorInfo(error),
                message: error.toString(),
                code: EErrors.DATABASE_ERROR
            })
        }

        return true;
    }

    async getAnticipoByIdAsync(idAnticipo) {
        let anticipo;
        let anticipoBD;

        try {
            anticipoBD = await anticiposModel.findOne({_id: idAnticipo});
        }
        catch (error) {
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error buscando un Anticipo",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }

        if (!anticipoBD) {
            CustomError.createError({
                name: "Error buscando un Anticipo",
                cause: "Anticipo no encontrado",
                message: "ERROR: Anticipo no encontrado",
                code: EErrors.DATABASE_ERROR
            })
        }

        //Armo el objeto con el formato que utilizamos
        anticipo = {
            id: anticipoBD._id.toString(),
            titulo: anticipoBD.titulo,
            descripcion: anticipoBD.descripcion,
            tipoVista: anticipoBD.tipoVista,
            origenVista: anticipoBD.origenVista,
            tipoPath: anticipoBD.tipoPath,
            path: anticipoBD.path
        }

        return anticipo;
    }

   
}

export default AnticiposManager;


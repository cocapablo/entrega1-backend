import mongoose from "mongoose";
import actividadesModel from "../models/actividades.model.js";


//Errores
import EErrors from "../../services/errors/enums.js";
import CustomError from "../../services/errors/CustomError.js";

import { generateDatabaseErrorInfo } from "../../services/errors/info.js";

class ActividadesManager {
    #actividades;
        
    constructor() {
        this.#actividades = [];
        
    }

    async getActividadesAsync() {

        try {
            let actividadesBD = await actividadesModel.find();
            //Armo la coleccion de actividades con el formato que utilizamos

            this.#actividades = actividadesBD.map(actividad => {
                return (
                    {
                        id: actividad._id.toString(),
                        titulo: actividad.titulo,
                        descripcion: actividad.descripcion,
                        srcImagen: actividad.srcImagen,
                        altImagen: actividad.altImagen
                    }
                )
            })
        }
        catch (error) {
            
            //Creo un Custom Error
            const miError = CustomError.createError({
                name: "Error devolviendo Actividades",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }

        return this.#actividades;
    }

    async addActividadAsync({titulo = "", descripcion = "", srcImagen = "", altImagen = ""}) {
        let nuevaActividad;
        

        try {
            //Validaciones
            if (titulo.trim().length === 0) {
                //throw new Error("ERROR: titulo vacío");
                CustomError.createError({
                    name: "Error creando una Actividad",
                    cause: "Título vacío",
                    message: "No se puede crear una actividad sin título",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            if (descripcion.trim().length === 0) {
                //throw new Error("ERROR: descripcion vacía");
                CustomError.createError({
                    name: "Error creando una Actividad",
                    cause: "Descripción vacía",
                    message: "No se puede crear una actividad sin descripción",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            if (srcImagen.trim().length === 0) {
                //throw new Error("ERROR: srcImagen vacío");
                CustomError.createError({
                    name: "Error creando una Actividad",
                    cause: "srcImagen vacío",
                    message: "No se puede crear una actividad sin srcImagen",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            if (altImagen.trim().length === 0) {
                //throw new Error("ERROR: altImagen vacío");
                CustomError.createError({
                    name: "Error creando una Actividad",
                    cause: "altImagen vacío",
                    message: "No se puede crear una actividad sin altImagen",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }


            //Agrego la Actividad a la Base de Datos
            nuevaActividad = {
                titulo: titulo,
                descripcion: descripcion,
                srcImagen: srcImagen,
                altImagen: altImagen
            }

            let resultado = await actividadesModel.create(nuevaActividad);
            //Agrego el nuevo id a nuevoActividad
            nuevaActividad = {
                id: resultado._id.toString(),
                ...nuevaActividad
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
                name: "Error creando una Actividad",
                cause: generateDatabaseErrorInfo(error),
                message: error.toString(),
                code: EErrors.DATABASE_ERROR
            })
        }

        return nuevaActividad;
    }


    async updateActividadAsync({idActividad, titulo, descripcion, srcImagen, altImagen}) {
        let actividadActualizada;
        let actividadCambios = {};

        if (titulo) actividadCambios.titulo = titulo;
        if (descripcion) actividadCambios.descripcion = descripcion;
        if (srcImagen) actividadCambios.srcImagen = srcImagen;
        if (altImagen) actividadCambios.altImagen = altImagen;


        
        //Validaciones
        if (!mongoose.isValidObjectId(idActividad)) {
            CustomError.createError({
                name: "Error actualizando una Actividad",
                cause: "idActividad inválido",
                message: "ERROR: idActividad inválido",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        try {
            //Actualizo el Actividad en la Base de Datos

            let resultado = await actividadesModel.findByIdAndUpdate(
                idActividad,
                actividadCambios,
                {new: true} //Para que me devuelva el objeto actualizado
            );

            if (!resultado) {
                CustomError.createError({
                    name: "Error actualizando una Actividad",
                    cause: "Actividad no encontrada",
                    message: "ERROR: Actividad no encontrada",
                    code: EErrors.DATABASE_ERROR
                })
            }

            //Armo el objeto con el formato que utilizamos
            actividadActualizada = {
                id: resultado._id.toString(),
                titulo: resultado.titulo,
                descripcion: resultado.descripcion,
                srcImagen: resultado.srcImagen,
                altImagen: resultado.altImagen
            }


        }
        catch (error) {
            //Creo un Custom Error
            CustomError.createError({
                name: "Error actualizando una Actividad",
                cause: generateDatabaseErrorInfo(error),
                message: error.toString(),
                code: EErrors.DATABASE_ERROR
            })
        }

        return actividadActualizada;
    }

    async deleteActividadAsync(idActividad) {
        try {
            //Elimino el Actividad de la Base de Datos
            let resultado = await actividadesModel.deleteOne({_id: idActividad});
            //Si no se eliminó nada, lanzo un error
            if (resultado.deletedCount === 0) {
                CustomError.createError({
                    name: "Error eliminando una Actividad",
                    cause: "Actividad no encontrada o no eliminada",
                    message: "ERROR: Actividad no encontrada o no eliminada",
                    code: EErrors.DATABASE_ERROR
                })
            }
        }
        catch (error) {
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error eliminando una Actividad",
                cause: generateDatabaseErrorInfo(error),
                message: error.toString(),
                code: EErrors.DATABASE_ERROR
            })
        }

        return true;
    }

    async getActividadByIdAsync(idActividad) {
        let actividad;
        let actividadBD;

        try {
            actividadBD = await actividadesModel.findOne({_id: idActividad});
        }
        catch (error) {
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error buscando una Actividad",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }

        if (!actividadBD) {
            CustomError.createError({
                name: "Error buscando una Actividad",
                cause: "Actividad no encontrada",
                message: "ERROR: Actividad no encontrada",
                code: EErrors.DATABASE_ERROR
            })
        }

        //Armo el objeto con el formato que utilizamos
        actividad = {
            id: actividadBD._id.toString(),
            titulo: actividadBD.titulo,
            descripcion: actividadBD.descripcion,
            srcImagen: actividadBD.srcImagen,
            altImagen: actividadBD.altImagen
        }

        return actividad;
    }

   
}

export default ActividadesManager;


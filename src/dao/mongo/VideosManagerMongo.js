import mongoose from "mongoose";
import videosModel from "../models/videos.model.js";


//Errores
import EErrors from "../../services/errors/enums.js";
import CustomError from "../../services/errors/CustomError.js";

import { generateDatabaseErrorInfo } from "../../services/errors/info.js";

class VideosManager {
    #videos;
        
    constructor() {
        this.#videos = [];
        
    }

    async getVideosAsync() {

        try {
            let videosBD = await videosModel.find();
            //Armo la coleccion de videos con el formato que utilizamos

            this.#videos = videosBD.map(video => {
                return (
                    {
                        id: video._id.toString(),
                        titulo: video.titulo,
                        descripcion: video.descripcion,
                        src: video.src
                    }
                )
            })
        }
        catch (error) {
            
            //Creo un Custom Error
            const miError = CustomError.createError({
                name: "Error devolviendo Videos",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }

        return this.#videos;
    }

    async addVideoAsync({titulo = "", descripcion = "", src = ""}) {
        let nuevoVideo;
        

        try {
            //Validaciones
            if (titulo.trim().length === 0) {
                //throw new Error("ERROR: titulo vacío");
                CustomError.createError({
                    name: "Error creando un Video",
                    cause: "Título vacío",
                    message: "No se puede crear un video sin título",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            if (descripcion.trim().length === 0) {
                //throw new Error("ERROR: descripcion vacía");
                CustomError.createError({
                    name: "Error creando un Video",
                    cause: "Descripción vacía",
                    message: "No se puede crear un video sin descripción",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            if (src.trim().length === 0) {
                //throw new Error("ERROR: src vacío");
                CustomError.createError({
                    name: "Error creando un Video",
                    cause: "Src vacío",
                    message: "No se puede crear un video sin src",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            //Agrego el Video a la Base de Datos
            nuevoVideo = {
                titulo: titulo,
                descripcion: descripcion,
                src: src
            }

            let resultado = await videosModel.create(nuevoVideo);
            //Agrego el nuevo id a nuevoVideo
            nuevoVideo = {
                id: resultado._id.toString(),
                ...nuevoVideo
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
                name: "Error creando un Video",
                cause: generateDatabaseErrorInfo(error),
                message: error.toString(),
                code: EErrors.DATABASE_ERROR
            })
        }

        return nuevoVideo;
    }


    async updateVideoAsync({idVideo, titulo, descripcion, src}) {
        let videoActualizado;
        let videoCambios = {};

        if (titulo) videoCambios.titulo = titulo;
        if (descripcion) videoCambios.descripcion = descripcion;
        if (src) videoCambios.src = src;


        
        //Validaciones
        if (!mongoose.isValidObjectId(idVideo)) {
            CustomError.createError({
                name: "Error actualizando una Video",
                cause: "idVideo inválido",
                message: "ERROR: idVideo inválido",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        try {
            //Actualizo el Video en la Base de Datos

            let resultado = await videosModel.findByIdAndUpdate(
                idVideo,
                videoCambios,
                {new: true} //Para que me devuelva el objeto actualizado
            );

            if (!resultado) {
                CustomError.createError({
                    name: "Error actualizando un Video",
                    cause: "Video no encontrado",
                    message: "ERROR: Video no encontrado",
                    code: EErrors.DATABASE_ERROR
                })
            }

            //Armo el objeto con el formato que utilizamos
            videoActualizado = {
                id: resultado._id.toString(),
                titulo: resultado.titulo,
                descripcion: resultado.descripcion,
                src: resultado.src
            }


        }
        catch (error) {
            //Creo un Custom Error
            CustomError.createError({
                name: "Error actualizando un Video",
                cause: generateDatabaseErrorInfo(error),
                message: error.toString(),
                code: EErrors.DATABASE_ERROR
            })
        }

        return videoActualizado;
    }

    async deleteVideoAsync(idVideo) {
        try {
            //Elimino el Video de la Base de Datos
            let resultado = await videosModel.deleteOne({_id: idVideo});
            //Si no se eliminó nada, lanzo un error
            if (resultado.deletedCount === 0) {
                CustomError.createError({
                    name: "Error eliminando un Video",
                    cause: "Video no encontrado o no eliminado",
                    message: "ERROR: Video no encontrado o no eliminado",
                    code: EErrors.DATABASE_ERROR
                })
            }
        }
        catch (error) {
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error eliminando un Video",
                cause: generateDatabaseErrorInfo(error),
                message: error.toString(),
                code: EErrors.DATABASE_ERROR
            })
        }

        return true;
    }

    async getVideoByIdAsync(idVideo) {
        let video;
        let videoBD;

        try {
            videoBD = await videosModel.findOne({_id: idVideo});
        }
        catch (error) {
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error buscando un Video",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }

        if (!videoBD) {
            CustomError.createError({
                name: "Error buscando un Video",
                cause: "Video no encontrado",
                message: "ERROR: Video no encontrado",
                code: EErrors.DATABASE_ERROR
            })
        }

        //Armo el objeto con el formato que utilizamos
        video = {
            id: videoBD._id.toString(),
            titulo: videoBD.titulo,
            descripcion: videoBD.descripcion,
            src: videoBD.src
        }

        return video;
    }

   
}

export default VideosManager;


import { videosService } from "../repositories/index.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

import logger from "../services/logs/logger.js";

import config from "../config/config.js";

export class VideosController {
    #videosService;
        
    constructor() {
        this.#videosService = videosService;
        
        
        this.getVideos = this.getVideos.bind(this);
        this.createVideo = this.createVideo.bind(this);
        this.updateVideo = this.updateVideo.bind(this);
        this.deleteVideo = this.deleteVideo.bind(this);
        this.getVideoById = this.getVideoById.bind(this);
        this.getService = this.getService.bind(this);
      
    }

    getService() {
        return this.#videosService;
    }

    async getVideos(req, res, next) {
        let videos; 

        try {
            videos = await this.#videosService.getVideosAsync();

            logger.debug("Videos devueltos: " + JSON.stringify(videos, null, 2));

        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: {
                videos: videos
            }
            
        });

    }

    async createVideo(req, res, next) {
        let nuevoVideo;
        let videoAgregado;
        
        //Obtengo los datos del nuevo video
        nuevoVideo = req.body;    
        logger.debug("Nuevo Video: " + JSON.stringify(nuevoVideo, null, 2));

        //Validaciones de los datos del video
        if (!nuevoVideo) {
            return next(CustomError.createError({
                name: "Error al crear un nuevo video",
                cause: "No se envió el video",
                message: "Error intentando crear un nuevo video",
                code: EErrors.INVALID_TYPES_ERROR
            }));
        }

        try {
            //Agrego el video
            videoAgregado = await this.#videosService.addVideoAsync(nuevoVideo);
            logger.debug("Video agregado: " + JSON.stringify(videoAgregado, null, 2));
        }
        catch (error) {
            return next(error);
        }

        res.status(201).send({
            status: "success",
            message: "Video creado exitosamente",
            payload: {
                videoAgregado: videoAgregado
            }
            
        });

    }

    async updateVideo(req, res, next) {
        let videoActualizado;
        let idVideo;
        let videoActualizadoDTO;
        
        //Obtengo el id del video a actualizar
        idVideo = req.params.id;
        logger.debug("Id de Video a actualizar: " + idVideo);

        //Obtengo los datos actualizados del video
        videoActualizadoDTO = req.body;    
        logger.debug("Datos actualizados del Video: " + JSON.stringify(videoActualizadoDTO, null, 2));
        

        
        try {
            //Validaciones
            if (!idVideo) {
                CustomError.createError({
                    name: "Error al actualizar un video",
                    cause: "No se envió el id del video",
                    message: "Error intentando actualizar un video",
                    code: EErrors.INVALID_TYPES_ERROR
                });
            }

            if (!videoActualizadoDTO) {
                CustomError.createError({
                    name: "Error al actualizar un video",
                    cause: "No se envió el video actualizado",
                    message: "Error intentando actualizar un video",
                    code: EErrors.INVALID_TYPES_ERROR
                });
            }

            //Paso 1: Actualizo el video en la base de datos
            videoActualizado = await this.#videosService.updateVideoAsync({
                idVideo: idVideo,
                ...videoActualizadoDTO
            });

            logger.debug("Video actualizado: " + JSON.stringify(videoActualizado, null, 2));
        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: {
                videoActualizado: videoActualizado
            }
        });
    }

    async deleteVideo(req, res, next) {
        let idVideo;
        let videoEliminado;
        
        //Obtengo el id del video a eliminar
        idVideo = req.params.id;
        logger.debug("Id de Video a eliminar: " + idVideo);

        //Validaciones
        if (!idVideo) {
            return next(CustomError.createError({
                name: "Error al eliminar un video",
                cause: "No se envió el id del video",
                message: "Error intentando eliminar un video",
                code: EErrors.INVALID_TYPES_ERROR
            }));
        }

        try {
            //Paso 1: Elimino el video de la base de datos
            videoEliminado = await this.#videosService.deleteVideoAsync(idVideo);
            logger.debug("Video eliminado correctamente");
        }
        catch (error) {
            return next(error);
        }
        res.send({
            status: "success",
            message: "Video eliminado correctamente"
        });
    }

    async getVideoById(req, res, next) {
        let idVideo;
        let video;

        //Obtengo el id del video a buscar
        idVideo = req.params.id;
        logger.debug("Id de Video a buscar: " + idVideo);

        //Validaciones
        if (!idVideo) {
            return next(CustomError.createError({
                name: "Error al buscar un video",
                cause: "No se envió el id del video",
                message: "Error intentando buscar un video",
                code: EErrors.INVALID_TYPES_ERROR
            }));
        }

        try {
            //Paso 1: Busco el video en la base de datos
            video = await this.#videosService.getVideoByIdAsync(idVideo);
            logger.debug("Video encontrado: " + JSON.stringify(video, null, 2));
        }
        catch (error) {
            return next(error);
        }
        res.send({
            status: "success",
            payload: {
                video: video
            }
        });
    }
}


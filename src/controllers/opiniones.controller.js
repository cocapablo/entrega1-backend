import { opinionesService } from "../repositories/index.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

import logger from "../services/logs/logger.js";

import config from "../config/config.js";


export class OpinionesController {
    #opinionesService;
        
    constructor() {
        this.#opinionesService = opinionesService;
        
        
        this.getOpiniones = this.getOpiniones.bind(this);
        this.createOpinion = this.createOpinion.bind(this);
        this.updateOpinion = this.updateOpinion.bind(this);
        this.deleteOpinion = this.deleteOpinion.bind(this);
        this.getOpinionById = this.getOpinionById.bind(this);
        this.getService = this.getService.bind(this);
      
    }

    getService() {
        return this.#opinionesService;
    }

    async getOpiniones(req, res, next) {
        let opiniones; 

        try {
            opiniones = await this.#opinionesService.getOpinionesAsync();

            logger.debug("Opiniones devueltas: " + JSON.stringify(opiniones, null, 2));

        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: {
                opiniones: opiniones
            }
            
        });

    }

    async createOpinion(req, res, next) {
        let nuevaOpinion;
        let opinionAgregada;
        
        //Obtengo los datos de la nueva opinion
        nuevaOpinion = req.body;    
        logger.debug("Nueva Opinion: " + JSON.stringify(nuevaOpinion, null, 2));

        try {
            //Paso 1: Agrego la opinion a la base de datos
            opinionAgregada = await this.#opinionesService.addOpinionAsync(nuevaOpinion);
            logger.debug("Opinion agregada: " + JSON.stringify(opinionAgregada, null, 2));
        }
        catch (error) {
            return next(error);
        }
        res.send({
            status: "success",
            payload: {
                opinionAgregada: opinionAgregada
            }
        });
    }


    async updateOpinion(req, res, next) {
        let opinionActualizada;
        let idOpinion;
        let opinionActualizadaDTO;
        
        //Obtengo el id de la opinion a actualizar
        idOpinion = req.params.id;
        logger.debug("Id de Opinion a actualizar: " + idOpinion);

        //Obtengo los datos de la opinion actualizada
        opinionActualizadaDTO = req.body;
        logger.debug("Opinion actualizada: " + JSON.stringify(opinionActualizadaDTO, null, 2));

        try {
            //Paso 2: Actualizo la opinion en la base de datos
            opinionActualizada = await this.#opinionesService.updateOpinionAsync({
                idOpinion: idOpinion,
                ...opinionActualizadaDTO
            });
            logger.debug("Opinion actualizada: " + JSON.stringify(opinionActualizada, null, 2));
        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: {
                opinionActualizada: opinionActualizada
            }
        });
    }

    async deleteOpinion(req, res, next) {
        let idOpinion;
        let opinionEliminada;

        //Obtengo el id de la opinion a eliminar
        idOpinion = req.params.id;
        logger.debug("Id de Opinion a eliminar: " + idOpinion);

        try {
            //Paso 3: Elimino la opinion de la base de datos
            opinionEliminada = await this.#opinionesService.deleteOpinionAsync(idOpinion);
            logger.debug("Opinion eliminada correctamente");
        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            message: "Opinion eliminada correctamente"
        });

    }

    async getOpinionById(req, res, next) {
        let idOpinion;
        let opinion;

        //Obtengo el id de la opinion a obtener
        idOpinion = req.params.id;
        logger.debug("Id de Opinion a obtener: " + idOpinion);

        try {
            //Paso |: Obtengo la opinion de la base de datos
            opinion = await this.#opinionesService.getOpinionByIdAsync(idOpinion);
            logger.debug("Opinion obtenida: " + JSON.stringify(opinion, null, 2));
        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: {
                opinion: opinion
            }
        });
    }


}

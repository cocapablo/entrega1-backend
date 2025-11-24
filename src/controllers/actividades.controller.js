import { actividadesService } from "../repositories/index.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

import logger from "../services/logs/logger.js";

import config from "../config/config.js";

export class ActividadesController {
    #actividadesService;
        
    constructor() {
        this.#actividadesService = actividadesService;
        
        
        this.getActividades = this.getActividades.bind(this);
        this.createActividad = this.createActividad.bind(this);
        this.updateActividad = this.updateActividad.bind(this);
        this.deleteActividad = this.deleteActividad.bind(this);
        this.getActividadById = this.getActividadById.bind(this);
        this.getService = this.getService.bind(this);
      
    }

    getService() {
        return this.#actividadesService;
    }

    async getActividades(req, res, next) {
        let actividades; 

        try {
            actividades = await this.#actividadesService.getActividadesAsync();

            logger.debug("Actividades devueltos: " + JSON.stringify(actividades, null, 2));

        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: {
                actividades: actividades
            }
            
        });

    }

    async createActividad(req, res, next) {
        let nuevaActividad;
        let actividadAgregada;
        
        //Obtengo los datos del nuevo actividad
        nuevaActividad = req.body;    
        logger.debug("Nueva Actividad: " + JSON.stringify(nuevaActividad, null, 2));

        //Validaciones de los datos del actividad
        if (!nuevaActividad) {
            return next(CustomError.createError({
                name: "Error al crear una nueva actividad",
                cause: "No se envió la actividad",
                message: "Error intentando crear una nueva actividad",
                code: EErrors.INVALID_TYPES_ERROR
            }));
        }

        try {
            //Agrego la actividad
            actividadAgregada = await this.#actividadesService.addActividadAsync(nuevaActividad);
            logger.debug("Actividad agregada: " + JSON.stringify(actividadAgregada, null, 2));
        }
        catch (error) {
            return next(error);
        }

        res.status(201).send({
            status: "success",
            message: "Actividad creada exitosamente",
            payload: {
                actividadAgregada: actividadAgregada
            }
            
        });

    }

    async updateActividad(req, res, next) {
        let actividadActualizada;
        let idActividad;
        let actividadActualizadaDTO;
        
        //Obtengo el id del actividad a actualizar
        idActividad = req.params.id;
        logger.debug("Id de Actividad a actualizar: " + idActividad);

        //Obtengo los datos actualizados del actividad
        actividadActualizadaDTO = req.body;    
        logger.debug("Datos actualizados de la Actividad: " + JSON.stringify(actividadActualizadaDTO, null, 2));
        

        
        try {
            //Validaciones
            if (!idActividad) {
                CustomError.createError({
                    name: "Error al actualizar una actividad",
                    cause: "No se envió el id de la actividad",
                    message: "Error intentando actualizar una actividad",
                    code: EErrors.INVALID_TYPES_ERROR
                });
            }

            if (!actividadActualizadaDTO) {
                CustomError.createError({
                    name: "Error al actualizar una actividad",
                    cause: "No se envió la actividad actualizada",
                    message: "Error intentando actualizar una actividad",
                    code: EErrors.INVALID_TYPES_ERROR
                });
            }

            //Paso 1: Actualizo la actividad en la base de datos
            actividadActualizada = await this.#actividadesService.updateActividadAsync({
                idActividad: idActividad,
                ...actividadActualizadaDTO
            });

            logger.debug("Actividad actualizada: " + JSON.stringify(actividadActualizada, null, 2));
        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: {
                actividadActualizada: actividadActualizada
            }
        });
    }

    async deleteActividad(req, res, next) {
        let idActividad;
        let actividadEliminada;
        
        //Obtengo el id de la actividad a eliminar
        idActividad = req.params.id;
        logger.debug("Id de Actividad a eliminar: " + idActividad);

        //Validaciones
        if (!idActividad) {
            return next(CustomError.createError({
                name: "Error al eliminar una actividad",
                cause: "No se envió el id del actividad",
                message: "Error intentando eliminar una actividad",
                code: EErrors.INVALID_TYPES_ERROR
            }));
        }

        try {
            //Paso 1: Elimino la actividad de la base de datos
            actividadEliminada = await this.#actividadesService.deleteActividadAsync(idActividad);
            logger.debug("Actividad eliminada correctamente");
        }
        catch (error) {
            return next(error);
        }
        res.send({
            status: "success",
            message: "Actividad eliminada correctamente"
        });
    }

    async getActividadById(req, res, next) {
        let idActividad;
        let actividad;

        //Obtengo el id del actividad a buscar
        idActividad = req.params.id;
        logger.debug("Id de Actividad a buscar: " + idActividad);

        //Validaciones
        if (!idActividad) {
            return next(CustomError.createError({
                name: "Error al buscar una actividad",
                cause: "No se envió el id del actividad",
                message: "Error intentando buscar una actividad",
                code: EErrors.INVALID_TYPES_ERROR
            }));
        }

        try {
            //Paso 1: Busco la actividad en la base de datos
            actividad = await this.#actividadesService.getActividadByIdAsync(idActividad);
            logger.debug("Actividad encontrada: " + JSON.stringify(actividad, null, 2));
        }
        catch (error) {
            return next(error);
        }
        res.send({
            status: "success",
            payload: {
                actividad: actividad
            }
        });
    }
}


import { anticiposService } from "../repositories/index.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

import logger from "../services/logs/logger.js";

import config from "../config/config.js";

export class AnticiposController {
    #anticiposService;
        
    constructor() {
        this.#anticiposService = anticiposService;
        
        
        this.getAnticipos = this.getAnticipos.bind(this);
        this.createAnticipo = this.createAnticipo.bind(this);
        this.updateAnticipo = this.updateAnticipo.bind(this);
        this.deleteAnticipo = this.deleteAnticipo.bind(this);
        this.getAnticipoById = this.getAnticipoById.bind(this);
        this.getService = this.getService.bind(this);
      
    }

    getService() {
        return this.#anticiposService;
    }

    async getAnticipos(req, res, next) {
        let anticipos; 

        try {
            anticipos = await this.#anticiposService.getAnticiposAsync();

            logger.debug("Anticipos devueltos: " + JSON.stringify(anticipos, null, 2));

        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: {
                anticipos: anticipos
            }
            
        });

    }

    async createAnticipo(req, res, next) {
        let nuevoAnticipo;
        let anticipoAgregado;
        
        //Obtengo los datos del nuevo anticipo
        nuevoAnticipo = req.body;    
        logger.debug("Nuevo Anticipo: " + JSON.stringify(nuevoAnticipo, null, 2));

        //Validaciones de los datos del anticipo
        if (!nuevoAnticipo) {
            return next(CustomError.createError({
                name: "Error al crear un nuevo anticipo",
                cause: "No se envió el anticipo",
                message: "Error intentando crear un nuevo anticipo",
                code: EErrors.INVALID_TYPES_ERROR
            }));
        }

        try {
            //Agrego el anticipo
            anticipoAgregado = await this.#anticiposService.addAnticipoAsync(nuevoAnticipo);
            logger.debug("Anticipo agregado: " + JSON.stringify(anticipoAgregado, null, 2));
        }
        catch (error) {
            return next(error);
        }

        res.status(201).send({
            status: "success",
            message: "Anticipo creado exitosamente",
            payload: {
                anticipoAgregado: anticipoAgregado
            }
            
        });

    }

    async updateAnticipo(req, res, next) {
        let anticipoActualizado;
        let idAnticipo;
        let anticipoActualizadoDTO;
        
        //Obtengo el id del anticipo a actualizar
        idAnticipo = req.params.id;
        logger.debug("Id de Anticipo a actualizar: " + idAnticipo);

        //Obtengo los datos actualizados del anticipo
        anticipoActualizadoDTO = req.body;    
        logger.debug("Datos actualizados del Anticipo: " + JSON.stringify(anticipoActualizadoDTO, null, 2));
        

        
        try {
            //Validaciones
            if (!idAnticipo) {
                CustomError.createError({
                    name: "Error al actualizar un anticipo",
                    cause: "No se envió el id del anticipo",
                    message: "Error intentando actualizar un anticipo",
                    code: EErrors.INVALID_TYPES_ERROR
                });
            }

            if (!anticipoActualizadoDTO) {
                CustomError.createError({
                    name: "Error al actualizar un anticipo",
                    cause: "No se envió el anticipo actualizado",
                    message: "Error intentando actualizar un anticipo",
                    code: EErrors.INVALID_TYPES_ERROR
                });
            }

            //Paso 1: Actualizo el anticipo en la base de datos
            anticipoActualizado = await this.#anticiposService.updateAnticipoAsync({
                idAnticipo: idAnticipo,
                ...anticipoActualizadoDTO
            });

            logger.debug("Anticipo actualizado: " + JSON.stringify(anticipoActualizado, null, 2));
        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: {
                anticipoActualizado: anticipoActualizado
            }
        });
    }

    async deleteAnticipo(req, res, next) {
        let idAnticipo;
        let anticipoEliminado;
        
        //Obtengo el id del anticipo a eliminar
        idAnticipo = req.params.id;
        logger.debug("Id de Anticipo a eliminar: " + idAnticipo);

        //Validaciones
        if (!idAnticipo) {
            return next(CustomError.createError({
                name: "Error al eliminar un anticipo",
                cause: "No se envió el id del anticipo",
                message: "Error intentando eliminar un anticipo",
                code: EErrors.INVALID_TYPES_ERROR
            }));
        }

        try {
            //Paso 1: Elimino el anticipo de la base de datos
            anticipoEliminado = await this.#anticiposService.deleteAnticipoAsync(idAnticipo);
            logger.debug("Anticipo eliminado correctamente");
        }
        catch (error) {
            return next(error);
        }
        res.send({
            status: "success",
            message: "Anticipo eliminado correctamente"
        });
    }

    async getAnticipoById(req, res, next) {
        let idAnticipo;
        let anticipo;

        //Obtengo el id del anticipo a buscar
        idAnticipo = req.params.id;
        logger.debug("Id de Anticipo a buscar: " + idAnticipo);

        //Validaciones
        if (!idAnticipo) {
            return next(CustomError.createError({
                name: "Error al buscar un anticipo",
                cause: "No se envió el id del anticipo",
                message: "Error intentando buscar un anticipo",
                code: EErrors.INVALID_TYPES_ERROR
            }));
        }

        try {
            //Paso 1: Busco el anticipo en la base de datos
            anticipo = await this.#anticiposService.getAnticipoByIdAsync(idAnticipo);
            logger.debug("Anticipo encontrado: " + JSON.stringify(anticipo, null, 2));
        }
        catch (error) {
            return next(error);
        }
        res.send({
            status: "success",
            payload: {
                anticipo: anticipo
            }
        });
    }
}


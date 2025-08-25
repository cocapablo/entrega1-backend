import { expectativasService } from "../repositories/index.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

import logger from "../services/logs/logger.js";

import config from "../config/config.js";


export class ExpectativasController {
    #expectativasService;
        
    constructor() {
        this.#expectativasService = expectativasService;
        
        
        this.getExpectativas = this.getExpectativas.bind(this);
        this.createExpectativa = this.createExpectativa.bind(this);
        this.updateExpectativa = this.updateExpectativa.bind(this);
        this.deleteExpectativa = this.deleteExpectativa.bind(this);
        this.getExpectativaById = this.getExpectativaById.bind(this);
        this.getService = this.getService.bind(this);
      
    }

    getService() {
        return this.#expectativasService;
    }

    async getExpectativas(req, res, next) {
        let expectativas; 

        try {
            expectativas = await this.#expectativasService.getExpectativasAsync();

            logger.debug("Expectativas devueltas: " + JSON.stringify(expectativas, null, 2));

        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: {
                expectativas: expectativas
            }
            
        });

    }

    async createExpectativa(req, res, next) {
        let nuevaExpectativa;
        let expectativaAgregada;
        
        //Obtengo los datos de la nueva expectativa
        nuevaExpectativa = req.body;    
        logger.debug("Nueva Expectativa: " + JSON.stringify(nuevaExpectativa, null, 2));

        try {
            //Paso 1: Agrego la expectativa a la base de datos
            expectativaAgregada = await this.#expectativasService.addExpectativaAsync(nuevaExpectativa);
            logger.debug("Expectativa agregada: " + JSON.stringify(expectativaAgregada, null, 2));
        }
        catch (error) {
            return next(error);
        }
        res.send({
            status: "success",
            payload: {
                expectativaAgregada: expectativaAgregada
            }
        });
    }


    async updateExpectativa(req, res, next) {
        let expectativaActualizada;
        let idExpectativa;
        let expectativaActualizadaDTO;
        
        //Obtengo el id de la expectativa a actualizar
        idExpectativa = req.params.id;
        logger.debug("Id de Expectativa a actualizar: " + idExpectativa);

        //Obtengo los datos de la expectativa actualizada
        expectativaActualizadaDTO = req.body;
        logger.debug("Expectativa actualizada: " + JSON.stringify(expectativaActualizadaDTO, null, 2));

        try {
            //Paso 2: Actualizo la expectativa en la base de datos
            expectativaActualizada = await this.#expectativasService.updateExpectativaAsync({
                idExpectativa: idExpectativa,
                ...expectativaActualizadaDTO
            });
            logger.debug("Expectativa actualizada: " + JSON.stringify(expectativaActualizada, null, 2));
        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: {
                expectativaActualizada: expectativaActualizada
            }
        });
    }

    async deleteExpectativa(req, res, next) {
        let idExpectativa;
        let expectativaEliminada;

        //Obtengo el id de la expectativa a eliminar
        idExpectativa = req.params.id;
        logger.debug("Id de Expectativa a eliminar: " + idExpectativa);

        try {
            //Paso 3: Elimino la expectativa de la base de datos
            expectativaEliminada = await this.#expectativasService.deleteExpectativaAsync(idExpectativa);
            logger.debug("Expectativa eliminada correctamente");
        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            message: "Expectativa eliminada correctamente"
        });

    }

    async getExpectativaById(req, res, next) {
        let idExpectativa;
        let expectativa;

        //Obtengo el id de la expectativa a obtener
        idExpectativa = req.params.id;
        logger.debug("Id de Expectativa a obtener: " + idExpectativa);

        try {
            //Paso |: Obtengo la expectativa de la base de datos
            expectativa = await this.#expectativasService.getExpectativaByIdAsync(idExpectativa);
            logger.debug("Expectativa obtenida: " + JSON.stringify(expectativa, null, 2));
        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: {
                expectativa: expectativa
            }
        });
    }


}

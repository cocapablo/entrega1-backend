import { pedidosDePresupuestoService } from "../repositories/index.js";

import { ImproConcertPedidoDePresupuestoDTO } from "../dao/DTOs/pedidodepresupuesto.dto.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

import logger from "../services/logs/logger.js";

import MailingService from "../services/mailing/mailing.js";
import config from "../config/config.js";


export class PedidosDePresupuestoController {
    #pedidosDePresupuestoService;
        
    constructor() {
        this.#pedidosDePresupuestoService = pedidosDePresupuestoService;
        
        
        this.getPedidosDePresupuesto = this.getPedidosDePresupuesto.bind(this);
        this.createPedidoDePresupuesto = this.createPedidoDePresupuesto.bind(this);
        
    }

    getService() {
        return this.#pedidosDePresupuestoService;
    }

    async getPedidosDePresupuesto(req, res, next) {
        let pedidos; 

        try {
            pedidos = await this.#pedidosDePresupuestoService.getPedidosDePresupuestoAsync();

            logger.debug("Pedidos de Presupuesto devueltos: " + JSON.stringify(pedidos, null, 2));

        }
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: pedidos
        });

    }

    async createPedidoDePresupuesto(req, res, next) {
        let nuevoPedido;
        let pedidoAgregado;
        let urlBase;
        
        //Obtengo los datos del nuevo producto
        nuevoPedido = req.body;
        urlBase = req.get('host');

        logger.debug("Origen del Pedido de Presupuesto: " + urlBase);

        /*
        if (urlBase.includes("improconcert")) {
            nuevoPedido = new ImproConcertPedidoDePresupuestoDTO(nuevoPedido);
        }
        */

        nuevoPedido = {
            origen: urlBase,
            ...nuevoPedido
        }
        
        try {
            pedidoAgregado = await this.#pedidosDePresupuestoService.addPedidoDePresupuestoAsync(nuevoPedido);

        } 
        catch (error) {
            return next(error);
        }

        res.send({
            status: "success",
            payload: pedidoAgregado
        });
          
    }
}
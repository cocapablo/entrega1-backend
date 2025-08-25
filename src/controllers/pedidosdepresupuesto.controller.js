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
        this.getService = this.getService.bind(this);
        
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
        let urlOrigen;
        
        
        //Obtengo los datos del nuevo producto
        nuevoPedido = req.body;
        
        urlOrigen = req.headers.origin;

        logger.debug("Origen del Pedido de Presupuesto: " + urlOrigen);

        /*
        if (urlBase.includes("improconcert")) {
            nuevoPedido = new ImproConcertPedidoDePresupuestoDTO(nuevoPedido);
        }
        */

        nuevoPedido = {
            origen: urlOrigen,
            ...nuevoPedido
        }

        console.log("Pedido a hacer:", nuevoPedido);
        
        try {
            //Paso 1: Agrego el pedido a la base de datos
            pedidoAgregado = await this.#pedidosDePresupuestoService.addPedidoDePresupuestoAsync(nuevoPedido);

            //Paso 2: Envio el mail
            const correoOptions = {
                from : "superstore@gmail.com",
                to: "info@improconcert.com",
                cc: "cocapablo@gmail.com",
                replyTo : pedidoAgregado.email,
                subject: "Pedido de Presupuesto desde  " + pedidoAgregado.origen,
                html: `<head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
                            <title>SuperStore</title>
                        </head>
                        <body>
                            <h1 style="text-align: center;"> SuperStore - Pedido de Presupuesto </h1>
                            <p> El pedido fué realizado el  ${pedidoAgregado.fechadelpedido.getDate()}/${pedidoAgregado.fechadelpedido.getMonth() + 1}/${pedidoAgregado.fechadelpedido.getFullYear()} a las ${pedidoAgregado.fechadelpedido.getHours()}:${pedidoAgregado.fechadelpedido.getMinutes()}:${pedidoAgregado.fechadelpedido.getSeconds()} </p>
                            <div style="margin:10px; padding:5px">
                                <p><strong>Nombre: </strong>${pedidoAgregado.nombre}</p>
                                <p><strong>Mail: </strong>${pedidoAgregado.email}</p>
                                <p><strong>Telefono: </strong>${pedidoAgregado.telefono}</p>
                                <p><strong>Tipo de Evento: </strong>${pedidoAgregado.tipodeevento}</p>
                                <p><strong>Localidad: </strong>${pedidoAgregado.localidad}</p>
                                <p><strong>País: </strong>${pedidoAgregado.pais}</p>
                                <p><strong>Cantidad de Invitados: </strong>${pedidoAgregado.cantidaddeinvitados}</p>
                                <p><strong>Fecha: </strong>${pedidoAgregado.fecha}</p>
                                <p><strong>Comentario: </strong>${pedidoAgregado.comentario}</p>
                            </div>
                            
                            <p> Atentamente SuperStore  </p>
                            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
                        </body>
                    `
                }

            const mailer = new MailingService();    
        
            let resultado = await mailer.sendSimpleMail(correoOptions);

            console.log("Resultado del envio de mail: ", resultado);
            logger.debug("Resultado del envio de mail: ", resultado);

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
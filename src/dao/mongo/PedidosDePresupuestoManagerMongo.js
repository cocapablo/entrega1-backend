import mongoose from "mongoose";
import pedidosdepresupuestoModel from "../models/pedidosdepresupuesto.model.js";


//Errores
import EErrors from "../../services/errors/enums.js";
import CustomError from "../../services/errors/CustomError.js";

import { generateDatabaseErrorInfo } from "../../services/errors/info.js";

class PedidosDePresupuestoManager {
    #pedidosdepresupuesto;
        
    constructor() {
        this.#pedidosdepresupuesto = [];
        
    }

    async getPedidosDePresupuestoAsync() {

        try {
            let pedidosBD = await pedidosdepresupuestoModel.find();
            //Armo la coleccion de productos con el formato que utilizamos

            this.#pedidosdepresupuesto = pedidosBD.map(pedido => {
                return (
                    {
                        id: pedido._id.toString(),
                        origen: pedido.origen,
                        nombre: pedido.nombre,
                        email: pedido.email,
                        telefono: pedido.telefono,
                        tipodeevento: pedido.tipodeevento,
                        localidad: pedido.localidad,
                        pais: pedido.pais,
                        cantidaddeinvitados: pedido.cantidaddeinvitados,
                        fecha: pedido.fecha,
                        comentario: pedido.comentario  
                    
                    }
                )
            })
        }
        catch (error) {
            
            //Creo un Custom Error
            const miError = CustomError.createError({
                name: "Error devolviendo Pedidos de Presupuesto",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }


        return this.#pedidosdepresupuesto;
    }

    async addPedidoDePresupuestoAsync({origen = "Desconocido", nombre = "", email = "", telefono = "-", tipodeevento = "-", localidad = "-", pais = "-", cantidaddeinvitados = 0, fecha = "-", comentario = "-"}) {
        let nuevoPedido;

        try {
            //Validaciones
            if (nombre.trim().length === 0) {
                //throw new Error("ERROR: title vacío");
                CustomError.createError({
                    name: "Error creando un Pedido de Presupuesto",
                    cause: "ERROR: Nombre vacío",
                    code: EErrors.INVALID_TYPES_ERROR
                })

                
            }

            if (email.trim().length === 0) {
                //throw new Error("ERROR: description vacío");
                CustomError.createError({
                    name: "Error creando un Pedido de Presupuesto",
                    cause: "Email vacío",
                    message: "ERROR: Email vacío",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            //Agrego el Pedido de Presupuesto

            nuevoPedido = {
                origen,
                nombre,
                email,
                telefono,
                tipodeevento,
                localidad,
                pais,
                cantidaddeinvitados,
                fecha,
                comentario  
            }

            let resultado = await pedidosdepresupuestoModel.create(nuevoPedido);


            //Agrego el nuevo id a nuevoPedido
            nuevoPedido = {
                id: resultado._id.toString(),
                ...nuevoPedido
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
                name: "Error creando un Pedido de Presupuesto",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }

        return nuevoPedido;

    }
}

export default PedidosDePresupuestoManager; 
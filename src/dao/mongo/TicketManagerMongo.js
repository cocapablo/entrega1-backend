import mongoose from "mongoose";
import ticketModel from "../models/tickets.model.js";

class TicketManager {
    #tickets;

    constructor() {
        this.#tickets = [];   
    }

    async addTicketAsync({amount = -1, purchaser = "", }) {
        let code = "";
        let purchase_datetime;
        let newTicket;

        try {
            //Validaciones
            if (amount <= 0) {
                throw new Error("ERROR: amount inválido");    
            }

            if (purchaser.trim().length === 0) {
                throw new Error("ERROR: purchaser vacío");
            }

            //Genero code
            code = this.#generarCode();

            //Fecha de creación del ticket
            purchase_datetime = new Date();

            //Creo el Ticket en la Base de Datos
            newTicket = {
                code,
                purchase_datetime,
                amount,
                purchaser 
            }

            console.log("Nuevo Ticket: ", newTicket); 

            let resultado = await ticketModel.create(newTicket);

            console.log("Resultado Crear Ticket: ", resultado); 

            //Agrego el nuevo id a newTicket
            newTicket = {
                id: resultado._id.toString(),
                ...newTicket
            }

            this.#tickets.push(newTicket);

        }
        catch (error) {
            throw (error);    
        }

        return newTicket;
    }

    #generarCode() {
        let code;
    
        code = Date.now().toString() + Math.floor(Math.random() * 10000 + 1).toString();

        console.log("Code generado: ", code);

        return code;
    }

}

export default TicketManager;
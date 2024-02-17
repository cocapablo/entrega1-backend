import mongoose from "mongoose";
import chatModel from "./models/chatModel.js";


class ChatManager {
    #ioServer;
    #users;

    constructor(ioServer) {
        this.#ioServer = ioServer;
        this.#users= {};
    }   

    async nuevoUsuario(socket, username) {
        
        //Agrego al usuario al objeto users (en el futuro a la base de datos)
        this.#users[socket.id] = username;
        this.#ioServer.emit("userConnected", username);
    }

    async enviarMensaje(socket, message) {
        try {
            const username = this.#users[socket.id];

            if (!username) return;

            //Grabo el mensaje en la Base de Datos
            let resultado = await chatModel.create({user: username, message: message});
            console.log("Resultado nuevo mensaje: ", resultado);
            this.#ioServer.emit("message", { username, message })
        }
        catch (error) {
            console.log("ERROR: ", error);
            this.#ioServer.emit("error", error);
        }
    }

    async desconectarUsuario(socket) {
        try {
            //Desconecto al usuario, y borro sus mensajes de la base de datos (revisar si esto quedaría así o no)
            const username = this.#users[socket.id];
            
            if (!username) return;

            delete this.#users[socket.id];

            let resultado = await chatModel.deleteMany({user: username});
            console.log("Resultado de desconectar al usuario: ", resultado);

            this.#ioServer.emit("userDisconnected", username);    
      
        }
        catch (error) {
            console.log("ERROR: ", error);
            this.#ioServer.emit("error", error);
        }
    }
}

export default ChatManager;


import dotenv from "dotenv";
//import { MODOBD }  from "../process.js";

//console.log("MODOBD", MODOBD);

const MODOBD = "CLOUD";

//const MODODB = program.opts().mododb || "LOCAL";

/* dotenv.config({
    path: MODOBD === "LOCAL" ? "./src/config/.env.local" : "./src/config/.env.cloud"
}); */

export function configurarEntorno(opciones) {
    let modobd = "LOCAL";
    let config = {};

    opciones.Modobd && (modobd = opciones.Modobd);

    dotenv.config({
        path: modobd === "LOCAL" ? "./src/config/.env.local" : "./src/config/.env.cloud"
    })

    //Configuro config
    config = {
        port: process.env.PORT,
        mongoUrl: process.env.MONGO_URL,
        adminEmail: process.env.ADMIN_EMAIL,
        adminPassword: process.env.ADMIN_PASSWORD    
    }

    return config;

}

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD

}
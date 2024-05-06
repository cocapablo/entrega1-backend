import dotenv from "dotenv";
import { Command } from "commander";



const MODOBD = "CLOUD";

//Cargo las configuraciones del entorno
const program = new Command();

program
    .option("-modobd <modobd>", "Define si la Base de Datos es local o está en la nube", "CLOUD")
    .option("-persistence <persistence>", "Define el modelo de persistencia a utilizar", "MONGO");
    
program.parse();

//console.log("Program Options", program.options);
//console.log("Program opts", program.opts());
//console.log("Remaining arguments", program.args);

export function configurarEntorno(opciones) {
    let modobd = "LOCAL";
    let persistence = null;
    let config = {};

    opciones.Modobd && (modobd = opciones.Modobd);
    opciones.Persistence && (persistence = opciones.Persistence);

    dotenv.config({
        path: modobd === "LOCAL" ? "./src/config/.env.local" : "./src/config/.env.cloud"
    })

    //Configuro config
    config = {
        port: process.env.PORT,
        persistence: persistence || process.env.PERSISTENCE,
        mongoUrl: process.env.MONGO_URL,
        adminEmail: process.env.ADMIN_EMAIL,
        adminPassword: process.env.ADMIN_PASSWORD,
        env: process.env.ENV    
    }

    return config;

}

//Cargo el entorno
let config = configurarEntorno(program.opts());

export default {
    port: config.port,
    persistence: config.persistence,
    mongoUrl: config.mongoUrl,
    adminEmail: config.adminEmail,
    adminPassword: config.adminPassword,
    env: process.env.ENV    

}
import express from "express";
import logger from "../services/logs/logger.js";


const router = express.Router();

router.get("/loggerTest", (req, res) => {
    //Prueba de logs
    //http se hace automáticamente por el middleware addLogger
    req.logger.warning(`ALERTA!! - ${req.method} en ${req.url} - Dia: ${new Date().toLocaleDateString()} - Hora: ${new Date().toLocaleTimeString()}`);
    req.logger.info(`INFO!! - ${req.method} en ${req.url} - Dia: ${new Date().toLocaleDateString()} - Hora: ${new Date().toLocaleTimeString()}`);
    req.logger.fatal(`FATAL!! - ${req.method} en ${req.url} - Dia: ${new Date().toLocaleDateString()} - Hora: ${new Date().toLocaleTimeString()}`);
    req.logger.debug(`FATAL!! - ${req.method} en ${req.url} - Dia: ${new Date().toLocaleDateString()} - Hora: ${new Date().toLocaleTimeString()}`);
    req.logger.error(`ERROR!! - ${req.method} en ${req.url} - Dia: ${new Date().toLocaleDateString()} - Hora: ${new Date().toLocaleTimeString()}`);
    res.send({message: "Prueba de logger"});
})



export default router;
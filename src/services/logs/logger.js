import winston, { transports } from "winston";
import config from "../../config/config.js";

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "white"
    }
};

const devLogger = winston.createLogger({
    //Custom
    //Levels
    levels: customLevelOptions.levels,
    
    transports: [
        new winston.transports.Console({
            level: "debug",  //Este nivel va a reemplazar a la mayoría de los console.log

            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors}),
                winston.format.simple()
    
            )
            
        }),
        
        new winston.transports.File({
            filename: "./errors.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})

const prodLogger = winston.createLogger({
    //Custom
    //Levels
    levels: customLevelOptions.levels,
    
    transports: [
        new winston.transports.Console({
            level: "info",  

            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors}),
                winston.format.simple()
    
            )
            
        }),
        
        new winston.transports.File({
            filename: "./errors.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})

//Me fijo en que entorno estoy
let entorno = "DEV";

config.env && (config.env === "PROD") && (entorno = config.env);

const logger = (entorno === "PROD") ? prodLogger : devLogger;



winston.addColors(customLevelOptions.colors);

Object.keys(customLevelOptions.levels).forEach((level) => {
    logger[level] = function (message) {
        let sFecha = `Dia: ${new Date().toLocaleDateString()} - Hora: ${new Date().toLocaleTimeString()}`;
        let sMensaje = `${message} - ${sFecha}`;
        logger.log({
            level: level, message: sMensaje});
    }
})

export const addLogger = (req, res, next) => {
    req.logger = logger;
    //req.logger.http([`${req.method} en ${req.url} - Dia: ${new Date().toLocaleDateString()} - Hora: ${new Date().toLocaleTimeString()}`]);
    req.logger.http([`${req.method} en ${req.url}`]);
    next();
}

export default logger;
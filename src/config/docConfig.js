import __dirname from "../services/path/pathUtils.js";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";

const apis = path.join(__dirname, "/docs/**/*.yaml");
//console.log("Apis", apis);

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación Api de SuperStore",
            version: "1.0.0",
            description: "Definición de endpoints para la Api de SuperStore"
        }
    },
    apis: [`${apis}`] //Estos son los archivos de configuración

}

//crear una variable que interprete las opciones
export const swaggerEspec = swaggerJsDoc(swaggerOptions);
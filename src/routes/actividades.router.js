import express from "express";
import cors from "cors";

import { ActividadesController } from "../controllers/actividades.controller.js";

//Middlewares
import { applyPolicies } from "../middlewares/sessionMiddleware.js";



const corsOptions = {
    origin: ['https://improconcert.com', 'http://improconcert.com', 'https://www.improconcert.com', 'http://www.improconcert.com', 'https://pablococa-web.netlify.app', 'https://stereotiposhumor.com', 'http://stereotiposhumor.com', 'https://www.stereotiposhumor.com', 'http://www.stereotiposhumor.com'] , // Cambia esto al dominio que desees permitir
    optionsSuccessStatus: 200, // Algunos navegadores antiguos (como IE11) no manejan bien el código 204
  };

const corsOptionsLocal = {
    origin: ['https://improconcert.com', 'http://improconcert.com', 'https://www.improconcert.com', 'http://www.improconcert.com', 'https://pablococa-web.netlify.app', 'https://stereotiposhumor.com', 'http://stereotiposhumor.com', 'https://www.stereotiposhumor.com', 'http://www.stereotiposhumor.com', 'http://localhost:5173'] , // Cambia esto al dominio que desees permitir
    optionsSuccessStatus: 200, // Algunos navegadores antiguos (como IE11) no manejan bien el código 204
  };

const router = express.Router();

router.use(cors(corsOptions));

const actividadesController = new ActividadesController();

router.get("/api/actividades", actividadesController.getActividades);

router.post("/api/actividades", actividadesController.createActividad); //Falta validación de permisos

router.put("/api/actividades/:id", actividadesController.updateActividad); //Falta validación de permisos

router.delete("/api/actividades/:id", actividadesController.deleteActividad); //Falta validación de permisos

router.get("/api/actividades/:id", actividadesController.getActividadById); //Falta validación de permisos



export default router;
import express from "express";
import cors from "cors";

import { ExpectativasController } from "../controllers/expectativas.controller.js";

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

const expectativasController = new ExpectativasController();

router.get("/api/expectativas", expectativasController.getExpectativas);

router.post("/api/expectativas", expectativasController.createExpectativa); //Falta validación de permisos

router.put("/api/expectativas/:id", expectativasController.updateExpectativa); //Falta validación de permisos

router.delete("/api/expectativas/:id", expectativasController.deleteExpectativa); //Falta validación de permisos

router.get("/api/expectativas/:id", expectativasController.getExpectativaById); //Falta validación de permisos



export default router;
import express from "express";
import cors from "cors";

import { PedidosDePresupuestoController } from "../controllers/pedidosdepresupuesto.controller.js";

//Middlewares
import { applyPolicies } from "../middlewares/sessionMiddleware.js";

const corsOptions = {
    origin: ['https://improconcert.com', 'http://improconcert.com'] , // Cambia esto al dominio que desees permitir
    optionsSuccessStatus: 200, // Algunos navegadores antiguos (como IE11) no manejan bien el código 204
  };

const router = express.Router();

const pedidosDePresupuestoController = new PedidosDePresupuestoController();

router.get("/api/pedidosdepresupuesto", pedidosDePresupuestoController.getPedidosDePresupuesto);

router.post("/api/pedidosdepresupuesto", cors(corsOptions), pedidosDePresupuestoController.createPedidoDePresupuesto);

export default router;

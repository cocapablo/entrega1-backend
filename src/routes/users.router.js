import express from "express";

import { CartController } from "../controllers/carts.controller.js";
import { ProductController } from "../controllers/products.controller.js";
import { UserController } from "../controllers/users.controller.js";

const productController = new ProductController();
const cartController = new CartController(productController);
const userController = new UserController(cartController);

const router = express.Router();

router.put("/api/users/premium/:uid", userController.intercambiarPremiumYUsuario);

export default router;
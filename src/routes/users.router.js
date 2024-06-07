import express from "express";

import { CartController } from "../controllers/carts.controller.js";
import { ProductController } from "../controllers/products.controller.js";
import { UserController } from "../controllers/users.controller.js";

const productController = new ProductController();
const cartController = new CartController(productController);
const userController = new UserController(cartController);

const router = express.Router();

router.put("/api/users/premium/:uid", userController.intercambiarPremiumYUsuario);

router.delete("/api/users/:uid", userController.deleteUser);

router.delete("/api/users", userController.deleteUserByEmail);

export default router;
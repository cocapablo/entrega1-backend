import express from "express";

import { CartController } from "../controllers/carts.controller.js";
import { ProductController } from "../controllers/products.controller.js";
import { UserController } from "../controllers/users.controller.js";


import uploader from "../middlewares/uploader.js";

const productController = new ProductController();
const cartController = new CartController(productController);
const userController = new UserController(cartController);

const multerFields = [
    {
        name: "profile", 
        maxcount: 1    
    },
    {
        name: "identificacion", 
        maxcount: 1    
    },
    {
        name: "domicilio", 
        maxcount: 1    
    },
    {
        name: "estadodecuenta", 
        maxcount: 1    
    },
];

const router = express.Router();

router.put("/api/users/premium/:uid", userController.intercambiarPremiumYUsuario);

router.delete("/api/users/:uid", userController.deleteUser);

router.delete("/api/users", userController.deleteUserByEmail);

router.post("/api/users/:uid/documents", uploader.fields(multerFields), userController.addDocumentsToUser);

export default router;
import express from "express";
//import ProductManager from "../dao/ProductManager.js";
//import ProductManager from "../dao/ProductManagerMongo.js";
import { prodManager } from "../app.js";

const router = express.Router();

router.get("/", (req, res) => {
    //Obtengo un aray de los productos actuales
    
    prodManager.getProductsAsync().then(
        productos => {
            res.render("home", { productos });
        }
    )
});


router.get("/realtimeproducts", (req, res) => {
    //Obtengo un aray de los productos actuales
    
    prodManager.getProductsAsync().then(
        productos => {
            res.render("realtimeproducts", { productos });
        }
    )
});

router.get("/chat", (req, res) => {
    res.render("chat");
})


export default router;
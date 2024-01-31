import express from "express";
import ProductManager from "../ProductManager.js";

const router = express.Router();

router.get("/", (req, res) => {
    //Obtengo un aray de los productos actuales
    let prodManager = new ProductManager("productos.json");

    prodManager.getProductsAsync().then(
        productos => {
            res.render("home", { productos });
        }
    )
});


router.get("/realtimeproducts", (req, res) => {
    //Obtengo un aray de los productos actuales
    let prodManager = new ProductManager("productos.json");

    prodManager.getProductsAsync().then(
        productos => {
            res.render("realtimeproducts", { productos });
        }
    )
});


router.get("/desgracias", (req, res) => {
    res.render("desgracias", {});
})

export default router;
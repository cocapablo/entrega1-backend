import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CarritoManager from "../dao/CarritoManager.js";
import { cartManager } from "../app.js";

const router = express.Router();


router.get("/api/carts", (req, res) => {
    //let prodManager = new ProductManager("productos.json");
    //let cartManager = new CarritoManager("carrito.json", prodManager);

    cartManager.getCarritosAsync().then(
        carritos => {
            console.log("Carritos devueltos: ", carritos);

            res.send(carritos);
        }        
    );


});

router.get("/api/carts/:cid", (req, res) => {
    //let prodManager = new ProductManager("productos.json");
    //let cartManager = new CarritoManager("carrito.json", prodManager);
    let idCarrito;
    
    if (req.params.cid) {
        idCarrito = req.params.cid;
        cartManager.getProductsDeCarritoByIdAsync(idCarrito).then(
            productos => {
                console.log("Productos del carrito: ", productos);
                res.send(productos);
            }
        )
        .catch(error => {
            console.log("ERROR: ", error);
            res.send({error});
        })
    }
    else {
        res.send({ERROR: "Debe especificar un id carrito válido"});
    }
});

router.post("/api/carts", (req, res) => {
    //let prodManager = new ProductManager("productos.json");
    //let cartManager = new CarritoManager("carrito.json", prodManager);
    

    cartManager.addCarritoAsync().then(carritoAgregado => {
        res.json({
            status: "accepted",
            message: "Carrito agregado correctamente",
            nuevoCarrito: carritoAgregado
        })
    }
    ).catch(err => {
        console.log("ERROR: ", err);
        res.status(404).json({
            status: "ERROR",
            error: err.toString()
        })
    })

});

router.post("/api/carts/:cid/product/:pid", (req, res) => {
    //let prodManager = new ProductManager("productos.json");
    //let cartManager = new CarritoManager("carrito.json", prodManager);
    let idCarrito;
    let idProducto;
    
    if (req.params.cid && req.params.pid) {
        idCarrito = req.params.cid;
        idProducto = req.params.pid;
        cartManager.addProductToCarritoAsync(idCarrito, idProducto).then(carritoAgregado => {
            res.json({
                status: "accepted",
                message: "Producto agregado al Carrito correctamente",
                nuevoCarrito: carritoAgregado
            })
        }
        ).catch(err => {
            console.log("ERROR: ", err);
            res.status(404).json({
                status: "ERROR",
                error: err.toString()
            })
        })
    }
    else {
        res.status(404).json({
            status: "ERROR",
            error: "Debe especificar un idCarrito y un idProducto válidos"
        })   
    }


});



export default router;
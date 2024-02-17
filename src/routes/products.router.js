import express from "express";
//import ProductManager from "../dao/ProductManager.js";
//import ProductManager from "../dao/ProductManagerMongo.js";
import {socketServer, prodManager} from "../app.js";

const router = express.Router();


router.get("/api/products", async (req, res) => {
    let consultas = req.query;
    let limite; 
    let productos;


    try {
        if (consultas.limit && !isNaN(limite = parseInt(consultas.limit))) {
            //Hay un limite especificado
            productos = await prodManager.getProductsByLimitAsync(limite);
            console.log("Productos limitados: ", productos);
        }
        else {
            //No hay un limite especificado
            productos = await prodManager.getProductsAsync();
        }
    }
    catch (err) {
        console.log("ERROR: ", err);
        res.status(404).json({
            status: "ERROR",
            error: err.toString()
        });
    }
    
    res.send(productos);
               
   
});

router.get("/api/products/:pid", (req, res) => {
    let idProducto;
    
    if (req.params.pid) {
        idProducto = req.params.pid;
        console.log("idelegido: ", idProducto);
        prodManager.getProductByIdAsync(idProducto).then(
            producto => {
                console.log("Producto elegido: ", producto);
                res.send(producto);
            }
        )
        .catch(error => {
            console.log("ERROR: ", error);
            res.send({error});
        })
    }
    else {
        res.send({ERROR: "Debe especificar un id válido"});
    }
});

router.post("/api/products", (req, res) => {
    let nuevoProducto;

    nuevoProducto = req.body;
    /* console.log("Request: ", req);
    console.log("Nuevo Producto: ", nuevoProducto); */

    prodManager.addProductAsync(nuevoProducto).then(prodAgregado => {
        res.json({
            status: "accepted",
            message: "Producto agregado correctamente",
            nuevoProducto: prodAgregado
        })

        //Actualizo los sockets
        prodManager.getProductsAsync().then(productos => 
            socketServer.emit("obtenerProductos", productos)
        )
    }
    ).catch(err => {
        console.log("ERROR: ", err);
        res.status(404).json({
            status: "ERROR",
            error: err.toString()
        })
    })

});

router.put("/api/products/:pid", (req, res) => {
    let idProducto;
    let nuevoProducto;

    nuevoProducto = req.body;
    /* console.log("Request: ", req);
    console.log("Actualizaciones del Producto: ", nuevoProducto); */

    if (req.params.pid) {
        idProducto = req.params.pid;
        let prodActualizaciones = {
            ...nuevoProducto,
            id: idProducto
        }
        prodManager.updateProductAsync(prodActualizaciones).then(prodModificado => {
            res.json({
                status: "accepted",
                message: "Producto actualizado correctamente",
                nuevoProducto: prodModificado
            })

            //Actualizo los sockets
            prodManager.getProductsAsync().then(productos => 
                socketServer.emit("obtenerProductos", productos)
            )
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
            error: "Debe especificar un id válido"
        })   
    }

});

router.delete("/api/products/:pid", (req, res) => {
    let idProducto;
    

    //console.log("Request: ", req);

    if (req.params.pid) {
        idProducto = req.params.pid;
        prodManager.deleteProductAsync(idProducto).then(resultado => {
            console.log("Resultado: ", resultado);
            res.json({
                status: "accepted",
                message: "Producto eliminado correctamente"                
            })

            //Actualizo los sockets
            prodManager.getProductsAsync().then(productos => 
                socketServer.emit("obtenerProductos", productos)
            )
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
            error: "Debe especificar un id válido"
        })   
    }

});

export default router;
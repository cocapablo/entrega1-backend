import express from "express";
import ProductManager from "../ProductManager.js";

const router = express.Router();


router.get("/api/products", (req, res) => {
    let prodManager = new ProductManager("productos.json");

    let productos = prodManager.getProductsAsync().then(
        productos => {
            //Me fijo si especificaron algún límite de cantidad de productos
            let prodLimitados = [...productos]; //Creo una copia del array
            let consultas = req.query;
            let limite; 

            if (consultas.limit && !isNaN(limite = parseInt(consultas.limit))) {
                //Hay un limite especificado
                prodLimitados = prodLimitados.slice(0, limite);
                console.log("Productos limitados: ", prodLimitados);
            }

            console.log("Productos devueltos: ", prodLimitados);

            res.send(prodLimitados);
        }        
    );


});

router.get("/api/products/:pid", (req, res) => {
    let prodManager = new ProductManager("productos.json");
    let idProducto;
    
    if (req.params.pid && !isNaN(idProducto = parseInt(req.params.pid))) {
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
    let prodManager = new ProductManager("productos.json");
    let nuevoProducto;

    nuevoProducto = req.body;
    console.log("Request: ", req);
    console.log("Nuevo Producto: ", nuevoProducto);

    prodManager.addProductAsync(nuevoProducto).then(prodAgregado => {
        res.json({
            status: "accepted",
            message: "Producto agregado correctamente",
            nuevoProducto: prodAgregado
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

router.put("/api/products/:pid", (req, res) => {
    let prodManager = new ProductManager("productos.json");
    let idProducto;
    let nuevoProducto;

    nuevoProducto = req.body;
    console.log("Request: ", req);
    console.log("Actualizaciones del Producto: ", nuevoProducto);

    if (req.params.pid && !isNaN(idProducto = parseInt(req.params.pid))) {
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
    let prodManager = new ProductManager("productos.json");
    let idProducto;
    

    console.log("Request: ", req);

    if (req.params.pid && !isNaN(idProducto = parseInt(req.params.pid))) {
        prodManager.deleteProductAsync(idProducto).then(resultado => {
            console.log("Resultado: ", resultado);
            res.json({
                status: "accepted",
                message: "Producto eliminado correctamente"                
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
            error: "Debe especificar un id válido"
        })   
    }

});

export default router;
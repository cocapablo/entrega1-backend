import express from "express";
//import ProductManager from "../dao/ProductManager.js";
//import ProductManager from "../dao/ProductManagerMongo.js";
import {socketServer, prodManager} from "../app.js";

const router = express.Router();


//Antes del paginado
/* router.get("/api/products", async (req, res) => {
    let consultas = req.query;
    let limite; 
    let productos;

    //Antes de paginado
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
 */

//NOTA: Acá me tomé una licencia, para no modificar todo lo que había construído previamente en base a la API GET de products (por ejemplo la vista realtimeproducts), cree
//"/api/productsPaginated" con los resultados paginados
router.get("/api/productsPaginated", async (req, res) => {
    let consultas = req.query;
    let limite; 
    let pagina;
    let consulta = {};
    let orden = "";
    let productos;
    let resultado;

    //Paginado
    try {
        limite = (consultas.limit && !isNaN(parseInt(consultas.limit))) ? parseInt(consultas.limit) : 10;
        pagina = (consultas.page && !isNaN(parseInt(consultas.page))) ? parseInt(consultas.page) : 1;
        if (consultas.query) {
            try {
                consulta = JSON.parse(consultas.query);
            }
            catch (error) {
                consulta = {};
            }
        }
        //consulta = consultas.query && JSON.parse(consultas.query);
        console.log("Consulta: ", consulta);
        console.log("Consultas.sort: ", consultas.sort);
        orden = consultas.sort ? ((consultas.sort === "ASC" || consultas.sort === "DES") ? consultas.sort : "") : "";
        console.log("Orden: ", orden);

        //orden = "DES";
        productos = await prodManager.getProductsWithPaginationAsync(limite, pagina, consulta, orden);
        console.log("Resultado devuelto: ", productos);

        //Campos que faltan
        let baseQuery = "http://localhost:8080/api/productsPaginated?";
        let prevQuery = baseQuery;
        prevQuery = prevQuery + (limite ? `limit=${limite}` : "");
        if (consultas.query) {
            if (!(prevQuery === baseQuery)) {
                prevQuery += "&";
            }
            //Pongo toda la query con comillas simples para evitar problemas en las URLs
            let consultaSimple = consultas.query.replaceAll('"', "'");
            console.log("Consulta Simple: ", consultaSimple);
            prevQuery = prevQuery + "query=" + consultaSimple;
        }
        if (orden) {
            if (!(prevQuery === baseQuery)) {
                prevQuery += "&";
            }
            prevQuery = prevQuery + "sort=" + orden;
        }

        let nextQuery = prevQuery;


        productos.prevLink = productos.hasPrevPage?`${prevQuery}&page=${productos.prevPage}` : '';
        productos.nextLink = productos.hasNextPage?`${nextQuery}&page=${productos.nextPage}`: '';
        productos.isValid= !(pagina <= 0 || pagina > productos.totalPages)
        console.log("Resultado con extras: ", productos);

        //Preparo el resultado a devolver
        resultado = {
            status: "success",
            payload: [...productos.docs],
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.prevLink,
            nextLink: productos.nextLink
        }
        
    }
    catch (err) {
        console.log("ERROR: ", err);
        res.status(404).json({
            status: "ERROR",
            error: err.toString()
        });
    }
    
    res.send(resultado);
               
   
});

router.get("/api/products", async (req, res) => {
    let consultas = req.query;
    let limite; 
    let pagina;
    let consulta = {};
    let orden = "";
    let productos;
    let resultado;

    //Paginado
    try {
        limite = (consultas.limit && !isNaN(parseInt(consultas.limit))) ? parseInt(consultas.limit) : 10;
        pagina = (consultas.page && !isNaN(parseInt(consultas.page))) ? parseInt(consultas.page) : 1;
        if (consultas.query) {
            try {
                consulta = JSON.parse(consultas.query);
            }
            catch (error) {
                consulta = {};
            }
        }
        //consulta = consultas.query && JSON.parse(consultas.query);
        console.log("Consulta: ", consulta);
        console.log("Consultas.sort: ", consultas.sort);
        orden = consultas.sort ? ((consultas.sort === "ASC" || consultas.sort === "DES") ? consultas.sort : "") : "";
        console.log("Orden: ", orden);

        //orden = "DES";
        productos = await prodManager.getProductsWithPaginationAsync(limite, pagina, consulta, orden);
        console.log("Resultado devuelto: ", productos);

        //Campos que faltan
        let baseQuery = "http://localhost:8080/api/products?";
        let prevQuery = baseQuery;
        prevQuery = prevQuery + (limite ? `limit=${limite}` : "");
        if (consultas.query) {
            if (!(prevQuery === baseQuery)) {
                prevQuery += "&";
            }
            //Pongo toda la query con comillas simples para evitar problemas en las URLs
            let consultaSimple = consultas.query.replaceAll('"', "'");
            console.log("Consulta Simple: ", consultaSimple);
            prevQuery = prevQuery + "query=" + consultaSimple;
        }
        if (orden) {
            if (!(prevQuery === baseQuery)) {
                prevQuery += "&";
            }
            prevQuery = prevQuery + "sort=" + orden;
        }

        let nextQuery = prevQuery;


        productos.prevLink = productos.hasPrevPage?`${prevQuery}&page=${productos.prevPage}` : '';
        productos.nextLink = productos.hasNextPage?`${nextQuery}&page=${productos.nextPage}`: '';
        productos.isValid= !(pagina <= 0 || pagina > productos.totalPages)
        console.log("Resultado con extras: ", productos);

        //Preparo el resultado a devolver
        resultado = {
            status: "success",
            payload: [...productos.docs],
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.prevLink,
            nextLink: productos.nextLink
        }
        
    }
    catch (err) {
        console.log("ERROR: ", err);
        res.status(404).json({
            status: "ERROR",
            error: err.toString()
        });
    }
    
    res.send(resultado);
               
   
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
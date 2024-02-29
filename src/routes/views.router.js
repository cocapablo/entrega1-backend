import express from "express";
//import ProductManager from "../dao/ProductManager.js";
//import ProductManager from "../dao/ProductManagerMongo.js";
import { prodManager } from "../app.js";
import { cartManager } from "../app.js";

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

router.get("/cart/:cid", (req, res) => {
    let idCarrito;
    
    if (req.params.cid) {
        idCarrito = req.params.cid;
        cartManager.getCarritoWithProductsByIdAsync(idCarrito).then(
            carrito => {
                console.log("Carrito para la View: ", carrito);
                res.render("cart", {id: idCarrito,
                                    products: [...carrito.products]});
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

    
})

router.get("/products", async (req, res) => {
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
        let baseQuery = "http://localhost:8080/products?";
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

        res.render("products", resultado);
        
    }
    catch (err) {
        console.log("ERROR: ", err);
        res.status(404).json({
            status: "ERROR",
            error: err.toString()
        });
    }
    
    
               
   
});




export default router;
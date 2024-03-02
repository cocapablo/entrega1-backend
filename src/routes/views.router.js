import express, { request } from "express";
//import ProductManager from "../dao/ProductManager.js";
//import ProductManager from "../dao/ProductManagerMongo.js";
import { prodManager } from "../app.js";
import { cartManager } from "../app.js";
import { usuarioLogueado, usuarioNoLogueado } from "../middlewares/sessionMiddleware.js";

const router = express.Router();

router.get("/", usuarioLogueado, (req, res) => {
    //Redirecciono a products
    res.redirect("/products?limit=6");
    
    //Obtengo un array de los productos actuales
    
    /* prodManager.getProductsAsync().then(
        productos => {
            res.render("home", { productos });
        }
    ) */
});


router.get("/realtimeproducts", usuarioLogueado, (req, res) => {
    let usuario = {};

    //Obtengo el usuario de la session actual
    req.session && req.session.user && (usuario = req.session.user);

    console.log("Usuario en la Session: ", usuario);

    //Obtengo un aray de los productos actuales
    
    prodManager.getProductsAsync().then(
        productos => {

            res.render("realtimeproducts", { productos, user: usuario});
        }
    )
});

router.get("/chat", usuarioLogueado, (req, res) => {
    let usuario = {};

    //Obtengo el usuario de la session actual
    req.session && req.session.user && (usuario = req.session.user);

    console.log("Usuario en la Session: ", usuario);

    res.render("chat", {user: usuario});
})

router.get("/cart/:cid", usuarioLogueado, (req, res) => {
    let idCarrito;
    let usuario = {};

    //Obtengo el usuario de la session actual
    req.session && req.session.user && (usuario = req.session.user);

    console.log("Usuario en la Session: ", usuario);
    
    if (req.params.cid) {
        idCarrito = req.params.cid;
        cartManager.getCarritoWithProductsByIdAsync(idCarrito).then(
            carrito => {
                console.log("Carrito para la View: ", carrito);
                res.render("cart", {id: idCarrito,
                                    products: [...carrito.products],
                                    user: usuario});
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

router.get("/products", usuarioLogueado, async (req, res) => {
    let consultas = req.query;
    let limite; 
    let pagina;
    let consulta = {};
    let orden = "";
    let productos;
    let resultado;
    let usuario = {};

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

        //Obtengo el usuario de la session actual
        req.session && req.session.user && (usuario = req.session.user);

        console.log("Usuario en la Session: ", usuario);

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
            nextLink: productos.nextLink,

            //Datos del usuario
            user: usuario
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

router.get("/login", usuarioNoLogueado, (req, res) => {
    let error = false;
    let mensajeError = "";

    req.query && req.query.error && (error = (req.query.error === "true" ? true : false));
    console.log("Error: ", error);
    req.query && req.query.mensajeError && (mensajeError = req.query.mensajeError);
    console.log("Mensaje Error: ", mensajeError);

    res.render("login", {error, mensajeError});
})

router.get("/register", usuarioNoLogueado, (req, res) => {
    let error = false;
    let mensajeError = "";

    req.query && req.query.error && (error = (req.query.error === "true" ? true : false));
    console.log("Error: ", error);
    req.query && req.query.mensajeError && (mensajeError = req.query.mensajeError);
    console.log("Mensaje Error: ", mensajeError);

    res.render("register", {error, mensajeError});
})

router.get("/profile", usuarioLogueado, (req, res) => {
    let usuario = {};

    //Obtengo el usuario de la session actual
    req.session && req.session.user && (usuario = req.session.user);

    console.log("Usuario en la Session: ", usuario);

    res.render("profile", {user: usuario});
})


export default router;
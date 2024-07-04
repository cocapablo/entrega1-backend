//import ProductManager from "../dao/mongo/ProductManagerMongo.js";
import { productService } from "../repositories/index.js";
import { socketServer } from "../app.js";

//Mock
import { generateProduct } from "../test/utils.js";

//Custom Errors
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

import logger from "../services/logs/logger.js";

import MailingService from "../services/mailing/mailing.js";
import config from "../config/config.js";


export class ProductController {
    #productService;
    #userService;
    
    constructor(userController = null) {
        //this.#productService = new ProductManager(""); //Esto después se cambiará por lo que gestione el Factory
        this.#productService = productService;
        if (userController) {
            this.#userService = userController.getService();
        }
        
        this.getProductsPaginated = this.getProductsPaginated.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.getMockingProducts = this.getMockingProducts.bind(this);
        this.createProductWithImage = this.createProductWithImage.bind(this);
        this.updateProductWithImage = this.updateProductWithImage.bind(this);
    }

    getService() {
        return this.#productService;
    }

    setUserController(userController) {
        this.#userService = userController.getService();
    }

    async getProductsPaginated(req, res, next){
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
            //console.log("Consulta: ", consulta);
            //console.log("Consultas.sort: ", consultas.sort);
            orden = consultas.sort ? ((consultas.sort === "ASC" || consultas.sort === "DES") ? consultas.sort : "") : "";
            //console.log("Orden: ", orden);

            //orden = "DES";
            productos = await this.#productService.getProductsWithPaginationAsync(limite, pagina, consulta, orden);
            //console.log("Resultado devuelto: ", productos);

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
                //console.log("Consulta Simple: ", consultaSimple);
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
            //console.log("Resultado con extras: ", productos);

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
            //console.log("ERROR en productController.getProductsPaginated: ", err.message);
            /*
            res.status(404).json({
                status: "ERROR",
                error: err.toString()
            }); */
            next(err);

        } 
        
        res.send(resultado); 
    }

    
    async getProduct(req, res, next) {
        let idProducto;
    
        if (req.params.pid) {
            idProducto = req.params.pid;
            //console.log("idelegido: ", idProducto);
            this.#productService.getProductByIdAsync(idProducto).then(
                producto => {
                    //console.log("Producto elegido: ", producto);
                    res.send(producto);
                }
            )
            .catch(error => {
                //console.log("ERROR en productController.getProduct: ", error.message);
                //res.send({error});
                next(error);
            })
        }
        else {
            //res.send({ERROR: "Debe especificar un id válido"});
            try { 
                CustomError.createError({
                    name: "Error obteniendo un Producto",
                    cause: "No se especificó un id válido en productController",
                    message: "ERROR: Debe especificar un id válido",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                next(err);
            }
        }    
    }

    async createProduct(req, res, next) {
        let nuevoProducto;
        let usuario = null;

        //Obtengo los datos del nuevo producto
        nuevoProducto = req.body;
        
        //Obtengo el usuario de la session actual
        req.session && req.session.user && (usuario = req.session.user);

        if (!usuario) {
            try { 
                CustomError.createError({
                    name: "Error creando un Producto",
                    cause: "No hay ningún usuario logueado en la sesión",
                    message: "ERROR: No hay ningún usuario logueado en la sesión",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                return next(err);
            }
        }

        //Le agrego el owner a nuevoProducto (el id del usuario)
        nuevoProducto.owner = usuario.id;

        //console.log("Usuario en la Session: ", usuario);
        logger.debug("Usuario en la Session: " + JSON.stringify(usuario, null, 2));

        this.#productService.addProductAsync(nuevoProducto).then(prodAgregado => {
            res.json({
                status: "accepted",
                message: "Producto agregado correctamente",
                nuevoProducto: prodAgregado
            })

            //Actualizo los sockets
            this.#productService.getProductsAsync().then(productos => 
                socketServer.emit("obtenerProductos", productos)
            )
        }
        ).catch(err => {
            //console.log("ERROR en productController: ", err.message);
            /*
            res.status(404).json({
                status: "ERROR",
                error: err.toString()
            }) */

            //Lanzo el Custom error
            //throw err;
            next(err);
        })    
    }

    async updateProduct(req, res, next) {
        let idProducto;
        let nuevoProducto;
        let usuario = null;

        //Obtengo los datos a modificar
        nuevoProducto = req.body;
        
        //Obtengo el usuario de la session actual
        req.session && req.session.user && (usuario = req.session.user);

        if (!usuario) {
            try { 
                CustomError.createError({
                    name: "Error actualizando un Producto",
                    cause: "No hay ningún usuario logueado en la sesión",
                    message: "ERROR: No hay ningún usuario logueado en la sesión",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                return next(err);
            }
        }

        if (req.params.pid) {
            idProducto = req.params.pid;

            //Me fijo si el usuario está autorizado para realizar la actualización
            if (usuario.role === "premium") {
                //Me fijo si el usuario es el owner del producto
                try {
                    let productoActual = await this.#productService.getProductByIdAsync(idProducto);

                    if (productoActual.owner !== usuario.id) {
                        try { 
                            CustomError.createError({
                                name: "Error actualizando un Producto",
                                cause: "El usuario no es el owner del producto y no tiene privilegios suficientes para realizar la operación",
                                message: "ERROR: El usuario no es el owner del producto y no tiene privilegios suficientes para realizar la operación",
                                code: EErrors.INVALID_TYPES_ERROR
                            })  
                        } catch (err) {
                            return next(err);
                        }                    
                    }
                }
                catch (error) {
                    try { 
                        CustomError.createError({
                            name: "Error actualizando un Producto",
                            cause: "Error en la Base de Datos",
                            message: "ERROR: " + error.message,
                            code: EErrors.DATABASE_ERROR
                        })  
                    } catch (err) {
                        return next(err);
                    } 
                    
                }
            }

            let prodActualizaciones = {
                ...nuevoProducto,
                id: idProducto
            }

            this.#productService.updateProductAsync(prodActualizaciones).then(prodModificado => {
                res.json({
                    status: "accepted",
                    message: "Producto actualizado correctamente",
                    nuevoProducto: prodModificado
                })

                //Actualizo los sockets
                this.#productService.getProductsAsync().then(productos => 
                    socketServer.emit("obtenerProductos", productos)
                )
            }
            ).catch(err => {
                /* console.log("ERROR: ", err);
                res.status(404).json({
                    status: "ERROR",
                    error: err.toString()
                }) */
                //console.log("ERROR en productController.updateProduct: ", err.message);
                
                next(err);
            })
        }
        else {
            /* res.status(404).json({
                status: "ERROR",
                error: "Debe especificar un id válido"
                
            })  */ 
            try { 
                CustomError.createError({
                    name: "Error actualizando un Producto",
                    cause: "No se especificó un id válido en productController",
                    message: "ERROR: Debe especificar un id válido",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                next(err);
            }

        }    
    }

    async deleteProduct(req, res, next) {
        let idProducto;
        let usuario = null;
        let productoActual;
        let idOwner;
        let owner;
        let emailOwner;
        let enviarEmail = false;
    

        //Obtengo el usuario de la session actual
        req.session && req.session.user && (usuario = req.session.user);

        if (!usuario) {
            try { 
                CustomError.createError({
                    name: "Error eliminando un Producto",
                    cause: "No hay ningún usuario logueado en la sesión",
                    message: "ERROR: No hay ningún usuario logueado en la sesión",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                return next(err);
            }
        }

        if (req.params.pid) {
            idProducto = req.params.pid;

            //Me fijo si el usuario está autorizado para realizar la eliminación
            if (usuario.role === "premium") {
                //Me fijo si el usuario es el owner del producto
                try {
                    let productoActual = await this.#productService.getProductByIdAsync(idProducto);

                    if (productoActual.owner !== usuario.id) {
                        try { 
                            CustomError.createError({
                                name: "Error eliminando un Producto",
                                cause: "El usuario no es el owner del producto y no tiene privilegios suficientes para realizar la operación",
                                message: "ERROR: El usuario no es el owner del producto y no tiene privilegios suficientes para realizar la operación",
                                code: EErrors.INVALID_TYPES_ERROR
                            })  
                        } catch (err) {
                            return next(err);
                        }                    
                    }
                }
                catch (error) {
                    try { 
                        CustomError.createError({
                            name: "Error eliminando un Producto",
                            cause: "Error en la Base de Datos",
                            message: "ERROR: " + error.message,
                            code: EErrors.DATABASE_ERROR
                        })  
                    } catch (err) {
                        return next(err);
                    } 
                    
                }
            }

            //Me fijo si el producto que voy a eliminar tiene un owner que es un usuario premium
            try {
                productoActual = await this.#productService.getProductByIdAsync(idProducto);
                idOwner = productoActual.owner;
                owner = await this.#userService.getUserByIdAsync(idOwner);
                emailOwner = owner.email;

                if ((idOwner !== usuario.id) && (owner.role === "premium")) {
                    //Hay que el mail de baja del producto luego de darlo de baja
                    enviarEmail = true;

                }

            }
            catch(error) {
                try { 
                    CustomError.createError({
                        name: "Error eliminando un Producto",
                        cause: error.toString(),
                        message: "ERROR: Error eliminando un Producto - " + error.toString(),
                        code: EErrors.INVALID_TYPES_ERROR
                    })  
                } catch (err) {
                    return next(err);
                } 
            }

            this.#productService.deleteProductAsync(idProducto).then(resultado => {
                
                if (enviarEmail === true) {
                    //Envio el email de baja del producto
                     //Generar el mail de recuperacion
                    const correoOptions = {
                        from : "SuperStore",
                        to: emailOwner,
                        subject: "Eliminación de su Producto " + productoActual.title,
                        html: `<head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
                                    <title>SuperStore</title>
                                </head>
                                <body>
                                    <h1 style="text-align: center;"> SuperStore - Eliminación de Producto </h1>
                                    <p> Estimado ${owner.first_name} ${owner.last_name}: </p>
                                    <p> Hemos eliminado su producto ${productoActual.title} por los caprichos de nuestro administrador del sistema</p>
                                    
                                    <p> Atentamente SuperStore  </p>
                                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
                                </body>
                            `
                        }

                    const mailer = new MailingService();    
                
                    mailer.sendSimpleMail(correoOptions);

                }

                res.json({
                    status: "accepted",
                    message: "Producto eliminado correctamente"                
                })

                //Actualizo los sockets
                this.#productService.getProductsAsync().then(productos => 
                    socketServer.emit("obtenerProductos", productos)
                )
            }
            ).catch(err => {
                /* console.log("ERROR: ", err);
                res.status(404).json({
                    status: "ERROR",
                    error: err.toString()
                }) */
                //console.log("ERROR en productController.deleteProduct: ", err.message);
                
                next(err);
            })
        }
        else {
            /* res.status(404).json({
                status: "ERROR",
                error: "Debe especificar un id válido"
            })  */  
            try { 
                CustomError.createError({
                    name: "Error eliminando un Producto",
                    cause: "No se especificó un id válido en productController",
                    message: "ERROR: Debe especificar un id válido",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                next(err);
            }
        }    
    }

    getMockingProducts(req, res) {
        let cantidadProductos;
        let productos = [];
        let resultado;

        //Genero una cantidad ficticia de productos
        cantidadProductos = 100;

        for (let i = 0; i < cantidadProductos; ++i) {
            let producto;

            producto = generateProduct();

            productos.push(producto);
        }
        
        //Devuelvo los productos
        resultado = {
            status: "success",
            payload: [...productos],
            totalPages: 1,
            prevPage: null,
            nextPage: null,
            page: 1,
            hasPrevPage: false,
            hasNextPage: false,
            prevLink: "",
            nextLink: ""
        }

        res.send(resultado);
    }

    async createProductWithImage(req, res, next) {
        let nuevoProducto;
        let usuario = null;
        let archivos = null;
        let archivo = null;
        let URLarchivo;
        let pathArchivo;
        let nombreArchivo;

        //Obtengo los datos del nuevo producto
        nuevoProducto = req.body;

                
        //Obtengo el usuario de la session actual
        req.session && req.session.user && (usuario = req.session.user);

        if (!usuario) {
            try { 
                CustomError.createError({
                    name: "Error creando un Producto",
                    cause: "No hay ningún usuario logueado en la sesión",
                    message: "ERROR: No hay ningún usuario logueado en la sesión",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                return next(err);
            }
        }

        req.files && req.files && (archivos = req.files);

        if (!archivos) {
            CustomError.createError({
                name: "Error creando un Producto con una Imagen",
                cause: "No hay archivos subidos",
                message: "ERROR: No hay archivos subidos",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }

        archivos["thumbnailimage"] && archivos["thumbnailimage"][0] && (archivo = archivos["thumbnailimage"][0])
        
        if (!archivo) {
            CustomError.createError({
                name: "Error creando un Producto con una Imagen",
                cause: "No hay archivos subidos",
                message: "ERROR: No hay archivos subidos",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }
        //Obtengo el path del archivo (ver si esto lo convierto a una URL o no o como)
        nombreArchivo = archivo.filename;
        pathArchivo = archivo.path;
        URLarchivo = "/products/" + nombreArchivo;

        //console.log("URLarchivo producto: ", URLarchivo);

        nuevoProducto.thumbnail = URLarchivo;

        //Le agrego el owner a nuevoProducto (el id del usuario)
        nuevoProducto.owner = usuario.id;

        //console.log("Usuario en la Session: ", usuario);
        logger.debug("Usuario en la Session: " + JSON.stringify(usuario, null, 2));

        this.#productService.addProductAsync(nuevoProducto).then(prodAgregado => {
            res.json({
                status: "accepted",
                message: "Producto agregado correctamente",
                nuevoProducto: prodAgregado
            })

            //Actualizo los sockets
            this.#productService.getProductsAsync().then(productos => 
                socketServer.emit("obtenerProductos", productos)
            )
        }
        ).catch(err => {
            //console.log("ERROR en productController: ", err.message);
            /*
            res.status(404).json({
                status: "ERROR",
                error: err.toString()
            }) */

            //Lanzo el Custom error
            //throw err;
            next(err);
        })    
    }

    async updateProductWithImage(req, res, next) {
        let idProducto;
        let nuevoProducto;
        let usuario = null;
        let archivos = null;
        let archivo = null;
        let URLarchivo;
        let pathArchivo;
        let nombreArchivo;

        //Obtengo los datos a modificar
        nuevoProducto = req.body;
        
        //Obtengo el usuario de la session actual
        req.session && req.session.user && (usuario = req.session.user);

        if (!usuario) {
            try { 
                CustomError.createError({
                    name: "Error actualizando un Producto",
                    cause: "No hay ningún usuario logueado en la sesión",
                    message: "ERROR: No hay ningún usuario logueado en la sesión",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                return next(err);
            }
        }

        req.files && req.files && (archivos = req.files);

        if (!archivos) {
            CustomError.createError({
                name: "Error actualizando un Producto con una Imagen",
                cause: "No hay archivos subidos",
                message: "ERROR: No hay archivos subidos",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }

        archivos["thumbnailimage"] && archivos["thumbnailimage"][0] && (archivo = archivos["thumbnailimage"][0])
        
        if (!archivo) {
            CustomError.createError({
                name: "Error actualizando un Producto con una Imagen",
                cause: "No hay archivos subidos",
                message: "ERROR: No hay archivos subidos",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }

        //Obtengo el path del archivo (ver si esto lo convierto a una URL o no o como)
        nombreArchivo = archivo.filename;
        pathArchivo = archivo.path;
        URLarchivo = "/products/" + nombreArchivo;

        //console.log("URLarchivo producto: ", URLarchivo);

        nuevoProducto.thumbnail = URLarchivo;


        if (req.params.pid) {
            idProducto = req.params.pid;

            //console.log("idProducto a actualizar: ", idProducto);
            //Me fijo si el usuario está autorizado para realizar la actualización
            if (usuario.role === "premium") {
                //Me fijo si el usuario es el owner del producto
                try {
                    let productoActual = await this.#productService.getProductByIdAsync(idProducto);

                    if (productoActual.owner !== usuario.id) {
                        try { 
                            CustomError.createError({
                                name: "Error actualizando un Producto",
                                cause: "El usuario no es el owner del producto y no tiene privilegios suficientes para realizar la operación",
                                message: "ERROR: El usuario no es el owner del producto y no tiene privilegios suficientes para realizar la operación",
                                code: EErrors.INVALID_TYPES_ERROR
                            })  
                        } catch (err) {
                            return next(err);
                        }                    
                    }
                }
                catch (error) {
                    try { 
                        CustomError.createError({
                            name: "Error actualizando un Producto",
                            cause: "Error en la Base de Datos",
                            message: "ERROR: " + error.message,
                            code: EErrors.DATABASE_ERROR
                        })  
                    } catch (err) {
                        return next(err);
                    } 
                    
                }
            }

            let prodActualizaciones = {
                ...nuevoProducto,
                thumbnail: URLarchivo,
                id: idProducto
            }

            this.#productService.updateProductAsync(prodActualizaciones).then(prodModificado => {
                res.json({
                    status: "accepted",
                    message: "Producto actualizado correctamente",
                    nuevoProducto: prodModificado
                })

                //Actualizo los sockets
                this.#productService.getProductsAsync().then(productos => 
                    socketServer.emit("obtenerProductos", productos)
                )
            }
            ).catch(err => {
                /* console.log("ERROR: ", err);
                res.status(404).json({
                    status: "ERROR",
                    error: err.toString()
                }) */
                //console.log("ERROR en productController.updateProduct: ", err.message);
                
                next(err);
            })
        }
        else {
            /* res.status(404).json({
                status: "ERROR",
                error: "Debe especificar un id válido"
                
            })  */ 
            try { 
                CustomError.createError({
                    name: "Error actualizando un Producto",
                    cause: "No se especificó un id válido en productController",
                    message: "ERROR: Debe especificar un id válido",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                next(err);
            }

        }    
    }
}
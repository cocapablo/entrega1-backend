//import CarritoManager from "../dao/mongo/CarritoManagerMongo.js";

import { cartService } from "../repositories/index.js";
import { ProductController } from "./products.controller.js";

import logger from "../services/logs/logger.js";

export class CartController {
    #cartService;
    #productController;

    constructor(productController) {
        this.#productController = productController;
        //this.#cartService = new CarritoManager("", productController.getService()); 
        this.#cartService = cartService;  
        this.getCarts = this.getCarts.bind(this); 
        this.getProductsFromCart = this.getProductsFromCart.bind(this);
        this.createCart = this.createCart.bind(this);
        this.addProductToCart = this.addProductToCart.bind(this);
        this.setProductsToCart = this.setProductsToCart.bind(this);
        this.deleteAllProductsFromCart = this.deleteAllProductsFromCart.bind(this);
        this.deleteProductFromCart = this.deleteProductFromCart.bind(this);
        this.setProductQuantityFromCart = this.setProductQuantityFromCart.bind(this);
    }

    getService() {
        return this.#cartService;
    }

    async getCarts(req, res, next) {

        this.#cartService.getCarritosWithProductsByIdAsync().then(
            carritos => {
                //console.log("Carritos devueltos: ", carritos);
                logger.debug("Carritos devueltos: " + JSON.stringify(carritos, null, 2));
    
                res.send(carritos);
            }        
        ).catch (error => {
            //console.log("ERROR en cartController.getCarts: ", error.message);
            
            next(error);  
        }) 
              
           
    }

    async getProductsFromCart(req, res, next) {
        let idCarrito;
    
        if (req.params.cid) {
            idCarrito = req.params.cid;
            this.#cartService.getProductsDeCarritoByIdAsync(idCarrito).then(
                productos => {
                    //console.log("Productos del carrito: ", productos);
                    logger.debug("Productos del carrito: ", JSON.stringify(productos, null, 2));
                    res.send(productos);
                }
            )
            .catch(error => {
                /* console.log("ERROR: ", error);
                res.send({error}); */
                //console.log("ERROR en cartController.getProductsFromCart: ", error.message);
            
                next(error);  
            })
        }
        else {
            //res.send({ERROR: "Debe especificar un id carrito válido"});
            try { 
                CustomError.createError({
                    name: "Error obteniendo Productos de un Carrito",
                    cause: "No se especificó un id carrito válido en cartController",
                    message: "ERROR: Debe especificar un id carrito válido",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                next(err);
            }
        }
    }

    async createCart(req, res, next) {
        this.#cartService.addCarritoAsync().then(carritoAgregado => {
            res.json({
                status: "accepted",
                message: "Carrito agregado correctamente",
                nuevoCarrito: carritoAgregado
            })
        }
        ).catch(err => {
            //console.log("ERROR: ", err);
            /* res.status(404).json({
                status: "ERROR",
                error: err.toString()
            }) */
            next(err);
        })
    }

    async addProductToCart(req, res, next) {
        let idCarrito;
        let idProducto;
        
        if (req.params.cid && req.params.pid) {
            idCarrito = req.params.cid;
            idProducto = req.params.pid;
            this.#cartService.addProductToCarritoAsync(idCarrito, idProducto).then(carritoAgregado => {
                res.json({
                    status: "accepted",
                    message: "Producto agregado al Carrito correctamente",
                    nuevoCarrito: carritoAgregado
                })
            }
            ).catch(err => {
                //console.log("ERROR: ", err);
                /* res.status(404).json({
                    status: "ERROR",
                    error: err.toString()
                }) */
                next(err);
            })
        }
        else {
            /* res.status(404).json({
                status: "ERROR",
                error: "Debe especificar un idCarrito y un idProducto válidos"
            })   */ 
            try { 
                CustomError.createError({
                    name: "Error agregando un Producto a un Carrito",
                    cause: "No se especificó un id carrito o un idProducto válidos en cartController",
                    message: "Debe especificar un idCarrito y un idProducto válidos",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                next(err);
            }
        }
    }

    async setProductsToCart(req, res, next) {
        let idCarrito;
        let productos;

        if (req.params.cid) {
            idCarrito = req.params.cid;
            if (req.body) {
                productos = req.body;

                this.#cartService.setProductsToCarritoAsync(idCarrito, productos).then(carritoAgregado => {
                    res.json({
                        status: "accepted",
                        message: "Productos configurados en el Carrito correctamente",
                        nuevoCarrito: carritoAgregado
                    })
                }
                ).catch(err => {
                    //console.log("ERROR: ", err);
                    /* res.status(404).json({
                        status: "ERROR",
                        error: err.toString()
                    }) */
                    next(err);
                })  
            }
            else {
                /* res.status(404).json({
                    status: "ERROR",
                    error: "Productos no especificados"
                }); */
                try { 
                    CustomError.createError({
                        name: "Error agregando Productos a un Carrito",
                        cause: "No se especificaron Productos en cartController",
                        message: "Productos no especificados",
                        code: EErrors.INVALID_TYPES_ERROR
                    })  
                } catch (err) {
                    next(err);
                }
            }

        }
        else {
            /* res.status(404).json({
                status: "ERROR",
                error: "Debe especificar un idCarrito válido"
            })   */ 
            try { 
                CustomError.createError({
                    name: "Error agregando Productos a un Carrito",
                    cause: "Debe especificar un idCarrito válido en cartController",
                    message: "Debe especificar un idCarrito válido",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                next(err);
            }   
        }
    }

    async deleteAllProductsFromCart(req, res, next) {
        let idCarrito;
        let productos;

        if (req.params.cid) {
            idCarrito = req.params.cid;
            productos = [];

            this.#cartService.setProductsToCarritoAsync(idCarrito, productos).then(carritoAgregado => {
                res.json({
                    status: "accepted",
                    message: "Productos eliminados del Carrito correctamente",
                    nuevoCarrito: carritoAgregado
                })
            }
            ).catch(err => {
                //console.log("ERROR: ", err);
                /* res.status(404).json({
                    status: "ERROR",
                    error: err.toString()
                }) */
                next(err);
            }) 
            
        }
        else {
            /* res.status(404).json({
                status: "ERROR",
                error: "Debe especificar un idCarrito válido"
            })   */   
            try { 
                CustomError.createError({
                    name: "Error borrando Productos de un Carrito",
                    cause: "Debe especificar un idCarrito válido en cartController",
                    message: "Debe especificar un idCarrito válido",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                next(err);
            }   
        }
    }

    async deleteProductFromCart(req, res, next) {
        let idCarrito;
        let idProducto;
        
        if (req.params.cid && req.params.pid) {
            idCarrito = req.params.cid;
            idProducto = req.params.pid;
            this.#cartService.deleteProductDeCarrito(idCarrito, idProducto).then(carritoAgregado => {
                res.json({
                    status: "accepted",
                    message: "Producto borrado del Carrito correctamente",
                    nuevoCarrito: carritoAgregado
                })
            }
            ).catch(err => {
                //console.log("ERROR: ", err);
                /* res.status(404).json({
                    status: "ERROR",
                    error: err.toString()
                }) */
                next(err);
            })
        }
        else {
            /* res.status(404).json({
                status: "ERROR",
                error: "Debe especificar un idCarrito y un idProducto válidos"
            })    */
            try { 
                CustomError.createError({
                    name: "Error eliminando un Producto de un Carrito",
                    cause: "No se especificó un id carrito o un idProducto válidos en cartController",
                    message: "Debe especificar un idCarrito y un idProducto válidos",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                next(err);
            }
        }
    }

    async setProductQuantityFromCart(req, res, next) {
        let idCarrito;
        let idProducto;
        let cantidad;

        if (!(req.body && req.body.quantity && !isNaN(parseInt(req.body.quantity)))) {
            /* res.status(404).json({
                status: "ERROR",
                error: "Debe especificar una quantity del Producto válida"
            })    
            
            return; */
            try { 
                CustomError.createError({
                    name: "Error configurando la cantidad de un Producto en un Carrito",
                    cause: "No se especificó una quantity válida en cartController",
                    message: "Debe especificar una quantity del Producto válida",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                next(err);
            }
        } 

        cantidad = parseInt(req.body.quantity);
        
        if (req.params.cid && req.params.pid) {
            idCarrito = req.params.cid;
            idProducto = req.params.pid;
            this.#cartService.setProductToCarritoAsync(idCarrito, idProducto, cantidad).then(carritoAgregado => {
                res.json({
                    status: "accepted",
                    message: "Producto actalizado en el Carrito correctamente",
                    nuevoCarrito: carritoAgregado
                })
            }
            ).catch(err => {
                //console.log("ERROR: ", err);
                /* res.status(404).json({
                    status: "ERROR",
                    error: err.toString()
                }) */
                next(err);
            })
        }
        else {
            /* res.status(404).json({
                status: "ERROR",
                error: "Debe especificar un idCarrito y un idProducto válidos"
            }) */ 
            try { 
                CustomError.createError({
                    name: "Error configurando la cantidad de un Producto en un Carrito",
                    cause: "Debe especificar un idCarrito y un idProducto válidos en cartController",
                    message: "Debe especificar un idCarrito y un idProducto válidos",
                    code: EErrors.INVALID_TYPES_ERROR
                })  
            } catch (err) {
                next(err);
            }  
        }
    }
}
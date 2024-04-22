//import CarritoManager from "../dao/mongo/CarritoManagerMongo.js";

import { cartService } from "../repositories/index.js";
import { ProductController } from "./products.controller.js";

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

    async getCarts(req, res) {
        this.#cartService.getCarritosWithProductsByIdAsync().then(
            carritos => {
                console.log("Carritos devueltos: ", carritos);
    
                res.send(carritos);
            }        
        );    
    }

    async getProductsFromCart(req, res) {
        let idCarrito;
    
        if (req.params.cid) {
            idCarrito = req.params.cid;
            this.#cartService.getProductsDeCarritoByIdAsync(idCarrito).then(
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
    }

    async createCart(req, res) {
        this.#cartService.addCarritoAsync().then(carritoAgregado => {
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
    }

    async addProductToCart(req, res) {
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
    }

    async setProductsToCart(req, res) {
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
                    error: "Productos no especificados"
                });
            }

        }
        else {
            res.status(404).json({
                status: "ERROR",
                error: "Debe especificar un idCarrito válido"
            })      
        }
    }

    async deleteAllProductsFromCart(req, res) {
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
                error: "Debe especificar un idCarrito válido"
            })      
        }
    }

    async deleteProductFromCart(req, res) {
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
    }

    async setProductQuantityFromCart(req, res) {
        let idCarrito;
        let idProducto;
        let cantidad;

        if (!(req.body && req.body.quantity && !isNaN(parseInt(req.body.quantity)))) {
            res.status(404).json({
                status: "ERROR",
                error: "Debe especificar una quantity del Producto válida"
            })    
            
            return;
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
    }
}
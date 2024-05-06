//import TicketManager from "../dao/mongo/TicketManagerMongo.js"; 
import { ticketService } from "../repositories/index.js";
import logger from "../services/logs/logger.js";

export class TicketController {
    #ticketService;
    #cartController;
    #userController;
    #productController;
    #cartService;
    #userService;
    #productService;

    constructor(cartController, userController, productController) {
        //this.#ticketService = new TicketManager();
        this.#ticketService = ticketService;

        this.#cartController = cartController;
        this.#userController = userController;
        this.#productController = productController;

        this.#cartService = this.#cartController.getService();
        this.#userService = this.#userController.getService();
        this.#productService = this.#productController.getService();

        this.createTicket = this.createTicket.bind(this);
    } 

    getService() {
        return this.#ticketService;
    }

    async createTicket(req, res) {
        let idCarrito;
        let carrito;
        let productosAceptados = [];
        let productosRechazados = [];
        let montoTotalCompra;
        let mailUsuario;
        let usuario;
        let nuevoTicket;
        let respuesta;
        
        try {
            //Paso 1: Obtengo idCarrito
            if (!req.params.cid) {
                return res.status(404).json({
                    status: "ERROR",
                    error: "Debe especificar un idCarrito válido"
                })
            }

            idCarrito = req.params.cid;

            //Paso 2: Obtengo el carrito
            carrito = await this.#cartService.getCarritoByIdAsync(idCarrito);

            if (carrito.products.length <= 0) {
                //No hay productos en el Carrito
                return res.status(404).json({
                    status: "ERROR",
                    error: "El carrito no tiene ningún producto cargado"
                })

            }

            let todosProductos = await this.#productService.getProductsAsync();

            //Paso 3: Me fijo que productos tienen stock y cuales no
            carrito.products.forEach(producto => {
                let productoCompleto; 

                productoCompleto = todosProductos.find(prod => prod.id === producto.id);

                //console.log("Producto: ", producto);
                //console.log("Producto completo: ", productoCompleto);

                if (productoCompleto.stock >= producto.quantity) {
                    //Hay Stock del producto
                    productosAceptados.push({
                        ...producto,
                        title: productoCompleto.title,
                        price: productoCompleto.price
                    });
                    
                }
                else {
                    //No hay stock del producto
                    productosRechazados.push({
                        ...producto,
                        title: productoCompleto.title
                    });
                }
            })

            
            //console.log("Productos aceptados: ", productosAceptados);
            logger.debug("Productos aceptados: " + JSON.stringify(productosAceptados, null, 2));

            if (productosAceptados.length <= 0) {
                //Ningún producto del carrito tiene stock: Rechazo la compra
                return res.status(404).json({
                    status: "ERROR",
                    error: "Ningún producto del carrito tiene stock suficiente para realizar la compra"
                })

            }

            //Paso 4: Calculo el monto total de la compra
            montoTotalCompra = productosAceptados.reduce((suma, producto) => {
                suma += producto.quantity * producto.price;
                return suma;
            }, 0);

            //console.log("Monto Total Compra: ", montoTotalCompra);
            logger.debug("Monto Total Compra: " + montoTotalCompra);

            //Paso 5 : Obtengo el mail del usuario
            usuario = await this.#userService.getUsuarioDeCarritoAsync(idCarrito);

            //console.log("Usuario del Carrito: ", usuario);
            logger.debug("Usuario del Carrito: " + JSON.stringify(usuario, null, 2));

            mailUsuario = usuario.email;

            //Paso 6: Realizo la compra
            nuevoTicket = await this.#ticketService.addTicketAsync({amount: montoTotalCompra, purchaser: mailUsuario});

            //Paso 7: Configuro el Carrito solo con los productos rechazados
            await this.#cartService.setProductsToCarritoAsync(idCarrito, productosRechazados.map(producto => {
                    let prodRechazado = {
                        id: producto.id, 
                        quantity: producto.quantity
                    };
                    
                    return prodRechazado;
                }
            ));

            //Paso 8: Actualizo el stock de los productos comprados
            productosAceptados.forEach(async (producto) => {
                let productoCompleto;

                productoCompleto = await this.#productService.getProductByIdAsync(producto.id);

                //Modifico el stock
                let productoModificado = {
                    ...productoCompleto,
                    stock: productoCompleto.stock - producto.quantity
                }

                await this.#productService.updateProductAsync(productoModificado);
            })

            //Paso 9 : Armo la respuesta
            let status;

            status = (productosRechazados.length > 0) ? "partial-success" : "success";
            
            respuesta = {
                status,
                ticket: nuevoTicket,
                products: [...productosAceptados],
                rejectedProducts : [...productosRechazados]
            }

            //Respondo con los datos de la operación
            res.send(respuesta);
        }
        catch (err) {
            res.status(404).json({
                status: "ERROR",
                error: err.toString()
            })
        }

    }


}
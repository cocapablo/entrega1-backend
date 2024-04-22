//import ProductManager from "../dao/mongo/ProductManagerMongo.js";
import { productService } from "../repositories/index.js";
import { socketServer } from "../app.js";


export class ProductController {
    #productService;
    
    constructor() {
        //this.#productService = new ProductManager(""); //Esto después se cambiará por lo que gestione el Factory
        this.#productService = productService;
        this.getProductsPaginated = this.getProductsPaginated.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    getService() {
        return this.#productService;
    }

    async getProductsPaginated(req, res){
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
            productos = await this.#productService.getProductsWithPaginationAsync(limite, pagina, consulta, orden);
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
    }

    
    async getProduct(req, res) {
        let idProducto;
    
        if (req.params.pid) {
            idProducto = req.params.pid;
            console.log("idelegido: ", idProducto);
            this.#productService.getProductByIdAsync(idProducto).then(
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
    }

    async createProduct(req, res) {
        let nuevoProducto;

        nuevoProducto = req.body;
        /* console.log("Request: ", req);
        console.log("Nuevo Producto: ", nuevoProducto); */

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
            console.log("ERROR: ", err);
            res.status(404).json({
                status: "ERROR",
                error: err.toString()
            })
        })    
    }

    async updateProduct(req, res) {
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
    }

    async deleteProduct(req, res) {
        let idProducto;
    

        //console.log("Request: ", req);

        if (req.params.pid) {
            idProducto = req.params.pid;
            this.#productService.deleteProductAsync(idProducto).then(resultado => {
                console.log("Resultado: ", resultado);
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
    }

}
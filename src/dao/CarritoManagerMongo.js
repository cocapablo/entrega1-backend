import mongoose from "mongoose";
import cartModel from "./models/cartsModel.js";

class CarritoManager {
    #carritos;
    #path;
    #productManager;

    
    constructor(path, prodManager) {
        this.#carritos = [];
        this.#path = path;
        this.#productManager = prodManager;
 
    }

    
    async getCarritosAsync() {

        try {
            let carritosBD = await cartModel.find();
            //Armo el carrito con el formato que utilizamos
            console.log("carritosBd: ", carritosBD);
            
            this.#carritos = carritosBD.map(carrito => {
                let productos = carrito.products.map(producto => {
                    return (
                        {
                            id: producto.id.toString(),
                            quantity: producto.quantity
                        }
                    )
                });

                return (
                    {
                        id: carrito._id.toString(),
                        products: productos


                    }
                )
            })
        }
        catch (error) {
            console.error("ERROR: ", error);
            throw new Error(error);
        }


        return this.#carritos;
    }

    async getProductsDeCarritoByIdAsync(idCarrito) {
        let carritoSelected; 
        let productos;
        

        try {
            carritoSelected = await cartModel.findOne({_id: idCarrito}).populate("products.id");

            if (!carritoSelected) {
                console.log("Not found");
                throw new Error("Not found");
            }

            //Devuelvo los productos con el formato que utilizamos
            productos = carritoSelected.products.map(producto => {
                const {_id, title, description, price, thumbnail, code, stock, category, status} = producto.id;

                return (
                    {
                        id: _id.toString(),
                        title, 
                        description, 
                        price, 
                        thumbnail, 
                        code, 
                        stock, 
                        category, 
                        status,
                        quantity: producto.quantity
                    }
                )    
            });
        }
        catch (error) {
            throw error;
        }

        return productos;

    }

    async getCarritoByIdAsync(idCarrito) {
        let carritoSelected; 
        let carritoDevuelto;

        try {
            carritoSelected = await cartModel.findOne({_id: idCarrito});

            if (!carritoSelected) {
                console.log("Not found");
                throw new Error("Not found");
            }

            carritoDevuelto = {
                id : carritoSelected._id.toString(),

                //Devuelvo los productos con el formato que utilizamos
                products : carritoSelected.products.map(producto => {
                    return (
                        {
                            id: producto.id.toString(),
                            quantity: producto.quantity
                        }
                    )    
                })
            }
    
        }
        catch (error) {
            throw error;
        }

        return carritoDevuelto;

    }

    async getProductDeCarritoAsync(idCarrito, idProducto) {
        let productos;
        let productSelected;

        try {

            //Cargo los Productos del carrito
            productos = await this.getProductsDeCarritoByIdAsync(idCarrito);

            if (!productos) {
                console.log("Carrito Not found");
                return "Carrito Not found";
            }

            //Busco el Producto dentro del carrito
            productSelected = productos.find(producto => producto.id === idProducto);

            if (!productSelected) {
                console.log("Not found");
                return "Not found";
            }

        }
        catch (error)  {
            throw error;
        }

        return productSelected;

    }

    async addCarritoAsync() {
        let newCarrito;
               

        try {
            
            //Agrego el carrito
            newCarrito = {
                products: [] 
            }

            let resultado = await cartModel.create(newCarrito);


            //Agrego el nuevo id a newCarrito
            newCarrito = {
                id: resultado._id.toString(),
                ...newCarrito
            }

            this.#carritos.push(newCarrito);

        }
        catch (error) {
            throw (error);
        }


        return newCarrito;

    }

    async addProductToCarritoAsync(idCarrito, idProducto, cantidad = 1) {
        let newCarrito;
        let newProduct;
        let resultado;
        
        try {
            //Validaciones
            //Me fijo que el carrito exista

            //Cargo los carritos anteriores
            this.#carritos = await this.getCarritosAsync();

            newCarrito = await this.getCarritoByIdAsync(idCarrito);

            if (newCarrito === "Not found") {
                throw new Error("ERROR: El carrito con el id especificado no existe");
            }

            //Me fijo que idProducto sea un Producto existente
            let producto = await this.#productManager.getProductByIdAsync(idProducto);

            if (producto === "Not found") {
                throw new Error("ERROR: El producto con el id especificado no existe");
            }

            //Me fijo si el producto ya estaba en el carrito
            let viejoProducto = await this.getProductDeCarritoAsync(idCarrito, idProducto);

            if (viejoProducto === "Not found") {
                //El Producto no estaba en el carrito: lo agrego
                newProduct = {
                    id: idProducto,
                    quantity : cantidad
                }

                //resultado = await cartModel.findById(idCarrito).products.push(newProduct);
                resultado = await cartModel.findByIdAndUpdate(idCarrito, {$push : {products: newProduct}});

                console.log("Resultado de agregar un producto: ", resultado);
            }
            else {
                //El producto ya estaba en el carrito: Actualizo el producto (le sumo la cantidad)
                newProduct = {
                    id: idProducto,
                    quantity : viejoProducto.quantity + cantidad
                }

                resultado = await cartModel.updateOne({_id: idCarrito, "products.id": idProducto}, {$set: {"products.$[product].quantity" :  newProduct.quantity}}, {arrayFilters: [{"product.id": idProducto}]});

                console.log("Resultado de actualizar un producto: ", resultado);
            }
            
            //Obtengo newCarrito con el formato que utilizamos
            newCarrito = await this.getCarritoByIdAsync(idCarrito);

            //Agrego el carrito con las modificaciones
            this.#carritos.push(newCarrito);
            
        }
        catch (error) {
            throw (error);
        }

        return newCarrito;

    }

    async setProductsToCarritoAsync(idCarrito, productos = []) {
        let newCarrito;
        let resultado;

        try {
            //Validaciones
            //Me fijo que el carrito exista

            newCarrito = await this.getCarritoByIdAsync(idCarrito);

            if (newCarrito === "Not found") {
                throw new Error("ERROR: El carrito con el id especificado no existe");
            }

            //Agrego los productos a newCarrito
            //resultado = await cartModel.findById(idCarrito).products.push(newProduct);
            resultado = await cartModel.findByIdAndUpdate(idCarrito, {$set : {products: productos}});

            console.log("Resultado de agregar los productos: ", resultado);
            
                        
            //Obtengo newCarrito con las modificaciones
            newCarrito = await this.getCarritoByIdAsync(idCarrito);

                        
        }
        catch (error) {
            throw (error);
        }

        return newCarrito;    
    }

    async deleteProductDeCarrito(idCarrito, idProducto) {
        let newCarrito;
        let resultado;
        
        try {
            //Validaciones
            //Me fijo que el carrito exista

            newCarrito = await this.getCarritoByIdAsync(idCarrito);

            if (newCarrito === "Not found") {
                throw new Error("ERROR: El carrito con el id especificado no existe");
            }

            //Me fijo que idProducto sea un Producto existente
            let producto = await this.#productManager.getProductByIdAsync(idProducto);

            if (producto === "Not found") {
                throw new Error("ERROR: El producto con el id especificado no existe");
            }

            //Borro el producto del Carrito
            resultado = await cartModel.findByIdAndUpdate(idCarrito, {$pull: {products: {id: idProducto}}});

            console.log("Resultado de eliminar un producto: ", resultado);
            
            
            //Obtengo newCarrito con el formato que utilizamos
            newCarrito = await this.getCarritoByIdAsync(idCarrito);
           
        }
        catch (error) {
            throw (error);
        }

        return newCarrito;
        
    }

    async setProductToCarritoAsync(idCarrito, idProducto, cantidad = 1) {
        let newCarrito;
        let newProduct;
        let resultado;
        
        try {
            //Validaciones
            //Me fijo que el carrito exista

            newCarrito = await this.getCarritoByIdAsync(idCarrito);

            if (newCarrito === "Not found") {
                throw new Error("ERROR: El carrito con el id especificado no existe");
            }

            //Me fijo que idProducto sea un Producto existente
            let producto = await this.#productManager.getProductByIdAsync(idProducto);

            if (producto === "Not found") {
                throw new Error("ERROR: El producto con el id especificado no existe");
            }

            newProduct = {
                id: idProducto,
                quantity : cantidad
            } 

            //Me fijo si el producto ya estaba en el carrito
            let viejoProducto = await this.getProductDeCarritoAsync(idCarrito, idProducto);

            if (viejoProducto === "Not found") {
                //El Producto no estaba en el carrito: lo agrego
               
                resultado = await cartModel.findByIdAndUpdate(idCarrito, {$push : {products: newProduct}});

                console.log("Resultado de agregar un producto: ", resultado);
            }
            else {
                //El producto ya estaba en el carrito: Actualizo el producto (con la cantidad pasaod como parmámetro)
                
                resultado = await cartModel.updateOne({_id: idCarrito, "products.id": idProducto}, {$set: {"products.$[product].quantity" :  newProduct.quantity}}, {arrayFilters: [{"product.id": idProducto}]});

                console.log("Resultado de actualizar un producto: ", resultado);
            }
            
            //Obtengo newCarrito con el formato que utilizamos
            newCarrito = await this.getCarritoByIdAsync(idCarrito);
                        
        }
        catch (error) {
            throw (error);
        }

        return newCarrito;

    }

    async getCarritoWithProductsByIdAsync(idCarrito) {
        let carritoSelected; 
        let carritoDevuelto;

        try {
            carritoSelected = await cartModel.findOne({_id: idCarrito}).populate("products.id");

            if (!carritoSelected) {
                console.log("Not found");
                throw new Error("Not found");
            }

            console.log("Carrito populated: ", carritoSelected);

            carritoDevuelto = {
                id : carritoSelected._id.toString(),

                //Devuelvo los productos con el formato que utilizamos
                products : carritoSelected.products.map(producto => {
                    const {_id, title, description, price, thumbnail, code, stock, category, status} = producto.id;

                    return (
                        {
                            id: _id.toString(),
                            title, 
                            description, 
                            price, 
                            thumbnail, 
                            code, 
                            stock, 
                            category, 
                            status,
                            quantity: producto.quantity
                        }
                    )    
                })
            }
    
        }
        catch (error) {
            throw error;
        }

        return carritoDevuelto;
    
    }

    async getCarritosWithProductsByIdAsync() {
        
        try {
            let carritosBD = await cartModel.find().populate("products.id");

            //Armo el carrito con el formato que utilizamos
            console.log("carritosBd: ", carritosBD);
            
            this.#carritos = carritosBD.map(carrito => {
                let productos = carrito.products.map(producto => {
                    const {_id, title, description, price, thumbnail, code, stock, category, status} = producto.id;

                    return (
                        {
                            id: _id.toString(),
                            title, 
                            description, 
                            price, 
                            thumbnail, 
                            code, 
                            stock, 
                            category, 
                            status,
                            quantity: producto.quantity
                        }
                    )
                });

                return (
                    {
                        id: carrito._id.toString(),
                        products: productos
                    }
                )
            })
        }
        catch (error) {
            console.error("ERROR: ", error);
            throw new Error(error);
        }


        return this.#carritos;

        
    }

}



export default CarritoManager;
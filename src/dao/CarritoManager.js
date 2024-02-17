import { writeFileSync, existsSync, readFileSync } from "fs";
import { access, readFile, writeFile } from "fs/promises";
import ProductManager from "./ProductManager.js";

class CarritoManager {
    #carritos;
    #path;
    #productManager;

    
    constructor(path, prodManager) {
        this.#carritos = [];
        this.#path = path;
        this.#productManager = prodManager;
 
    }

    async #leerCarritosEnArchivoAsync() {
        let carritos = [];
        let cadenaJson;

        try {
            if (await access(this.#path).then(() => true).catch(() => false)) {
                cadenaJson =  await readFile(this.#path); 
                carritos = JSON.parse(cadenaJson);  
            
            }
        }
        catch (error) {
            console.error("ERROR: ", error);
            throw new Error("ERROR: " + error);
        }

        return carritos;
    }

    async #grabarCarritosEnArchivoAsync(carritos) {
        //Grabo los carritos de forma asincrónica 
             
        //Paso 1: Convierto los carritos a json
        let cadenaJson = JSON.stringify(carritos, null, 4);

        try {
            //Paso 2: Grabo los carritos en el archivo
            await writeFile(this.#path, cadenaJson);
        }
        catch (error) {
            console.error("ERROR: ", error);
            throw new Error("ERROR: " + error);   
        }

        
    }

    async getCarritosAsync() {

        try {
            this.#carritos = await this.#leerCarritosEnArchivoAsync();
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
            //Valido idCarrito
            let idCart = parseInt(idCarrito);

            if (isNaN(idCart)) {
                throw new Error("Not found");
            }

            //Cargo los carritos desde el archivo
            this.#carritos = await this.#leerCarritosEnArchivoAsync();

            carritoSelected = this.#carritos.find(carrito => carrito.id === idCart);

            if (!carritoSelected) {
                console.log("Not found");
                throw new Error("Not found");
            }

            productos = carritoSelected.products;
        }
        catch (error) {
            throw error;
        }

        return productos;

    }

    async getCarritoByIdAsync(idCarrito) {
        let carritoSelected; 

        try {
            //Valido idCarrito
            let idCart = parseInt(idCarrito);

            if (isNaN(idCart)) {
                throw new Error("Not found");
            }

            //Cargo los Productos de Carrito
            this.#carritos = await this.#leerCarritosEnArchivoAsync();

            carritoSelected = this.#carritos.find(carrito => carrito.id === idCart);

            if (!carritoSelected) {
                console.log("Not found");
                return "Not found";
            }
        }
        catch (error) {
            throw error;
        }

        return carritoSelected;

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
            
            //Cargo los carritos anteriores
            this.#carritos = await this.#leerCarritosEnArchivoAsync();

            //Agrego el nuevo carrito
            newCarrito = {
                id: this.#carritos.length === 0 ? 1 : this.#carritos[this.#carritos.length - 1].id + 1, //Esto funciona porque el array siempre está ordenado por id de menor a mayor
                products : [] 
            }

            this.#carritos.push(newCarrito);

            //Grabo los carritos en el archivo
            await this.#grabarCarritosEnArchivoAsync(this.#carritos);
    
        }
        catch (error) {
            throw (error);
        }



        return newCarrito;

    }

    async addProductToCarritoAsync(idCarrito, idProducto, cantidad = 1) {
        let newCarrito;
        let newProduct;
        
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
            }
            else {
                //El producto ya estaba en el carrito: Actualizo el producto (le sumo la cantidad)
                newProduct = {
                    id: idProducto,
                    quantity : viejoProducto.quantity + cantidad
                }
            }
            
            //Borro el producto de los productos actuales
            newCarrito.products = newCarrito.products.filter(product => product.id !== newProduct.id);
            console.log("Así quedaron los productos en addProductToCarritoAsync", newCarrito.products);

            //Agrego el producto con las modificaciones
            newCarrito.products.push(newProduct);

            //Ordeno el array por idProdcuto
            newCarrito.products.sort((a, b) => a.id - b.id);

            //Borro newCarrito de carritos
            this.#carritos = this.#carritos.filter(carrito => carrito.id !== newCarrito.id);
            console.log("Así quedaron los carritos en addProductToCarritoAsync", this.#carritos);

            //Agrego el carrito con las modificaciones
            this.#carritos.push(newCarrito);

            //Ordeno los carritos por el id
            this.#carritos.sort((a, b) => a.id - b.id);

            //Grabo los carritos en el archivo
            await this.#grabarCarritosEnArchivoAsync(this.#carritos);
        }
        catch (error) {
            throw (error);
        }

        return newCarrito;

    }

}

export default CarritoManager;
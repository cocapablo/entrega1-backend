import mongoose from "mongoose";
import productModel from "./models/products.model.js";
import mongoosePaginate from 'mongoose-paginate-v2';

class ProductManager {
    #products;
    #path;

    
    constructor(path) {
        this.#products = [];
        this.#path = path;
    }

    async getProductsAsync() {

        try {
            let productosBD = await productModel.find();
            //Armo la coleccion de productos con el formato que utilizamos

            this.#products = productosBD.map(producto => {
                return (
                    {
                        id: producto._id.toString(),
                        title: producto.title,
                        description: producto.description,
                        price: producto.price,
                        thumbnail: producto.thumbnail,
                        code: producto.code,
                        stock: producto.stock,
                        category: producto.category,
                        status: producto.status

                    }
                )
            })
        }
        catch (error) {
            console.error("ERROR: ", error);
            throw new Error(error);
        }


        return this.#products;
    }

    async getProductsByLimitAsync(limite) {
        
        try {
            let productosBD = await productModel.find().limit(limite);
            //Armo la coleccion de productos con el formato que utilizamos

            this.#products = productosBD.map(producto => {
                return (
                    {
                        id: producto._id.toString(),
                        title: producto.title,
                        description: producto.description,
                        price: producto.price,
                        thumbnail: producto.thumbnail,
                        code: producto.code,
                        stock: producto.stock,
                        category: producto.category,
                        status: producto.status

                    }
                )
            })
        }
        catch (error) {
            console.error("ERROR: ", error);
            throw new Error(error);
        }


        return this.#products;
    }

    async addProductAsync({title = "", description = "", price = -1, thumbnail = "", code = "", stock = -1, category = "", status = true}) {
        let newProduct;

        try {
            //Validaciones
            if (title.trim().length === 0) {
                throw new Error("ERROR: title vacío");
            }

            if (description.trim().length === 0) {
                throw new Error("ERROR: description vacío");
            }

            if (price <=0) {
                throw new Error("ERROR: price debe ser mayor que cero");    
            }

            if (category.trim().length === 0) {
                throw new Error("ERROR: category vacío");
            }

            if (code.trim().length === 0) {
                throw new Error("ERROR: code vacío");
            }

            if (stock <=0) {
                throw new Error("ERROR: stock debe ser mayor que cero");    
            }

            //Cargo los productos anteriores
            this.#products = await this.getProductsAsync();

            //Me fijo que el code no exista ya
            if (this.#products.find(product => product.code === code)) {
                throw new Error("ERROR: code ya existente");        
            }

            //Agrego el producto

            newProduct = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
                status  
            }

            let resultado = await productModel.create(newProduct);


            //Agrego el nuevo id a newProduct
            newProduct = {
                id: resultado._id.toString(),
                ...newProduct
            }

            this.#products.push(newProduct);

               
        }
        catch (error) {
            throw (error);
        }

        return newProduct;

    }

    async updateProductAsync(productoModificado) {
        let newProduct;

        try {
            //Validaciones
            if (!productoModificado.id) {
                throw new Error("ERROR: id Producto inválido");
            }

                        
            //Cargo los productos anteriores
            this.#products = await this.getProductsAsync();

            let viejoProducto = await this.getProductByIdAsync(productoModificado.id);

            if (viejoProducto === "Not found") {
                throw new Error("ERROR: El producto con el id especificado no existe");
            }

            //Me fijo que el code no exista ya en algún producto que no sea el especificado para hacer el update
            if (this.#products.find(product => ((product.code === productoModificado.code) && (product.id !== productoModificado.id)))) {
                throw new Error("ERROR: code ya existente");        
            } 

            //Actualizo el producto
            let cambiosProducto = {};

            productoModificado.title && (cambiosProducto.title = productoModificado.title);
            productoModificado.description && (cambiosProducto.description = productoModificado.description);
            productoModificado.price &&  (cambiosProducto.price = productoModificado.price);
            productoModificado.thumbnail && (cambiosProducto.thumbnail = productoModificado.thumbnail);
            productoModificado.code && (cambiosProducto.code = productoModificado.code);
            productoModificado.stock && (cambiosProducto.stock = productoModificado.stock);
            productoModificado.category && (cambiosProducto.category = productoModificado.category);
            productoModificado.status && (cambiosProducto.status = productoModificado.status);
            
            let resultado = await productModel.updateOne({_id: productoModificado.id}, cambiosProducto);

            newProduct = {
                ...viejoProducto,
                ...cambiosProducto
            }
            
            
        }
        catch (error) {
            throw (error);
        }

        return newProduct;

    }

    async getProductByIdAsync(idProduct) {
        let productSelected; 
        
        
        try {

            let producto = await productModel.findOne({_id: idProduct});
            console.log("Producto encontrado: ", producto);

            //Cargo el producto
            productSelected = {
                id: producto._id.toString(),
                title: producto.title,
                description: producto.description,
                price: producto.price,
                thumbnail: producto.thumbnail,
                code: producto.code,
                stock: producto.stock,
                category: producto.category,
                status: producto.status

            }

        }
        catch (error) {
            throw error;
        }

        return productSelected;

    }

    async deleteProductAsync(idProduct) {
       
        try {
            let result = await productModel.deleteOne({_id: idProduct});
        }
        catch (error) {
            throw error;
        }

        return true;

    }

    async getProductsWithPaginationAsync(limit = 10, page = 1, query = {}, sort = "") {
        let productosBD; 
        let opciones;

        try {
            opciones = {
                limit: limit,
                page: page
            }

            if (sort) {
                console.log("SORT: ", sort);

                if (sort === "ASC") {
                    //Ordenamiento por price de menor a mayor
                    opciones.sort = {price: 1}
                    console.log("Estoy acá en ASC");
                }
                else if (sort === "DES") {
                    //Ordenamiento por price de mayor a menor
                    opciones.sort = {price: -1}
                    console.log("Estoy acá en DES");
                }
                else {
                    console.log("No entré a ningún lado - SORT vacío");
                }
            }

            productosBD = await productModel.paginate(query, opciones);

            //Armo la coleccion de productos con el formato que utilizamos

            this.#products = productosBD.docs.map(producto => {
                return (
                    {
                        id: producto._id.toString(),
                        title: producto.title,
                        description: producto.description,
                        price: producto.price,
                        thumbnail: producto.thumbnail,
                        code: producto.code,
                        stock: producto.stock,
                        category: producto.category,
                        status: producto.status

                    }
                )
            })

            //Configuro productosBD.docs con el formato que utilizamos
            productosBD.docs = this.#products;

           
        }
        catch (error) {
            console.error("ERROR: ", error);
            throw new Error(error);
        }


        return productosBD;
    }


}

export default ProductManager; 
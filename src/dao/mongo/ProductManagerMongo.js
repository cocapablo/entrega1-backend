import mongoose from "mongoose";
import productModel from "../models/products.model.js";
import mongoosePaginate from 'mongoose-paginate-v2';

//Errores
import EErrors from "../../services/errors/enums.js";
import CustomError from "../../services/errors/CustomError.js";
import { generateProductErrorInfo } from "../../services/errors/info.js";
import { generateDatabaseErrorInfo } from "../../services/errors/info.js";

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
            /* console.error("ERROR: ", error);
            throw new Error(error); */

            //Creo un Custom Error
            const miError = CustomError.createError({
                name: "Error devolviendo Productos",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
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
            /* console.error("ERROR: ", error);
            throw new Error(error); */
            //Creo un Custom Error
            const miError = CustomError.createError({
                name: "Error devolviendo Productos",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }


        return this.#products;
    }

    async addProductAsync({title = "", description = "", price = -1, thumbnail = "", code = "", stock = -1, category = "", status = true}) {
        let newProduct;

        try {
            //Validaciones
            if (title.trim().length === 0) {
                //throw new Error("ERROR: title vacío");
                CustomError.createError({
                    name: "Error creando un Producto",
                    cause: generateProductErrorInfo({title, description, price, thumbnail, code, stock, category, status}),
                    message: "ERROR: title vacío",
                    code: EErrors.INVALID_TYPES_ERROR
                })

                
            }

            if (description.trim().length === 0) {
                //throw new Error("ERROR: description vacío");
                CustomError.createError({
                    name: "Error creando un Producto",
                    cause: generateProductErrorInfo({title, description, price, thumbnail, code, stock, category, status}),
                    message: "ERROR: description vacío",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            if (price <=0) {
                //throw new Error("ERROR: price debe ser mayor que cero");   
                CustomError.createError({
                    name: "Error creando un Producto",
                    cause: generateProductErrorInfo({title, description, price, thumbnail, code, stock, category, status}),
                    message: "ERROR: price debe ser mayor que cero",
                    code: EErrors.INVALID_TYPES_ERROR
                }) 
            }

            if (category.trim().length === 0) {
                //throw new Error("ERROR: category vacío");
                CustomError.createError({
                    name: "Error creando un Producto",
                    cause: generateProductErrorInfo({title, description, price, thumbnail, code, stock, category, status}),
                    message: "ERROR: category vacío",
                    code: EErrors.INVALID_TYPES_ERROR
                }) 
            }

            if (code.trim().length === 0) {
                //throw new Error("ERROR: code vacío");
                CustomError.createError({
                    name: "Error creando un Producto",
                    cause: generateProductErrorInfo({title, description, price, thumbnail, code, stock, category, status}),
                    message: "ERROR: code vacío",
                    code: EErrors.INVALID_TYPES_ERROR
                }) 
            }

            if (stock <=0) {
                //throw new Error("ERROR: stock debe ser mayor que cero");   
                CustomError.createError({
                    name: "Error creando un Producto",
                    cause: generateProductErrorInfo({title, description, price, thumbnail, code, stock, category, status}),
                    message: "ERROR: stock debe ser mayor que cero",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            //Cargo los productos anteriores
            this.#products = await this.getProductsAsync();

            //Me fijo que el code no exista ya
            if (this.#products.find(product => product.code === code)) {
                //throw new Error("ERROR: code ya existente");  
                CustomError.createError({
                    name: "Error creando un Producto",
                    cause: generateProductErrorInfo({title, description, price, thumbnail, code, stock, category, status}),
                    message: "ERROR: code ya existente",
                    code: EErrors.INVALID_TYPES_ERROR
                })      
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
            //Me fijo si el error es Custom o de la Base de Datos
            if (error.isCustom) {
                throw (error);
            }

            //Es Error de la Base de Datos
            //Creo un Custom Error
            CustomError.createError({
                name: "Error creando un Producto",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }

        return newProduct;

    }

    async updateProductAsync(productoModificado) {
        let newProduct;

        try {
            //Validaciones
            if (!productoModificado.id) {
                //throw new Error("ERROR: id Producto inválido");
                CustomError.createError({
                    name: "Error actualizando un Producto",
                    cause: generateProductErrorInfo(productoModificado),
                    message: "ERROR: id Producto inválido",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

                        
            //Cargo los productos anteriores
            this.#products = await this.getProductsAsync();

            let viejoProducto = await this.getProductByIdAsync(productoModificado.id);

            if (viejoProducto === "Not found") {
                //throw new Error("ERROR: El producto con el id especificado no existe");
                CustomError.createError({
                    name: "Error actualizando un Producto",
                    cause: generateProductErrorInfo(productoModificado),
                    message: "ERROR:  producto con el id especificado no existe",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            //Me fijo que el code no exista ya en algún producto que no sea el especificado para hacer el update
            if (this.#products.find(product => ((product.code === productoModificado.code) && (product.id !== productoModificado.id)))) {
                //throw new Error("ERROR: code ya existente"); 
                CustomError.createError({
                    name: "Error actualizando un Producto",
                    cause: generateProductErrorInfo(productoModificado),
                    message: "ERROR: code ya existente",
                    code: EErrors.INVALID_TYPES_ERROR
                })       
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
            //throw (error);
            //Me fijo si el error es Custom o de la Base de Datos
            if (error.isCustom) {
                throw (error);
            }

            //Es Error de la Base de Datos
            //Creo un Custom Error
            CustomError.createError({
                name: "Error actualizando un Producto",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }

        return newProduct;

    }

    async getProductByIdAsync(idProduct) {
        let productSelected; 
        
        
        try {

            let producto = await productModel.findOne({_id: idProduct});
            //console.log("Producto encontrado: ", producto);

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
            //throw error;
            CustomError.createError({
                name: "Error obteniendo un Producto",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }

        return productSelected;

    }

    async deleteProductAsync(idProduct) {
       
        try {
            let result = await productModel.deleteOne({_id: idProduct});
        }
        catch (error) {
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error eliminando un Producto",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
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
                //console.log("SORT: ", sort);

                if (sort === "ASC") {
                    //Ordenamiento por price de menor a mayor
                    opciones.sort = {price: 1}
                    //console.log("Estoy acá en ASC");
                }
                else if (sort === "DES") {
                    //Ordenamiento por price de mayor a menor
                    opciones.sort = {price: -1}
                    //console.log("Estoy acá en DES");
                }
                else {
                    //console.log("No entré a ningún lado - SORT vacío");
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
            //console.error("ERROR: ", error);
            //throw new Error(error);
            //throw error;
            //Creo un Custom Error
            CustomError.createError({
                name: "Error obteniendo Productos",
                cause: generateDatabaseErrorInfo(error),
                message: error.message,
                code: EErrors.DATABASE_ERROR
            })
        }


        return productosBD;
    }


}

export default ProductManager; 
const fs = require("fs");

class ProductManager {
    #products;
    #path;

    
    constructor(path) {
        this.#products = [];
        this.#path = path;
    }

    addProduct({title = "", description = "", price = -1, thumbnail = "", code = "", stock = -1}) {
                
        //Validaciones
        if (title.trim().length === 0) {
            return "ERROR: title vacío";
        }

        if (description.trim().length === 0) {
            return "ERROR: description vacío";
        }

        if (price <=0) {
            return "ERROR: price debe ser mayor que cero";    
        }

        if (thumbnail.trim().length === 0) {
            return "ERROR: thumbnail vacío";
        }

        if (code.trim().length === 0) {
            return "ERROR: code vacío";
        }

        if (stock <=0) {
            return "ERROR: stock debe ser mayor que cero";    
        }

        //Cargo los productos anteriores
        this.#products = this.#leerProductosEnArchivo();

        //Me fijo que el code no exista ya
        if (this.#products.find(product => product.code === code)) {
            return "ERROR: code ya existente";        
        }

        //Agrego el producto
        let newProduct = {
            id: this.#products.length === 0 ? 1 : this.#products[this.#products.length - 1].id + 1, //Esto funciona porque el array siempre está ordenado por id de menor a mayor
            title,
            description,
            price,
            thumbnail,
            code,
            stock  
        }

        this.#products.push(newProduct);

        //Grabo los productos en el archivo
        this.#grabarProductosEnArchivo(this.#products);

        return newProduct;

    }

    updateProduct(productoModificado) {
                
        //Validaciones
        if (!productoModificado.id) {
            return "ERROR: id Producto inválido";
        }

        //Cargo los productos anteriores
        this.#products = this.#leerProductosEnArchivo();

        let viejoProducto = this.getProductById(productoModificado.id);

        if (viejoProducto === "Not found") {
            return "ERROR: El producto con el id especificado no existe";
        }

        //Me fijo que el code no exista ya en algún producto que no sea el especificado para hacer el update
        if (this.#products.find(product => ((product.code === productoModificado.code) && (product.id !== productoModificado.id)))) {
            return "ERROR: code ya existente";        
        }

        //Actualizo el producto
        let newProduct = {
            ...viejoProducto,
            ...productoModificado //Solo cambio las propiedades especificadas acá
        }
        
        //Borro el producto del array actual
        this.#products = this.#products.filter(product => product.id !== newProduct.id);
        console.log("Así quedaron los productos en updateProduct", this.#products);

        //Agrego el producto con las modificaciones
        this.#products.push(newProduct);

        //Ordeno el array por id
        this.#products.sort((a, b) => a.id - b.id);

        //Grabo los productos en el archivo
        this.#grabarProductosEnArchivo(this.#products);

        return newProduct;

    }

    deleteProduct(idProducto) {
                
        //Validaciones
        if (idProducto <= 0) {
            return "ERROR: id Producto inválido";
        }

        //Cargo los productos anteriores
        this.#products = this.#leerProductosEnArchivo();

                
        //Borro el producto del array actual
        this.#products = this.#products.filter(product => product.id !== idProducto);
        console.log("Así quedaron los productos en deleteProducts", this.#products);

        //Ordeno el array por id
        this.#products.sort((a, b) => a.id - b.id);

        //Grabo los productos en el archivo
        this.#grabarProductosEnArchivo(this.#products);

        return true;

    }

    getProducts() {

        this.#products = this.#leerProductosEnArchivo();

        return this.#products;
    }

    getProductById(idProduct) {
        let productSelected; 

        //Cargo los prodctos desde el archivo
        this.#products = this.#leerProductosEnArchivo();

        productSelected = this.#products.find(product => product.id === idProduct);

        if (!productSelected) {
            console.log("Not found");
            return "Not found";
        }

        return productSelected;

    }

    #grabarProductosEnArchivo(productos) {
        //Grabo los producots de forma sincrónico 
        
        //Paso 1: Convierto los productos a json
        let cadenaJson = JSON.stringify(productos, null, 4);

        //Paso 2: Grabo los productos en el archivo
        fs.writeFileSync(this.#path, cadenaJson)
        
    }

    #leerProductosEnArchivo() {
        let productos = [];
        let cadenaJson;

        //Chequeo que el archivo exista
        if (fs.existsSync(this.#path) === true) {
            cadenaJson = fs.readFileSync(this.#path);
            productos = JSON.parse(cadenaJson);
        }

        return productos;
    }
}

//Pruebas
let prodManager = new ProductManager("productos.json");

let prod1 = prodManager.addProduct({title: "Berenjenas", description: "Sabroso vegetal alargada", price: 1000, thumbnail: "https://th.bing.com/th?id=OIP.nH0F9FpvxnWmKP0reKs98QHaHR&w=252&h=247&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "BEREN", stock: 150});
console.log(prod1);

let prod2 = prodManager.addProduct({title: "Zapallitos", description: "Verdura recomendada por las abuelas", price: 1500, thumbnail: "https://th.bing.com/th?id=OIP.dRvFBCOqjHLpsJ6R1gGdjQHaFj&w=288&h=216&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "ZAPALL", stock: 300 });
console.log(prod2);

let prod3 = prodManager.addProduct({title: "Bananas", description: "Fruta amarilla", price: 3000, thumbnail: "https://th.bing.com/th?id=OIP.UtpeqGM0X-sTDYUk3ZdJRwHaE8&w=305&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "BANAN", stock: 250 });
console.log(prod3);

//Acá debe dar error por code repetido
let prod4 = prodManager.addProduct({title: "Bananas bis", description: "Fruta amarilla bis", price: 3000, thumbnail: "https://th.bing.com/th?id=OIP.UtpeqGM0X-sTDYUk3ZdJRwHaE8&w=305&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "BANAN", stock: 5000 });

console.log(prod4);

//Muestro todos los productos
console.log(prodManager.getProducts());

//Busco un producto que exista: id = 1
console.log(prodManager.getProductById(1));

//Busco un producto que no exista: id = 20
console.log(prodManager.getProductById(20));

//Update
//Cambio el precio de la berenjena
let prodActualizado = prodManager.updateProduct({id: 1, price: 10000, description: "Sabroso vegetal con forma extrema"});
console.log("Producto actualizado", prodActualizado);

let prod5 = prodManager.addProduct({title: "Melones", description: "Fruta enorme y circular que es casi todo agua", price: 400, thumbnail: "https://th.bing.com/th?id=OIP.ZD-dcfECzgWSmj4qrpYyXwHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "MELON", stock: 1500 });
console.log(prod5);

//Muestro todos los productos
console.log(prodManager.getProducts());

//Borro los zapallitos
prodManager.deleteProduct(2);

//Muestro todos los productos
console.log(prodManager.getProducts());



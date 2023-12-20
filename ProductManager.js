class ProductManager {
    #products;
    
    constructor() {
        this.#products = [];
    }

    addProduct(title = "", description = "", price = -1, thumbnail = "", code = "", stock = -1) {
                
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

        //Me fijo que el code no exista ya
        if (this.#products.find(product => product.code === code)) {
            return "ERROR: code ya existente";        
        }

        //Agrego el producto
        let newProduct = {
            id: this.#products.length + 1,  
            title,
            description,
            price,
            thumbnail,
            code,
            stock  
        }

        this.#products.push(newProduct);

        return newProduct;

    }

    getProducts() {
        return this.#products;
    }

    getProductById(idProduct) {
        let productSelected; 

        productSelected = this.#products.find(product => product.id === idProduct);

        if (!productSelected) {
            console.log("Not found");
            return "Not found";
        }

        return productSelected;

    }
}

//Pruebas
let prodManager = new ProductManager();

let prod1 = prodManager.addProduct("Berenjenas", "Sabroso vegetal alargada", 1000, "https://th.bing.com/th?id=OIP.nH0F9FpvxnWmKP0reKs98QHaHR&w=252&h=247&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", "BEREN", 150);
console.log(prod1);

let prod2 = prodManager.addProduct("Zapallitos", "Verdura recomendada por las abuelas", 1500, "https://th.bing.com/th?id=OIP.dRvFBCOqjHLpsJ6R1gGdjQHaFj&w=288&h=216&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", "ZAPALL", 300);
console.log(prod2);

let prod3 = prodManager.addProduct("Bananas", "Fruta amarilla", 3000, "https://th.bing.com/th?id=OIP.UtpeqGM0X-sTDYUk3ZdJRwHaE8&w=305&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", "BANAN", 250);
console.log(prod3);

//Acá debe dar error por code repetido
let prod4 = prodManager.addProduct("Bananas bis", "Fruta amarilla bis", 3000, "https://th.bing.com/th?id=OIP.UtpeqGM0X-sTDYUk3ZdJRwHaE8&w=305&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", "BANAN", 5000);
console.log(prod4);

//Muestro todos los productos
console.log(prodManager.getProducts());

//Busco un producto que exista: id = 1
console.log(prodManager.getProductById(1));

//Busco un producto que no exista: id = 20
console.log(prodManager.getProductById(20));
const express = require("express");
const ProductManager = require("./ProductManager");


const port = 8080;

const app = express();

//Endpoint

app.get("/", (req, res) => res.send("<h1 style='color: blue; text-align: center' >Bienvenido al Server de Productos </h1>"));


app.get("/products", (req, res) => {
    let prodManager = new ProductManager("productos.json");

    let productos = prodManager.getProductsAsync().then(
        productos => {
            //Me fijo si especificaron algún límite de cantidad de productos
            let prodLimitados = [...productos]; //Creo una copia del array
            let consultas = req.query;
            let limite; 

            if (consultas.limit && !isNaN(limite = parseInt(consultas.limit))) {
                //Hay un limite especificado
                prodLimitados = prodLimitados.slice(0, limite);
                console.log("Productos limitados: ", prodLimitados);
            }

            console.log("Productos devueltos: ", prodLimitados);

            res.send(prodLimitados);
        }        
    );


});

app.get("/products/:pid", (req, res) => {
    let prodManager = new ProductManager("productos.json");
    let idProducto;
    
    if (req.params.pid && !isNaN(idProducto = parseInt(req.params.pid))) {
        prodManager.getProductByIdAsync(idProducto).then(
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
});

app.listen(port, () => console.log("Conectado al server en port " + port + " con Express"));

//A partir de acá este código es solo para cargar productos y asegurarme que haya 

async function cargarProductosAsync(prodManagerAsync) {
    try {
        //Agregar productos
        let prod1 = await prodManager.addProductAsync({title: "Berenjenas", description: "Sabroso vegetal alargada", price: 1000, thumbnail: "https://th.bing.com/th?id=OIP.nH0F9FpvxnWmKP0reKs98QHaHR&w=252&h=247&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "BEREN", stock: 150});
        console.log(prod1);

        let prod2 = await prodManager.addProductAsync({title: "Zapallitos", description: "Verdura recomendada por las abuelas", price: 1500, thumbnail: "https://th.bing.com/th?id=OIP.dRvFBCOqjHLpsJ6R1gGdjQHaFj&w=288&h=216&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "ZAPALL", stock: 300 });
        console.log(prod2);

        let prod3 = await prodManager.addProductAsync({title: "Bananas", description: "Fruta amarilla", price: 3000, thumbnail: "https://th.bing.com/th?id=OIP.UtpeqGM0X-sTDYUk3ZdJRwHaE8&w=305&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "BANAN", stock: 250 });
        console.log(prod3);

        let prod4 = await prodManager.addProductAsync({title: "Melones", description: "Fruta enorme y circular que es casi todo agua", price: 400, thumbnail: "https://th.bing.com/th?id=OIP.ZD-dcfECzgWSmj4qrpYyXwHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "MELON", stock: 1500 });
        console.log(prod4);

        let prod6 = await prodManagerAsync.addProductAsync({title: "Uvas", description: "Pequeñas delicias de dificil semilla escupir", price: 1000, thumbnail: "https://th.bing.com/th?id=OIP.S0MwlWV6Tgy2br4GfBaJcgHaE6&w=306&h=203&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "UVA", stock: 4000 });

        console.log(prod6); 

        let productos = await prodManagerAsync.getProductsAsync()

        console.log("Nuevos Productos asincrónicos: ", productos);

               
        
    }
    catch (error) {
        console.error("ERROR", error);
    }
}

let prodManager = new ProductManager("productos.json"); 

cargarProductosAsync(prodManager);
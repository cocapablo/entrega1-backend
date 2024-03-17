import express from "express";
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import mongoose from "mongoose";

import path from "path";
import { fileURLToPath } from 'url';

import ProductManager from "./dao/ProductManagerMongo.js";
import CarritoManager from "./dao/CarritoManagerMongo.js";
import ChatManager from "./dao/chatManagerMongo.js";
import UserManager from "./dao/UserManagerMongo.js";


import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";

import { usuarioLogueado } from "./middlewares/sessionMiddleware.js";

import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

import initializePassport from "./config/passport.config.js";
import passport from "passport";



const port = 8080;

const app = express();

//Directorios
const __filename = fileURLToPath(import.meta.url);
console.log("Filename: ", __filename);
let __dirname = path.dirname(__filename); 

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//app.use(usuarioLogueado);

const miFirmaSecreta = "pablococa";
app.use(cookieParser(miFirmaSecreta));

//Cadena de Conexion a Base de Datos
//La cadena de conexion habría que leerla de un archivo por seguridad
let cadenaConexionBD = ""; //reemplazar esto con el valor de la cadena de conexion a la BD
let cadenaConexionAtlas = "mongodb+srv://cocapablo:FKITs3H3kYgRNPSy@cluster0.u0b3vak.mongodb.net/ecommerce?retryWrites=true&w=majority";
let cadenaConexionLocal = "mongodb://127.0.0.1:27017/ecommerce";
cadenaConexionBD = cadenaConexionAtlas;
//cadenaConexionBD = cadenaConexionLocal;

//MongoStore
app.use(session({
    store: MongoStore.create({
            mongoUrl: cadenaConexionBD,
            mongoOtions: {useNewUrlParser: true, useUnifiedTopolofy: true},
            ttl: 1000
            }),
    
    secret: miFirmaSecreta,
    resave: false,
    saveUninitialized: false
    }
))

//Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));
console.log("Dirname: ", __dirname);

//Configuracion para handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

//Passport
initializePassport();

app.use(passport.initialize());
app.use(passport.session());

//Routers
app.use("/", sessionsRouter);
app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use("/", viewsRouter);

//Endpoint

app.get("/", (req, res) => res.send("<h1 style='color: blue; text-align: center' >Bienvenido al Server de Productos </h1>"));

//User Manager
export const userManager = new UserManager();


const httpServer = app.listen(port, () => console.log("Conectado al server en port " + port + " con Express"));

//WebSockets
export const socketServer = new Server(httpServer);

export const chatManager = new ChatManager(socketServer);

socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado");

    //Eventos del chat
    socket.on("newUser", (username) => {
        chatManager.nuevoUsuario(socket, username);
    
    })


    //El usuario emite un mensaje
    socket.on("chatMessage", (message) => {
        chatManager.enviarMensaje(socket, message);
    })

    socket.on("disconnect", () => {
        chatManager.desconectarUsuario(socket);
    })
    
})



//Mongoose - Base de Datos

mongoose.connect(cadenaConexionBD)
.then(() => {
    console.log("Conectado a la base de datos");
})
.catch(err => {
    console.log("ERROR al conectarme: ", err);
})

//A partir de acá este código es solo para cargar productos y asegurarme que haya 

async function cargarProductosAsync(prodManagerAsync) {
    try {
        //Agregar productos
        let prod1 = await prodManager.addProductAsync({title: "Berenjenas", description: "Sabroso vegetal alargada", price: 1000, thumbnail: "https://th.bing.com/th?id=OIP.nH0F9FpvxnWmKP0reKs98QHaHR&w=252&h=247&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "BEREN", stock: 150, category: "Frutas", status: true});
        //console.log(prod1);

        let prod2 = await prodManager.addProductAsync({title: "Zapallitos", description: "Verdura recomendada por las abuelas", price: 1500, thumbnail: "https://th.bing.com/th?id=OIP.dRvFBCOqjHLpsJ6R1gGdjQHaFj&w=288&h=216&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "ZAPALL", stock: 300, category: "Frutas", status: true});
        //console.log(prod2);

        let prod3 = await prodManager.addProductAsync({title: "Bananas", description: "Fruta amarilla", price: 3000, thumbnail: "https://th.bing.com/th?id=OIP.UtpeqGM0X-sTDYUk3ZdJRwHaE8&w=305&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "BANAN", stock: 250, category: "Frutas", status: true });
        //console.log(prod3);

        let prod4 = await prodManager.addProductAsync({title: "Melones", description: "Fruta enorme y circular que es casi todo agua", price: 400, thumbnail: "https://th.bing.com/th?id=OIP.ZD-dcfECzgWSmj4qrpYyXwHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "MELON", stock: 1500, category: "Frutas", status: true });
        //console.log(prod4);

        let prod5 = await prodManagerAsync.addProductAsync({title: "Uvas", description: "Pequeñas delicias de dificil semilla escupir", price: 1000, thumbnail: "https://th.bing.com/th?id=OIP.S0MwlWV6Tgy2br4GfBaJcgHaE6&w=306&h=203&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", code: "UVA", stock: 4000, category: "Frutas", status: true });
        //console.log(prod5); 

        let prod6 = await prodManagerAsync.addProductAsync({title: "Chorizos", description: "Delicia alargada infaltable en asados y canchas", price: 1500, thumbnail: "https://decarolis.com.ar/wp-content/uploads/2020/07/11-chorizo-saborizado.jpg", code: "CHORI", stock: 10000, category: "Achuras", status: true });



        let productos = await prodManagerAsync.getProductsAsync()

        console.log("Nuevos Productos asincrónicos: ", productos);

               
        
    }
    catch (error) {
        console.error("ERROR", error);
    }
}

export const prodManager = new ProductManager("productos.json"); //El string enviado como parmametro del constructor por ahora no tiene utilidad. En el futuro podría cumplir algún rol en la base de datos

//cargarProductosAsync(prodManager);

//Codigo para probar el carrito


async function cargarCarritosAsync(carritoManagerAsync) {
    try {
        let carritos = await carritoManagerAsync.getCarritosAsync();

        console.log("Carritos: ", carritos);

        let carrito1 = await carritoManagerAsync.addCarritoAsync();
        console.log("Carrito 1: ", carrito1);

        //Un carrito
        let carritoPrueba = await carritoManagerAsync.getCarritoByIdAsync(carrito1.id);
        console.log("Carrito Prueba: ", carritoPrueba);

        //Los productos del carrito
        let productos = await carritoManagerAsync.getProductsDeCarritoByIdAsync(carrito1.id);
        console.log("Productos del Carrito Prueba: ", productos);

        //Leo un producto del carrito
        let producto = await carritoManagerAsync.getProductDeCarritoAsync(carrito1.id , "65c8b6b3075be6d7105d12ec");
        console.log("Producto: ", producto);

    
        //Agrego un producto existente al carrito
        let carritoActualizado = await carritoManagerAsync.addProductToCarritoAsync(carrito1.id , "65c8b6b3075be6d7105d12e9", 50); //Agrego zapallitos
        console.log("Carrito Actualizado: ", carritoActualizado);
        
        
        //Agrego un producto existente al carrito
        carritoActualizado = await carritoManagerAsync.addProductToCarritoAsync(carrito1.id , "65c8b6b3075be6d7105d12ec", 50);
        console.log("Carrito Actualizado: ", carritoActualizado);
        

        /* let carrito2 = await carritoManagerAsync.addCarritoAsync();
        console.log("Carrito 2", carrito2);

         //Agrego productos a los carritos
        await carritoManagerAsync.addProductToCarritoAsync(carrito1.id, "65c8b6b3075be6d7105d12ec");

        await carritoManagerAsync.addProductToCarritoAsync(carrito2.id, "65c8b6b3075be6d7105d12ec");

        
        
        await carritoManagerAsync.addProductToCarritoAsync(1, 3);

        await carritoManagerAsync.addProductToCarritoAsync(2, 4);

        //Repito los productos
        await carritoManagerAsync.addProductToCarritoAsync(1, 3);

        await carritoManagerAsync.addProductToCarritoAsync(2, 4);

        let carritos = await carritoManagerAsync.getCarritosAsync();
        console.log("Carritos: ", carritos);

        //Agrego nuevos
        await carritoManagerAsync.addProductToCarritoAsync(1, 2);

        await carritoManagerAsync.addProductToCarritoAsync(2, 2);  */

    }
    catch (error) {
        console.error("ERROR", error);
    }
}

async function cargarCarritoConProductosAsync(carritoManagerAsync) {
    let carritoPrueba;

    try {
        let carritos = await carritoManagerAsync.getCarritosAsync();

         //Un carrito
         if (carritos.length == 0) {
            //Creo un carrito
            carritoPrueba = await carritoManagerAsync.addCarritoAsync();
        }
        else {
            //Obtengo el primer carrito de carritos
            carritoPrueba = carritos[0];
        }

        console.log("Carrito antes de los cambios", carritoPrueba);

        //Configuro los productos del carrito
        let productos = [
            {id: "65c8b6b3075be6d7105d12e6", quantity: 50},
            {id: "65c8b6b3075be6d7105d12e9", quantity: 70},
            {id: "65c8b6b3075be6d7105d12ec", quantity: 100},
            {id: "65c8b6b3075be6d7105d12ef", quantity: 450}
        ]

        //Seteo los productos del carrito
        carritoPrueba = await carritoManagerAsync.setProductsToCarritoAsync(carritoPrueba.id, productos);
        console.log("Carrito después de los cambios : ", carritoPrueba);

        //Borro todos los productos
        carritoPrueba = await carritoManagerAsync.setProductsToCarritoAsync(carritoPrueba.id);
        console.log("Carrito después del borrado total : ", carritoPrueba);
        

    }
    catch (error) {
        console.error("ERROR", error);
    }
}

async function borrarProductoDeCarritoAsync(carritoManagerAsync, idCarrito, idProducto) {
    let carritoPrueba;

    try {
        

        //Borro el Producto del carrito
        carritoPrueba = await carritoManagerAsync.deleteProductDeCarrito(idCarrito,idProducto);
        console.log("Carrito después de los cambios : ", carritoPrueba);

        
    }
    catch (error) {
        console.error("ERROR", error);
    }
}

async function setProductoDeCarritoAsync(carritoManagerAsync, idCarrito, idProducto, cantidad) {
    let carritoPrueba;

    try {
        
        //Seteo el Producto del carrito
        carritoPrueba = await carritoManagerAsync.setProductToCarritoAsync(idCarrito, idProducto, cantidad);
        console.log("Carrito después de los cambios : ", carritoPrueba);
        
    }
    catch (error) {
        console.error("ERROR", error);
    }
}

export const cartManager = new CarritoManager("carrito.json", prodManager); //El string enviado como parmametro del constructor por ahora no tiene utilidad. En el futuro podría cumplir algún rol en la base de datos

//cargarCarritosAsync(cartManager); 

//cargarCarritoConProductosAsync(cartManager);

/* prodManager.getProductsWithPaginationAsync(4, 1, {}, "DES").then
(
    resultado => {
        let resultadoJSON = JSON.stringify(resultado,null, 4);
        console.log("Resultado: ", resultadoJSON);
    }
)
.catch
(error => console.log("ERROR: ", error)); */

//borrarProductoDeCarritoAsync(cartManager, "65ccc7ce8363cc00bfd00fb7", "65c8b6b3075be6d7105d12ec");

//setProductoDeCarritoAsync(cartManager, "65ccc7ce8363cc00bfd00fb7", "65c8b6b3075be6d7105d12ef", 3000);

/* let idCarrito = "65ccc7ce8363cc00bfd00fb7";
cartManager.getCarritoWithProductsByIdAsync(idCarrito)
.then(carrito => {
    console.log("Carrito con Productos: ", carrito);
})
.catch(error => {
    console.log("ERROR: ", error);
}); */

/* let nuevoUsuario = {
    first_name : "Pablo", 
    last_name : "Coca", 
    email : "cocapablo@gmail.com", 
    age : 51, 
    password : "pacojeta", 
    role : "usuario"
}

let adminUsuario = {
    first_name : "Super", 
    last_name : "Coderhouse", 
    email : "adminCoder@coder.com", 
    age : 25, 
    password : "adminCod3r123", 
    role : "admin"
} */

/* userManager.addUserAsync(nuevoUsuario)
.then(usuario => {
    console.log("Nuevo Usuario: ", usuario);
})
.catch(error => {
    console.log("ERROR: ", error);
});

userManager.addUserAsync(adminUsuario)
.then(usuario => {
    console.log("Nuevo Usuario: ", usuario);
})
.catch(error => {
    console.log("ERROR: ", error);
}); */


/* userManager.loginAsync(adminUsuario.email, adminUsuario.password)
.then(usuario => {
    console.log("Usuario logueado: ", usuario);
})
.catch(error => {
    console.log("ERROR: ", error.toString());
}); */

import * as chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";



const expect = chai.expect;
const requester = supertest("http://localhost:8080");

//const urlMongoLocal = "mongodb://127.0.0.1:27017/clase39";

//mongoose.connect(urlMongoLocal).then(() => console.log("Conectado a la Base de Datos ")).catch(err => console.log("Error al conectarse a la Base de Datos", err));

//mongoose.connection.collections.users.deleteOne({email: "correomau@gmail.com"});

describe("Test SuperStore", () => {
    const mockUser = {
        first_name: "Ramiro",
        last_name: "de Prueba",
        email: "usuariodeprueba@superstore.com",
        age: 78,
        password: "123456"
    }
    let usuarioSesion;
    let cookieSesion;

    const mockProduct = {
        title: "Producto de Prueba",
        description: "Producto creado solo por supertest para hacer pruebas",
        price: 1000,
        thumbnail: "https://hips.hearstapps.com/es.h-cdn.co/fotoes/images/cinefilia/puedes-reconocer-estos-100-personajes-de-marvel/118706130-1-esl-ES/Puedes-reconocer-estos-100-personajes-de-Marvel.jpg",
        code: "SUPERTEST",
        stock: 138,
        category: "Pruebas",
        status: true
    }
    let productoSesion;

    const mockUserComun = {
        first_name: "Ramiro",
        last_name: "de Prueba Comun",
        email: "usuariodepruebacomun@superstore.com",
        age: 78,
        password: "123456"
    }
    let usuarioSesionComun;
    let cookieSesionComun;

    before(async function() {
        //Elimino los usuarios de Prueba de la Base de datos
        let datos = {
            email: mockUser.email
        }

        let result = await requester.delete("/api/users").send(datos);
        
        datos = {
            email: mockUserComun.email
        }

        result = await requester.delete("/api/users").send(datos);

        //console.log("Ejecuté el before");

    })  

    describe("Test de Sesiones", () => {
        
        it("El endpoint POST /api/sessions/register Debe registrar correctamente a un usuario", async function() {
            const response = await requester.post("/api/sessions/register").send(mockUser);

            const {statusCode, headers} = response;

            //console.log("Response: ", response);
            //console.log("Headers: ", headers);
            //console.log("Status Code: ", statusCode);
            
            expect(statusCode).to.equal(302); //Redirige
            expect(headers.location).to.equal("/login"); //Si el registro se realizó correctamente, redirige a login
        })

        it("El enpoint POST /api/sessions/login debe loguear correctamente al usuario y devolver una cookie de sesión", async function() {
            let datos = {
                email: mockUser.email,
                password: mockUser.password
            }

            const result = await requester.post("/api/sessions/login").send(datos);

            
            cookieSesion = result.headers["set-cookie"];

            //console.log("CookieSesion: ", cookieSesion);

            //console.log("Headers: ", result.headers);
            //console.log("Status Code: ", result.statusCode);

            expect(cookieSesion).to.be.ok; //Obtuve exitosamente la cookie de sesion
            expect(result.statusCode).to.equal(302); //Redirige
            expect(result.headers.location).to.equal("/products?limit=6"); //Si el login se realizó correctamente, redirige a products

            
        })

        it("El endpoint GET /api/sessions/current debe enviar la cookie que contiene la sesion y obtener el usuario logueado", async function() {
            const {_body} = await requester.get("/api/sessions/current").set("Cookie", cookieSesion);

            //console.log("_body", _body);

            //Dejo configurado el usario de la sesion
            usuarioSesion = _body.user;

            expect(usuarioSesion.email).to.be.equal(mockUser.email);
            
        }) 

        it("El endpoint PUT /api/users/premium/:uid debe convertir el role del ususario en premium", async function() {
            const {_body} = await requester.put("/api/users/premium/" + usuarioSesion.id).set("Cookie", cookieSesion);

            //console.log("_body", _body);

            //Dejo configurado el usario de la sesion con los nuevos datos
            usuarioSesion = _body.payload;

            expect(usuarioSesion.role).to.be.equal("premium");
            
        }) 

      
        after(async () => {
            //Hago un logout
            await requester.get("/api/sessions/logout").set("Cookie", cookieSesion);
            //console.log("Hice en logout");
        })         
    })
   
    describe("Test de productos", async function() {
        it("El endpoint POST /api/products debe crear un producto correctamente", async () => {
            const {
                statusCode,
                ok,
                _body
            } = await requester.post("/api/products").send(mockProduct).set("Cookie", cookieSesion);

            //console.log("Status Code: ", statusCode);
            //console.log("ok: ", ok);
            //console.log("_body: ", _body);

            productoSesion = _body.nuevoProducto;
            //console.log("Producto Sesion: ", productoSesion);

            expect(productoSesion).to.have.property("id");
        })

        it("El endpoint PUT /api/products/:pid debe modificar un producto correctamente", async () => {
            const prodModificado = {
                price: 5555
            }

            const {
                statusCode,
                ok,
                _body
            } = await requester.put("/api/products/" + productoSesion.id).send(prodModificado).set("Cookie", cookieSesion);

            //console.log("Status Code: ", statusCode);
            //console.log("ok: ", ok);
            //console.log("_body: ", _body);

            productoSesion = _body.nuevoProducto;
            //console.log("Producto Sesion: ", productoSesion);

            expect(productoSesion.price).to.be.equal(prodModificado.price);
        })

        it("El endpoint GET /api/products/:pid debe obtener un producto correctamente", async () => {
            const {
                statusCode,
                ok,
                _body
            } = await requester.get("/api/products/" + productoSesion.id).set("Cookie", cookieSesion);

            //console.log("Status Code: ", statusCode);
            //console.log("ok: ", ok);
            //console.log("_body: ", _body);

            expect(productoSesion.id).to.be.equal(_body.id);
        })


        before(async function() {
            //Hago un login y obtengo la cookie de la sesion
            let datos = {
                email: mockUser.email,
                password: mockUser.password
            }

            const result = await requester.post("/api/sessions/login").send(datos);
           
            
            cookieSesion = result.headers["set-cookie"];

            //console.log("CookieSesion en before: ", cookieSesion);

            //Obtengo el usuario de la sesion
            const {_body} = await requester.get("/api/sessions/current").set("Cookie", cookieSesion);
            
            //console.log("_body en before: ", _body);

            //Dejo configurado el usario de la sesion
            usuarioSesion = _body.user;

            

        }).timeout(20000);

        

    })

    
    describe("Test de carrito", async function() {
        
        before(async function() {
            //Paso 1 : Registro un usuario con role usuario
            let response = await requester.post("/api/sessions/register").send(mockUserComun);

            const {statusCode, headers} = response;

            //console.log("Response: ", response);
            //console.log("Headers: ", headers);
            //console.log("Status Code: ", statusCode);
            
            expect(statusCode).to.equal(302); //Redirige
            expect(headers.location).to.equal("/login"); //Si el registro se realizó correctamente, redirige a login

            //Paso 2: Hago un login del Usuario común
            let datos = {
                email: mockUserComun.email,
                password: mockUserComun.password
            }

            let result = await requester.post("/api/sessions/login").send(datos);

            
            cookieSesionComun = result.headers["set-cookie"];

            //console.log("CookieSesionComun: ", cookieSesionComun);

            //console.log("Headers: ", result.headers);
            //console.log("Status Code: ", result.statusCode);

            expect(cookieSesionComun).to.be.ok; //Obtuve exitosamente la cookie de sesion
            expect(result.statusCode).to.equal(302); //Redirige
            expect(result.headers.location).to.equal("/products?limit=6"); //Si el login se realizó correctamente, redirige a products

            //Paso 3: Obtengo los datos del usuario común
            const {_body} = await requester.get("/api/sessions/current").set("Cookie", cookieSesionComun);

            //console.log("_body común", _body);

            //Dejo configurado el usario de la sesion
            usuarioSesionComun = _body.user;

            expect(usuarioSesionComun.email).to.be.equal(mockUserComun.email);

        })

        
        it("En el endpoint POST /api/carts/:cid/products/:pid se debe poder agregar un producto a un carrito correctamente", async function() {
            let idCarrito;
            let idProducto;

            //Obtengo el idCarrito del usuarioSesion
            idCarrito = usuarioSesionComun.cart;

            //Obtengo el idProducto de productoSesion
            //console.log("Producto Sesion: ", productoSesion);

            idProducto = productoSesion.id;

            const {
                statusCode,
                ok,
                _body
            } = await requester.post(`/api/carts/${idCarrito}/products/${idProducto}`).set("Cookie", cookieSesionComun);

            //console.log("Body: ", _body);

            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal("accepted"); 
        }) 

        it("En el endpoint PUT /api/carts/:cid/products/:pid se debe poder actualizar la cantidad de un producto en un carrito correctamente", async function() {
            let idCarrito;
            let idProducto;

            //Obtengo el idCarrito del usuarioSesion
            idCarrito = usuarioSesionComun.cart;

            //Obtengo el idProducto de productoSesion
            //console.log("Producto Sesion: ", productoSesion);

            idProducto = productoSesion.id;

            let datos = {
                quantity: 6666
            }

            const {
                statusCode,
                ok,
                _body
            } = await requester.put(`/api/carts/${idCarrito}/products/${idProducto}`).send(datos).set("Cookie", cookieSesionComun);

            //console.log("Body: ", _body);

            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal("accepted"); 
        
        })

        it("En el endpoint DELETE /api/carts/:cid/products/:pid se debe poder eliminar un producto de un carrito correctamente", async function() {
            let idCarrito;
            let idProducto;

            //Obtengo el idCarrito del usuarioSesion
            idCarrito = usuarioSesionComun.cart;

            //Obtengo el idProducto de productoSesion
            //console.log("Producto Sesion: ", productoSesion);

            idProducto = productoSesion.id;

            
            const {
                statusCode,
                ok,
                _body
            } = await requester.delete(`/api/carts/${idCarrito}/products/${idProducto}`).set("Cookie", cookieSesionComun);

            //console.log("Body: ", _body);

            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal("accepted"); 
        
        })
        
    })  

    after(async function() {
        //Elimino el producto de prueba
        let idProducto;

        idProducto = productoSesion.id;

        await requester.delete("/api/products/" + idProducto).set("Cookie", cookieSesion);

        //Deslogueo los usuarios
        await requester.get("/api/sessions/logout").set("Cookie", cookieSesion);
        await requester.get("/api/sessions/logout").set("Cookie", cookieSesionComun);

    })
})
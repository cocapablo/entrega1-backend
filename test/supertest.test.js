import * as chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";



const expect = chai.expect;
const requester = supertest("http://localhost:8080");

const urlMongoLocal = "mongodb://127.0.0.1:27017/clase39";

mongoose.connect(urlMongoLocal).then(() => console.log("Conectado a la Base de Datos ")).catch(err => console.log("Error al conectarse a la Base de Datos", err));

//mongoose.connection.collections.users.deleteOne({email: "correomau@gmail.com"});

describe("Test SuperStore", () => {
    /* before(async function() {
        //await mongoose.connect(urlMongoLocal);
        console.log("mongoose.connection.collections", mongoose.connection.collections);
        //await mongoose.connection.collections.pets.deleteOne({$or: [{name: "Patitas"}, {name: "Piecitos"}]}); //Borro solo los usuarios de prueba que les pongo ese email
        //await mongoose.connection.collections.users.deleteOne({email: "correomau@gmail.com"});
        this.timeout(5000);
    })  */

    /* describe("Test de mascotas", async function() {
        it("El endpoint POST /api/pets debe crear una mascota correctamente", async () => {
            const petMock = {
                name: "Patitas",
                specie: "Pez",
                birthDate: "10-10-2022"
            }

            const {
                statusCode,
                ok,
                _body
            } = await requester.post("/api/pets").send(petMock);

            console.log("Status Code: ", statusCode);
            console.log("ok: ", ok);
            console.log("_body: ", _body);

            expect(_body.payload).to.have.property("_id");
        })

        it("El endpoint POST /api/pets debe devolver un status 400 si no se envía un campo name", async () => {
            const petMock = {
                specie: "Pez",
                birthDate: "10-10-2022"
            }

            const {
                statusCode,
                ok,
                _body
            } = await requester.post("/api/pets").send(petMock);

            console.log("Status Code: ", statusCode);
            console.log("ok: ", ok);
            console.log("_body: ", _body);

            //expect(_body.payload).to.have.property("_id");
            expect(statusCode).is.equal(400);
            expect(_body).to.have.property("error");
        })

        it("El endpoint PUT /api/pets/pid debe poder actualizar correctamente una mascota determinada", async () => {
            //Paso 1: creo una nueva mascota
            const petMock = {
                name: "Patitas",
                specie: "Pez",
                birthDate: "10-10-2022"
            }

            const {
                statusCode : statusCodePost,
                ok : okPost,
                _body : _bodyPost
            } = await requester.post("/api/pets").send(petMock);

            console.log("Status Code Post: ", statusCodePost);
            console.log("ok Post: ", okPost);
            console.log("_body Post: ", _bodyPost);

            expect(_bodyPost.payload).to.have.property("_id");

            //Parte 2: Creo un objeto con el name distinto
            const nuevaPet = {
                name: "Piecitos", //Nombre modificado
            }

            let idPez = _bodyPost.payload._id.toString();
            let nameOriginal = _bodyPost.payload.name;

            console.log("Name Original: ", nameOriginal);

            const {
                statusCode: statusCodePut,
                ok: okPut,
                _body: _bodyPut
            } = await requester.put("/api/pets/" + idPez).send(nuevaPet);

            console.log("Status Code Put: ", statusCodePut);
            console.log("ok Put: ", okPut);
            console.log("_body Put: ", _bodyPut);

            
            expect(_bodyPut.status).equal("success");

            //Chequeo que el name original sea distinto que el nuevo
            //Obtengo la pet en el estado actauul
            const {
                statusCode: statusCodeGet,
                ok : okGet,
                _body : _bodyGet

            } = await requester.get("/api/pets/").send();

            let pets = [..._bodyGet.payload];

            let petActualizada = pets.find((pet) => pet._id.toString() === idPez);

            console.log("Name original: " + nameOriginal);
            console.log("nameNuevo: ", petActualizada.name);

            expect(nameOriginal).not.equal(petActualizada.name);

        })

        
    }) */

    
    
    describe("Test de Sesiones", () => {
        let cookie;

        it("El endpoint POST /api/sessions/register Debe registrar correctamente a un usuario", async function() {
            const mockUser = {
                first_name: "Mauricio",
                last_name: "Espinosa",
                email: "correomau@gmail.com",
                password: "123456"
            }

            const {statusCode, _body} = await requester.post("/api/sessions/register").send(mockUser);

            expect(statusCode).to.equal(200);
            expect(_body.payload).to.be.ok;
        })

        it("El enpoint POST /api/sessions/login debe loguear correctamente al usuario y devolver un cookie", async function() {
            const mockUser = {
                email: "correomau@gmail.com",
                password: "123456"
            }

            const result = await requester.post("/api/sessions/login").send(mockUser);

            const cookieResult = result.headers["set-cookie"][0];

            expect(cookieResult).to.be.ok;

            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }

            expect(cookie.name).to.be.ok.and.equal("coderCookie");
            expect(cookie.name).to.be.ok;
        })

        it("El endpoint GET /api/sessions/current debe enviar la cookie que contiene el usuario y desesctructurarlo correctamente", async function() {
            const {_body} = await requester.get("/api/sessions/current").set("Cookie", [`${cookie.name}=${cookie.value}`]);

            expect(_body.payload.email).to.be.eql("correomau@gmail.com");
        })

        /* beforeEach(async function() {
            //mongoose.connection.collections.users.drop(); //Borra la collectionde users antes de cada prueba
            mongoose.connection.collections.users.deleteOne({email: "correomau@gmail.com"}); //Borro solo los usuarios de prueba que les pongo ese email
            this.timeout(5000);
        }) */
    })
})
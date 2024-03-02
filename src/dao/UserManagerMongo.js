import mongoose from "mongoose";
import userModel from "./models/usersModel.js";

class UserManager {
    #users;

    constructor() {
        this.#users = [];
    }

    async addUserAsync({first_name = "", last_name = "", email = "", age = -1, password = "", role = "usuario"}) {
        let newUser;

        try {
            //Validaciones
            if (first_name.trim().length === 0) {
                throw new Error("ERROR: first_name vacío");
            }

            if (last_name.trim().length === 0) {
                throw new Error("ERROR: last_name vacío");
            }

            if (email.trim().length === 0) {
                throw new Error("ERROR: email vacío");
            }

            if (age < 0) {
                throw new Error("ERROR: age debe ser mayor o igual que cero");    
            }

            if (password.trim().length === 0) {
                throw new Error("ERROR: password vacío");
            }

            if (role.trim().length === 0) {
                throw new Error("ERROR: role vacío");
            }

            //Agrego el usuario a la Base de Datos
            newUser = {
                first_name,
                last_name,
                email,
                age,
                password,
                role 
            }

            let resultado = await userModel.create(newUser);

            //Agrego el nuevo id a newUser
            newUser = {
                id: resultado._id.toString(),
                ...newUser
            }

            this.#users.push(newUser);

        }
        catch (error) {
            throw (error);
        }

        return newUser;


    }

    async loginAsync(email = "", password = "") {
        let usuario;

        try {
            //Validaciones
            if (email.trim().length === 0) {
                throw new Error("ERROR: email vacío");
            }

            if (password.trim().length === 0) {
                throw new Error("ERROR: email vacío");
            }

            //Busco el usuario en la Base de Datos
            let resultado = await userModel.findOne({email : email, password : password});

            console.log("Resultado login: ", resultado);

            if (!resultado) {
                throw new Error ("Usuario o contraseña inválidos");
            }

            //Creo usuario
            usuario = {
                id: resultado._id.toString(),
                first_name : resultado.first_name,
                last_name: resultado.last_name,
                email : resultado.email,
                age : resultado.age,
                password : resultado.password,
                role : resultado.role
            }
            
        }
        catch (error) {
            throw (error);
        }

        return usuario;
    }
}

export default UserManager;


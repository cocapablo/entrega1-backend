import mongoose from "mongoose";
import userModel from "./models/usersModel.js";
import bcrypt from "bcrypt";

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

            //Me fijo si el usuario ya existía en la Base de Datos
            let viejoUsuario = null;
            try {
                viejoUsuario = await this.getUserAsync(email); 
            }
            catch (error) {
                //Si el Usuario no existía lanza el error así que lo capturo y sigo
                console.log("Estamos bien. el Usuario no existía en la Base de Datos")
            }

            if (viejoUsuario) {
                //El Usuario ya existía en la Base De datos
                throw new Error("El Usuario de mail " + email + " ya existe en la Base de Datos");
            }

            

            //Agrego el usuario a la Base de Datos
            let passwordEncriptada = this.#createHash(password);

            console.log("Password encriptada: ", passwordEncriptada);

            newUser = {
                first_name,
                last_name,
                email,
                age,
                password : passwordEncriptada,
                role 
            }


            let resultado = await userModel.create(newUser);

            //Agrego el nuevo id a newUser
            newUser = {
                id: resultado._id.toString(),
                ...newUser
            }

            //Borro el password de newUser por ser un dato sensible
            delete newUser.password;
            console.log("New User sin password: ", newUser);

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
                throw new Error("ERROR: Password vacío");
            }

            //Busco el usuario en la Base de Datos
            let resultado = await userModel.findOne({email: email});
            if (!resultado) {
                //El Usuario no existe en la Base de Datos
                let oError = {status: 400,
                    error: "Usuario inexistente"};
                let cadenaError = JSON.stringify(oError);

                throw new Error (cadenaError);

            }

            //Me fijo la contraseña
            let esPasswordValido;

            esPasswordValido = this.#isValidPassword(password, resultado.password);
            
            if (esPasswordValido === false) {
                //Contraseña inválida
                let oError = {status: 403,
                error: "Contraseña inválida"};
                let cadenaError = JSON.stringify(oError);

                throw new Error (cadenaError);
            }

            //Creo usuario
            usuario = {
                id: resultado._id.toString(),
                first_name : resultado.first_name,
                last_name: resultado.last_name,
                email : resultado.email,
                age : resultado.age,
                role : resultado.role
                //Omito el password por ser un dato sensible
            }
            
        }
        catch (error) {
            throw (error);
        }

        return usuario;
    }

    async changePasswordAsync(email = "", nuevoPassword = "") {
        let usuario;

        try {
            //Validaciones
            if (email.trim().length === 0) {
                throw new Error("ERROR: email vacío");
            }

            if (nuevoPassword.trim().length === 0) {
                throw new Error("ERROR: Password vacío");
            }

            //Busco el usuario en la Base de Datos
            let resultado = await userModel.findOne({email: email});
            if (!resultado) {
                //El Usuario no existe en la Base de Datos
                let oError = {status: 400,
                    error: "Usuario inexistente"};
                let cadenaError = JSON.stringify(oError);

                throw new Error (cadenaError);

            }

            //Creo usuario
            usuario = {
                id: resultado._id.toString(),
                first_name : resultado.first_name,
                last_name: resultado.last_name,
                email : resultado.email,
                age : resultado.age,
                role : resultado.role
                //Omito el password por ser un dato sensible
            }

            //Cambio la contraseña del Usuario
            let passwordEncriptada = this.#createHash(nuevoPassword);

            resultado = await userModel.updateOne({email: email}, {$set: {password: passwordEncriptada}});
                     
        }
        catch (error) {
            throw (error);
        }

        return usuario;    
    }

    #createHash(password) {
        let passwordEncriptada;
    
        passwordEncriptada = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    
        console.log("Password Encriptado: ", passwordEncriptada);
    
        return passwordEncriptada
    }

    #isValidPassword(password, passwordEncriptada) {
        let isValid;
    
        isValid = bcrypt.compareSync(password, passwordEncriptada);
    
        return isValid;
    }

    async getUserAsync(email) {
        let usuario;

        try {
            //Validaciones
            if (email.trim().length === 0) {
                throw new Error("ERROR: email vacío");
            }

            //Busco el usuario en la Base de Datos
            let resultado = await userModel.findOne({email: email});
            if (!resultado) {
                //El Usuario no existe en la Base de Datos
                let oError = {status: 400,
                    error: "Usuario inexistente"};
                let cadenaError = JSON.stringify(oError);

                throw new Error (cadenaError);

            }

            //Creo usuario
            usuario = {
                id: resultado._id.toString(),
                first_name : resultado.first_name,
                last_name: resultado.last_name,
                email : resultado.email,
                age : resultado.age,
                role : resultado.role
                //Omito el password por ser un dato sensible
            }
            
        }
        catch (error) {
            throw (error);
        }

        return usuario;    
    }

    async getUserByIdAsync(idUsuario) {
        let usuario;

        try {
            //Busco el usuario en la Base de Datos
            let resultado = await userModel.findById(idUsuario);
            if (!resultado) {
                //El Usuario no existe en la Base de Datos
                let oError = {status: 400,
                    error: "Usuario inexistente"};
                let cadenaError = JSON.stringify(oError);

                throw new Error (cadenaError);

            }

            //Creo usuario
            usuario = {
                id: resultado._id.toString(),
                first_name : resultado.first_name,
                last_name: resultado.last_name,
                email : resultado.email,
                age : resultado.age,
                role : resultado.role
                //Omito el password por ser un dato sensible
            }
            
        }
        catch (error) {
            throw (error);
        }

        return usuario;    
    }
}

export default UserManager;


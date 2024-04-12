import UserManager from "../dao/mongo/UserManagerMongo.js"; 
import { CartController } from "./carts.controller.js";

import passport from "passport";

export class UserController {
    #userService;
    #cartController;   
    

    constructor(cartController) {
        this.#userService = new UserManager(cartController.getService());
        this.#cartController = cartController;
        this.changeUserPassword = this.changeUserPassword.bind(this);
        this.userCreatedSuccessfully = this.userCreatedSuccessfully.bind(this);
        this.userCreationFailure = this.userCreationFailure.bind(this);
        this.userLoggedSuccesfully = this.userLoggedSuccesfully.bind(this);
        this.userGitHubSuccesfully = this.userGitHubSuccesfully.bind(this);
        this.userGitHubFailure = this.userGitHubFailure.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
    }

    getService() {
        return this.#userService;
    }

    async changeUserPassword(req, res) {
    
        try {
            const {email, password} = req.body;
    
            let nuevoUsuario = await this.#userService.changePasswordAsync(email, password);
    
            if (nuevoUsuario) {
                //Redirecciono al login
                res.redirect("/login");
            }
            else {
                res.redirect("/changePassword?error=true&mensajeError='ERROR al cambiar la contraseña'");
            }
    
            
        }
        catch (error) {
            //Me fijo que tipo de error me devolvieron
            let oError;
            let mensajeError = "ERROR";
    
            try {
                oError = JSON.parse(error.message);
    
                console.log("Error Status", oError.status);
                console.log("Error error: ", oError.error);
    
                mensajeError = oError.error;
    
                res.status(oError.status).redirect("/changePassword?error=true&mensajeError=" + mensajeError);
            }
            catch (e) {
                //No es un JSON
                mensajeError = error.message;
                res.redirect("/changePassword?error=true&mensajeError=" + mensajeError);
            }
    
            
        }
    }

    async userCreatedSuccessfully(req, res) {
        //Registro exitoso: Redirijo a login
        res.redirect("/login");  
        
    } 
    
    async userCreationFailure(req, res) {
        let mensajeError = "Error de Registro";

        req.session.error && (mensajeError = req.session.error);
        res.redirect("/register?error=true&mensajeError=" + mensajeError);
    }

    async userLoggedSuccesfully(req, res) {
        if (req.user) {
            //Agrego los datos del usuario desde req.user
            let nuevoUsuario = req.user;
            console.log("Nuevo usuario: ", nuevoUsuario);
    
            req.session.user = {
                id: nuevoUsuario.id,
                first_name: nuevoUsuario.first_name,
                last_name: nuevoUsuario.last_name,
                email: nuevoUsuario.email,
                age: nuevoUsuario.age,
                role: nuevoUsuario.role,
                cart: nuevoUsuario.cart
            } 
            res.redirect("/products?limit=6");
        }
        else {
            let mensajeError = "Usuario o contraseña incorrectos";
    
            req.session.error && (mensajeError = req.session.error);
            res.redirect("/login?error=true&mensajeError=" + mensajeError);
        }
     
    }

    async userLoginFailure(req, res) {
        let mensajeError = "Usuario o contraseña incorrectos";

        req.session.error && (mensajeError = req.session.error);
        res.redirect("/login?error=true&mensajeError=" + mensajeError); 
    }

    async logoutUser(req, res) {
        req.session.destroy(err => {
            if (!err) {
                //Redirecciono a login
                //res.send("Sesión finalizada")
                res.redirect("/login");
            }
            else {
                res.send("Error: no se pudo finalizar la sesión: ", err.toString());
            }
        })    
    }

    async userGitHubSuccesfully(req, res) {
        req.session.user = req.user;
        res.redirect("/products?limit=6");
    }

    async userGitHubFailure(req, res) {
        let mensajeError = "Error al Loguearse en GitHub";

        req.session.error && (mensajeError = req.session.error);
        res.redirect("/login?error=true&mensajeError=" + mensajeError);
    }

    async getCurrentUser(req, res) {
        let usuario = null;

        //Obtengo el usuario de la session actual
        req.session && req.session.user && (usuario = req.session.user);

        if (!usuario) {
            usuario = "No hay ningún usuario logueado en esta sesión";
        }

        console.log("Usuario en la Session: ", usuario);

        res.send({user: usuario});
    }
}
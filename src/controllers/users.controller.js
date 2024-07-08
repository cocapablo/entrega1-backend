//import UserManager from "../dao/mongo/UserManagerMongo.js"; 
import { userService } from "../repositories/index.js";
import { CartController } from "./carts.controller.js";

import UserDTO from "../dao/DTOs/user.dto.js";
import { MiniUserDTO } from "../dao/DTOs/user.dto.js";

import passport from "passport";
import logger from "../services/logs/logger.js";

import { generateToken, validateToken } from "../services/jwt/jwtUtils.js";
import MailingService from "../services/mailing/mailing.js";
import config from "../config/config.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

import url from "url";

export class UserController {
    #userService;
    #cartController;   
    

    constructor(cartController) {
        //this.#userService = new UserManager(cartController.getService());
        this.#userService = userService;
        this.#cartController = cartController;
        this.changeUserPassword = this.changeUserPassword.bind(this);
        this.userCreatedSuccessfully = this.userCreatedSuccessfully.bind(this);
        this.userCreationFailure = this.userCreationFailure.bind(this);
        this.userLoggedSuccesfully = this.userLoggedSuccesfully.bind(this);
        this.userGitHubSuccesfully = this.userGitHubSuccesfully.bind(this);
        this.userGitHubFailure = this.userGitHubFailure.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.resetUserPassword = this.resetUserPassword.bind(this);
        this.resetUserPasswordToken = this.resetUserPasswordToken.bind(this);
        this.intercambiarPremiumYUsuario = this.intercambiarPremiumYUsuario.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.deleteUserByEmail = this.deleteUserByEmail.bind(this);
        this.addDocumentsToUser = this.addDocumentsToUser.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
        this.getUsersMini = this.getUsersMini.bind(this);
        this.deleteInactiveUsers = this.deleteInactiveUsers.bind(this);
        this.getInactiveUsers = this.getInactiveUsers.bind(this);
        
    }

    getService() {
        return this.#userService;
    }

    async changeUserPassword(req, res) {
        let token = null;
        let decodedToken = null;
        let email;

        //Obtengo los datos del usuario del token
        req.cookies && req.cookies[config.jwtCookie] && (token = req.cookies[config.jwtCookie]);
        if (!token) {
            let mensajeError = "No se proporcionaron correctamente los datos del usuario. Debe realizar el proceso nuevamente"; 
            return res.redirect("/login?error=true&mensajeError=" + mensajeError); 
        }

        try {
            decodedToken = validateToken(token);
        
            if (!decodedToken) {
                let mensajeError = "Error al recuperar contraseña. Debe realizar el proceso nuevamente"; 
                return res.redirect("/login?error=true&mensajeError=" + mensajeError); 
            }
        }
        catch (error) {
            logger.error("Error en User: " + error.toString());
            let mensajeError = "El tiempo de recuperación de contraseña ha expirado. Debe realizar el proceso nuevamente"; 
            return res.redirect("/login?error=true&mensajeError=" + mensajeError);     
        }

        //Obtengo el email del usuario
        
        decodedToken.email && (email = decodedToken.email);
        if (!email) {
            let mensajeError = "No se proporcionaron correctamente los datos del usuario. Debe realizar el proceso nuevamente"; 
            return res.redirect("/login?error=true&mensajeError=" + mensajeError); 
        }

        try {
            const {password} = req.body;
    
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
    
                //console.log("Error Status", oError.status);
                //console.log("Error error: ", oError.error);
    
                mensajeError = oError.error;

                logger.error(mensajeError);
    
                res.status(oError.status).redirect("/changePassword?error=true&mensajeError=" + mensajeError);
            }
            catch (e) {
                //No es un JSON
                mensajeError = error.message;
                logger.error(mensajeError);
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
            //console.log("Nuevo usuario: ", nuevoUsuario);
            //logger.debug("Nuevo usuario: " + JSON.parse(nuevoUsuario, null, 2));
            
            let documentos = [];

            nuevoUsuario.documents && (documentos = nuevoUsuario.documents);

            let ultimaConexion = new Date();

            req.session.user = {
                id: nuevoUsuario.id,
                first_name: nuevoUsuario.first_name,
                last_name: nuevoUsuario.last_name,
                email: nuevoUsuario.email,
                age: nuevoUsuario.age,
                role: nuevoUsuario.role,
                cart: nuevoUsuario.cart,
                documents: documentos,
                last_connection: ultimaConexion
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
        let bTodoOk;
        let usuario = null;
        let idUsuario;

        req.session && req.session.user && (usuario = req.session.user);

        if (!usuario) {
            usuario = "No hay ningún usuario logueado en esta sesión";
            return res.send({user: usuario});
        }

        idUsuario = usuario.id;

        try {
            bTodoOk = await this.#userService.logOutAsync(idUsuario);
        }
        catch (err) {
            res.send("Error: no se pudo finalizar la sesión: " + err.toString());
        }


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
        let usuarioDTO = null;

        //Obtengo el usuario de la session actual
        req.session && req.session.user && (usuario = req.session.user);

        if (!usuario) {
            usuario = "No hay ningún usuario logueado en esta sesión";
            return res.status(401).send({user: usuario});
        }

        //console.log("Usuario en la Session: ", usuario);
        logger.debug("Usuario en la Session: " + JSON.stringify(usuario, null, 2));

        usuarioDTO = new UserDTO(usuario);

        //console.log("UsuarioDTO: ", usuarioDTO);
        logger.debug("UsuarioDTO: " + JSON.stringify(usuarioDTO, null, 2));

        res.send({user: usuarioDTO});
    }

    //Recupero de contraseña
    async resetUserPassword(req, res) {
        let email = null;
        let usuario = null;
        let urlBase = "";
        let protocolo = "";



        //Paso 1: cheque que me hayan enviado un email
        req.body && req.body && req.body.email && (email = req.body.email);

        if (!email) {
            let mensajeError = "Debe ingresar un email";

            return res.redirect("/login?error=true&mensajeError=" + mensajeError); 
        }
    
        
        try {
            //Paso 2: Obtengo el usuario por su email
            usuario = await this.#userService.getUserAsync(email);

            //Paso 3: Genero el token con los datos del usuario
            const token = generateToken(usuario);

            logger.debug("Token generado: " + token);

            //Generar el mail de recuperacion
            //Obtengo la urlBase
            urlBase = req.get('host');
            console.log("URLBase", urlBase);
            protocolo = req.protocol;
            console.log("Protocolo: ", protocolo);

            const correoOptions = {
                from : "SuperStore",
                to: usuario.email,
                subject: "Recuperación de Contraseña",
                html: `<head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <link href="//cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
                            <title>Productos Pablo Coca</title>
                        </head>
                        <body>
                            <h1 style="text-align: center;"> SuperStore - Recuperar Contraseña </h1>
                            <p> Haga click en el siguiente enlace para recuperar la contraseña: </p>
                            <button class="w-15 btn btn-success">
                            <a href="${protocolo}://${urlBase}/api/sessions/reset-password/${token}" 
                            Recuperar Contraseña 
                            </a>
                            Recuperar Contraseña 
                            </button>

                            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
                        </body>
                        `
                }

            console.log("Correo Option html:" , correoOptions.html);

            const mailer = new MailingService();    
        
            await mailer.sendSimpleMail(correoOptions);
        
        }
        catch (error) {
            //Me fijo que tipo de error me devolvieron
            let oError;
            let mensajeError = "ERROR";
    
            try {
                oError = JSON.parse(error.message);
    
                mensajeError = oError.error;

                logger.error(mensajeError);
    
                res.status(oError.status).redirect("/login?error=true&mensajeError=" + mensajeError);
            }
            catch (e) {
                //No es un JSON
                mensajeError = error.message;
                logger.error(mensajeError);
                res.redirect("/login?error=true&mensajeError=" + mensajeError);
            }
    
            
        }
    
        res.status(200).send({ status: "success", payload: "Mail de recuperar Contraseña enviado" });
    
    }
  
    async resetUserPasswordToken(req, res) {
        const token = req.params.token;
        let decodedToken = null;
        
        try {
            decodedToken = validateToken(token);
        
            if (!decodedToken) {
                let mensajeError = "Error al recuperar contraseña. Debe realizar el proceso nuevamente"; 
                return res.redirect("/login?error=true&mensajeError=" + mensajeError); 
            }
        }
        catch (error) {
            logger.error("Error en resetUserPasswordToken: " + error.toString());
            let mensajeError = "El tiempo de recuperación de contraseña ha expirado. Debe realizar el proceso nuevamente"; 
            return res.redirect("/login?error=true&mensajeError=" + mensajeError);     
        }
    
    
        //Token valido: redirigir a un lugar donde resetear la contraseña
        //console.log("decodedtoken: ", decodedToken);


        //Redirecciono a pagina de cambio de contraseña
        
        res.cookie(config.jwtCookie, token, {maxAge: 60 * 60 * 1000, httpOnly: true}).redirect("/changePassword");
        
    }
  
    async intercambiarPremiumYUsuario(req, res, next) {
        let nuevoUsuario;
        let idUsuario;

        //Obtengo el idUsuario
        req.params && req.params.uid && (idUsuario = req.params.uid)

        if (!idUsuario) {
            let mensaje = "No se especificó un idUsuario";
            return res.status(401).send({status: "error", error: mensaje});
        }

        //Cambio el role del usuario
        try {
            nuevoUsuario = await this.#userService.intercambiarPremiumYUsuario(idUsuario);
        }
        catch (error) {
            return res.status(401).send({status: "error", message: error.toString()});  
        }

               
        res.send(
            {
                status: "success",
                message: "El role del usuario fué modificado con éxito",
                payload: nuevoUsuario
            }
        )

    }

    async deleteUser(req, res, next) {
        let idUsuario = null;
        let resultado;

        //Obtengo el idUsuario
        req.params && req.params.uid && (idUsuario = req.params.uid)

        if (!idUsuario) {
            CustomError.createError({
                name: "Error eliminando un Usuario",
                cause: "idUsuario inválido",
                message: "ERROR: idUsuario inválido",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }

        //Elimino el Usuario
        try {
            resultado = await this.#userService.deleteUserAsync(idUsuario);
        }
        catch (error) {
            //Devuelve un Custom Error, así que llamo al Middleware de Errores con error
            return next(error);
        }

        //El Usuario se eliminó con éxito       
        res.send(
            {
                status: "success",
                message: "El usuario fué eliminado con éxito",
            }
        )

    }

    async deleteUserByEmail(req, res, next) {
        let emailUsuario = null;
        let resultado;

        //Obtengo el email del Usuario
        req.body && req.body.email && (emailUsuario = req.body.email);

        if (!emailUsuario) {
            CustomError.createError({
                name: "Error eliminando un Usuario",
                cause: "email del usuario inválido",
                message: "ERROR: email del usuario inválido",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }

        //Elimino el Usuario
        try {
            resultado = await this.#userService.deleteUserByEmailAsync(emailUsuario);
        }
        catch (error) {
            //Devuelve un Custom Error, así que llamo al Middleware de Errores con error
            return next(error);
        }

        //El Usuario se eliminó con éxito       
        res.send(
            {
                status: "success",
                message: "El usuario fué eliminado con éxito",
            }
        )

    }

    async addDocumentsToUser(req, res, next) {
        let archivos;
        let archivo = null;
        let idUsuario;
        let URLarchivo;
        let pathArchivo;
        let nombreArchivo;
        let nuevoUsuario;
        let documentos = [];
        let documento;

        //Obtengo el idUsuario
        req.params && req.params.uid && (idUsuario = req.params.uid);

        if (!idUsuario) {
            CustomError.createError({
                name: "Error configurando los documentos de un Usuario",
                cause: "No se pasó un idUsuario como parámetro",
                message: "ERROR: No se pasó un idUsuario como parámetro",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }

        req.files && req.files && (archivos = req.files);

        if (!archivos) {
            CustomError.createError({
                name: "Error configurando los documentos de un Usuario",
                cause: "No hay documentos para configurar",
                message: "ERROR: No hay documentos para configurar",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }


        //Actualizo los documentos
        try {
            //Recorro los archivos
            for (let tipoArchivo in archivos) {
                archivo = archivos[tipoArchivo][0];
                
                //Obtengo el path del archivo (ver si esto lo convierto a una URL o no o como)
                nombreArchivo = archivo.filename;
                pathArchivo = archivo.path;

                if (tipoArchivo === "profile") {
                    URLarchivo = "/profiles/" + nombreArchivo;
                }
                else {
                    URLarchivo = "/documents/" + nombreArchivo;    
                }

                //console.log("nombreArchivo", nombreArchivo);
                //console.log("pathArchivo", pathArchivo);
                //console.log("URLarchivo", URLarchivo);

                //Creo el documento y lo agrego a la lista de documentos
                documento = {
                    name: tipoArchivo,
                    reference: URLarchivo
                }

                documentos.push(documento);
            }

            //Agrego los documentos al usuario
            nuevoUsuario = await this.#userService.addDocumentosDeUsuarioAsync(idUsuario, documentos);

            //Actualizo los datos del usuario en la sesion
            let documentosNuevos = [];

            nuevoUsuario.documents && (documentosNuevos = nuevoUsuario.documents);

            let ultimaConexion = new Date();  //de paso actualizo la ultima conexion

            req.session.user = {
                id: nuevoUsuario.id,
                first_name: nuevoUsuario.first_name,
                last_name: nuevoUsuario.last_name,
                email: nuevoUsuario.email,
                age: nuevoUsuario.age,
                role: nuevoUsuario.role,
                cart: nuevoUsuario.cart,
                documents: documentosNuevos,
                last_connection: ultimaConexion
            } 
        }
        catch (error) {
            //Devuelve un Custom Error, así que llamo al Middleware de Errores con error
            return next(error);    
        }

        //El Usuario se actualizó con éxito       
        res.send(
            {
                status: "success",
                payload: nuevoUsuario
            }
        )

    }

    async getUsersMini(req, res, next) {
        let usuarios = [];
        let usuarioDTO;

        //Obtengo la urlBase
        //let urlBase = req.get('host');
        //console.log("URL Base: ", urlBase);
        
        try {
            //Obtengo los Usuarios
            let usuariosDAO = await this.#userService.getUsuariosAsync();

            //Obtengo la versión mini de cada usuario
            usuariosDAO.forEach(usuario => {
                let miniUser = new MiniUserDTO(usuario);

                usuarios.push(miniUser);
            })
            
        }
        catch (error) {
            //Devuelve un Custom Error, así que llamo al Middleware de Errores con error
            return next(error);    
        }

        //Devuelvo los usuarios       
        res.send(
            {
                status: "success",
                payload: usuarios
            }
        )

    }

    async getInactiveUsers(req, res, next) {
        const dosDiasEnMilisegundos = 2 * 24 * 60 * 60 * 1000;
        let usuarios = [];

        
        //Elimino los usuarios inactivos
        try {
            //Obtengo los Usuarios
            usuarios = await this.#userService.getUsuariosInactivosAsync(dosDiasEnMilisegundos);

             /* //Paso 3: Envío un mail a los usuarios inactivos //SACAR TODO ESTO DESPUÉS
             usuarios.forEach(async usuarioInactivo => {
                //Generar el mail de notificación de baja
                const correoOptions = {
                    from : "SuperStore",
                    to: usuarioInactivo.email,
                    subject: "Eliminación de su Cuenta por Inactividad",
                    html: `<head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
                                <title>SuperStore</title>
                            </head>
                            <body>
                                <h1 style="text-align: center;"> SuperStore - Eliminación de Usuario </h1>
                                <p> Estimado ${usuarioInactivo.first_name} ${usuarioInactivo.last_name}: </p>
                                <p> Lamentamos comunicarle que su cuenta ha sido dada de baja por inactividad </p>
                                <p> Nuestro equipo se toma MUY EN SERIO las relaciones tóxicas, y no podemos permitir de ninguna manera que haya estado 2 eternos días sin utilizar nuestra fantástica plataforma </p>
                                <p> Le dejamos algunas reflexiones de nuestro equipo:  </p>
                                <ul>
                                    <li>¿Que tiene Mercado Libre que no tenga yo?</li>
                                    <li>¿Sin un feed como Instagram no valgo nada?</li>
                                    <li>Ya vas a volver llorando cuando ebay te pida el código SWIFT para respirar</li>
                                </ul>
                                <p> Atentamente SuperStore  </p>
                                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
                            </body>
                            `
                    }

                    const mailer = new MailingService();    
                
                    await mailer.sendSimpleMail(correoOptions);    
                }) */
        }
        catch (error) {
            //Devuelve un Custom Error, así que llamo al Middleware de Errores con error
            return next(error);
        }

        //Los Usuarios se eliminaron con éxito       
        res.send(
            {
                status: "success",
                payload: usuarios
            }
        )

    }

    async deleteInactiveUsers(req, res, next) {
        const dosDiasEnMilisegundos = 2 * 24 * 60 * 60 * 1000;
        let resultado;
        let usuariosInactivos = [];

        
        //Elimino los usuarios inactivos
        try {
            //Paso 1: Obtengo los usuarios inactivos
            usuariosInactivos = await this.#userService.getUsuariosInactivosAsync(dosDiasEnMilisegundos);

            //Paso 2: elimino los usuarios inactivos
            resultado = await this.#userService.deleteUsuariosInactivosAsync(dosDiasEnMilisegundos);

            //Paso 3: Envío un mail a los usuarios eliminados
            usuariosInactivos.forEach(async usuarioInactivo => {
                //Generar el mail de notificación de baja
                const correoOptions = {
                    from : "SuperStore",
                    to: usuarioInactivo.email,
                    subject: "Eliminación de su Cuenta por Inactividad",
                    html: `<head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
                                <title>SuperStore</title>
                            </head>
                            <body>
                                <h1 style="text-align: center;"> SuperStore - Eliminación de Usuario </h1>
                                <p> Estimado ${usuarioInactivo.first_name} ${usuarioInactivo.last_name}: </p>
                                <p> Lamentamos comunicarle que su cuenta ha sido dada de baja por inactividad </p>
                                <p> Nuestro equipo se toma MUY EN SERIO las relaciones tóxicas, y no podemos permitir de ninguna manera que haya estado 2 eternos días sin utilizar nuestra fantástica plataforma </p>
                                <p> Le dejamos algunas reflexiones de nuestro equipo:  </p>
                                <ul>
                                    <li>¿Que tiene Mercado Libre que no tenga yo?</li>
                                    <li>¿Sin un feed como Instagram no valgo nada?</li>
                                    <li>Ya vas a volver llorando cuando ebay te pida el código SWIFT para respirar</li>
                                </ul>
                                <p> Atentamente SuperStore  </p>
                                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
                            </body>
                            `
                    }

                    const mailer = new MailingService();    
                
                    await mailer.sendSimpleMail(correoOptions);    
                })
        }

        catch (error) {
            //Devuelve un Custom Error, así que llamo al Middleware de Errores con error
            return next(error);
        }

        //Los Usuarios se eliminaron con éxito       
        res.send(
            {
                status: "success",
                message: "Los Usuarios inactivos fueron eliminados con éxito",
            }
        )

    }


}
import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { userManager } from "../app.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("github", new GitHubStrategy(
        {
            passReqToCallback: true,
            clientID : "Iv1.e0dad7731910e56f",
            clientSecret: "ea408745a7bb432d0d863752f1f08b088238f0c7",
            callbackURL : "http://localhost:8080/api/sessions/githubcallback"

        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                console.log("Profile GitHub: ", profile);

                //Paso 1: Me fijo si el usuario ya existía en la Base de Datos
                let viejoUsuario;
                try {
                    viejoUsuario = await userManager.getUserAsync(profile._json.email);

                    //El Usuario ya existía: no se puedo volver a registrar
                    console.log("El Usuario ya existía previemente");

                    req.session.error = "El Usuario ya existía previamente";

                    return done(null, false, "El Usuario ya existía previamente"); //Esto significa que no hubo error pero no hay usuario para devolver
                }
                catch (error) {
                    //El Usuario no existía
                    console.log("El Usuario no existía previamente")
                }

                const usuarioARegistrar = {
                    first_name: profile._json.name,
                    last_name: "-", //Dato ficticio
                    email: profile._json.email,
                    age : 18, //Dato ficticio
                    password : "123456", //Dato ficticio
                }

                console.log("Usuario a Registrar: ", usuarioARegistrar);
        
                let nuevoUsuario = await userManager.addUserAsync(usuarioARegistrar);
                
                //Salió todo bien
                return done(null, nuevoUsuario);


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
               }
                catch (e) {
                    //No es un JSON
                    mensajeError = error.message;
                }

                //Cuando hay un error se manda done con el error indicado
                req.session.error = mensajeError;

                return done(null, false, "Error de registro: " + mensajeError);
            }


        }
    ))

    passport.use("register", new LocalStrategy(
        {passReqToCallback: true,
         usernameField: "email"
        }  ,
        async (req, username, password, done) => {
            try {
                if (req.body) {
                    console.log(req.body);
                }
                else {
                    console.log("No hay req.body");
                }

                const {first_name, last_name, email, age} = req.body;

                //Paso 1: Me fijo si el usuario ya existía en la Base de Datos
                let viejoUsuario;
                try {
                    viejoUsuario = await userManager.getUserAsync(username);

                    //El Usuario ya existía: no se puedo volver a registrar
                    console.log("El Usuario ya existía previemente");

                    req.session.error = "El Usuario ya existía previemente";

                    return done(null, false, "El Usuario ya existía previemente"); //Esto significa que no hubo error pero no hay usuario para devolver
                }
                catch (error) {
                    //El Usuario no existía
                    console.log("El Usuario no existía previamente")
                }

                const usuarioARegistrar = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password,
                }

                console.log("Usuario a Registrar: ", usuarioARegistrar);
        
                let nuevoUsuario = await userManager.addUserAsync(usuarioARegistrar);
                
                //Salió todo bien
                return done(null, nuevoUsuario);
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
               }
                catch (e) {
                    //No es un JSON
                    mensajeError = error.message;
                }

                //Cuando hay un error se manda done con el error indicado
                req.session.error = mensajeError;

                return done(null, false, "Error de registro: " + mensajeError);
            }    
        } 

    ))

    passport.use("login", new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: "email"
        },
        async (req, username, password, done) => {
            try {
                let nuevoUsuario = await userManager.loginAsync(username, password);
                
                if (nuevoUsuario) {
                    return done(null, nuevoUsuario);
                }
                else {
                    let mensajeError = "Usuario o Contraseña inválidos";
                    mensajeError = req.session.error;
                    return done(null, false, mensajeError);
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
        
                    req.session.error = mensajeError;

                    //return done(mensajeError); Debería hacer así pero sino no anda failureRedirect
                    return done(null, false, mensajeError);

                }
                catch (e) {
                    //No es un JSON
                    mensajeError = error.message;
                    req.session.error = mensajeError;

                    //return done(mensajeError); Debería hacer así pero sino no anda failureRedirect
                    return done(null, false, mensajeError);
                }
        
                
            }    
        }
        

    ))

    //Colocamos las estrategias de serializacion y deserializacion fuera de la estrategia local
    passport.serializeUser((user, done) => {
        console.log("Estoy serializando");
        done(null, user.id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userManager.getUserByIdAsync(id);
        
        console.log("Estoy deserializando");
        console.log("User ID: ", id);
        console.log("User: ", user);

        done(null, user);
    })
}



export default initializePassport;
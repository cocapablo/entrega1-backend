import express from "express";
import { userManager } from "../app.js";
import passport from "passport";

const router = express.Router();

//Endpoints sin Passport
/* router.post("/api/sessions/register", async (req, res) => {
    try {
        const {first_name, last_name, email, age, password} = req.body;

        const usuarioARegistrar = {
            first_name,
            last_name,
            email,
            age,
            password
        }

        let nuevoUsuario = await userManager.addUserAsync(usuarioARegistrar);

        res.redirect("/login");
    }
    catch (error) {
        //res.status(500).send("Error de registro");
        res.redirect("/register?error=true&mensajeError=" + error.message);
    }
}) */

/* router.post("/api/sessions/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        let nuevoUsuario = await userManager.loginAsync(email, password);

        if (nuevoUsuario) {
            //Agrego los datos del usuario
            req.session.user = nuevoUsuario;
            res.redirect("/products?limit=6");
        }
        else {
            res.redirect("/login?error=true&mensajeError='Usuario o contraseña incorrectos'");
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

            res.status(oError.status).redirect("/login?error=true&mensajeError=" + mensajeError);
        }
        catch (e) {
            //No es un JSON
            mensajeError = error.message;
            res.redirect("/login?error=true&mensajeError=" + mensajeError);
        }

        
    }
}) */

router.post("/api/sessions/changePassword", async (req, res) => { //el método debería ser put pero habría que crear una función en JavaScript que mande los datos
    try {
        const {email, password} = req.body;

        let nuevoUsuario = await userManager.changePasswordAsync(email, password);

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
})

//Endpoints con Passport
//register con Passport
router.post("/api/sessions/register", passport.authenticate("register", {failureRedirect: "/api/sessions/failregister"}), async (req, res) => {
    //Registro exitoso: Redirijo a login
    res.redirect("/login");    
})

router.get("/api/sessions/failregister", async (req, res) => {
    //Registro fallido
    //res.status(500).send("Error de registro");
    let mensajeError = "Error de Registro";

    req.session.error && (mensajeError = req.session.error);
    res.redirect("/register?error=true&mensajeError=" + mensajeError);
})

router.post("/api/sessions/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async (req, res) => {
    
    if (req.user) {
        //Agrego los datos del usuario desde req.user
        let nuevoUsuario = req.user;
        console.log("Nuevo usuario: ", nuevoUsuario);

        req.session.user = {
            first_name: nuevoUsuario.first_name,
            last_name: nuevoUsuario.last_name,
            email: nuevoUsuario.email,
            age: nuevoUsuario.age,
            role: nuevoUsuario.role

        } 
        res.redirect("/products?limit=6");
    }
    else {
        let mensajeError = "Usuario o contraseña incorrectos";

        req.session.error && (mensajeError = req.session.error);
        res.redirect("/login?error=true&mensajeError=" + mensajeError);
    }
    
}) 

router.get("/api/sessions/faillogin", (req, res) => {
    let mensajeError = "Usuario o contraseña incorrectos";

    req.session.error && (mensajeError = req.session.error);
    res.redirect("/login?error=true&mensajeError=" + mensajeError);   
})

router.get("/api/sessions/logout", (req, res) => {
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
})

//GitHub
router.get("/api/sessions/github", passport.authenticate("github", {scope: ["user.email"]}), async (req, res) => {});

router.get("/api/sessions/githubcallback", passport.authenticate("github", {failureRedirect: "/api/sessions/failgithub"}), async (req, res) => {
    req.session.user = req.user;
    res.redirect("/products?limit=6");
})

router.get("/api/sessions/failgithub", (req, res) => {
    let mensajeError = "Error al Loguearse en GitHub";

    req.session.error && (mensajeError = req.session.error);
    res.redirect("/login?error=true&mensajeError=" + mensajeError);   
})

export default router;
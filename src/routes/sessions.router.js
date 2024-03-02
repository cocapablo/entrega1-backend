import express from "express";
import { userManager } from "../app.js";

const router = express.Router();

router.post("/api/sessions/register", async (req, res) => {
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
        res.status(500).send("Error de registro");
    }
})

router.post("/api/sessions/login", async (req, res) => {
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
        res.redirect("/login?error=true&mensajeError=" + error.toString());
    }
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

export default router;
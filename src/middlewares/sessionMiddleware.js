import express from "express";
import session from "express-session";
import logger from "../services/logs/logger.js";

export function usuarioLogueado(req, res, next) {
    let usuario = null;
    
    req.session && req.session.user && (usuario = req.session.user);
    
    if (usuario) {
        //El usuario está logueado 
        return next()
    }
    
    //El usuario no está logueado : lo redirecciono al login
    res.redirect("/login");

      
}

export function usuarioNoLogueado(req, res, next) {
    let usuario = null;
    
    req.session && req.session.user && (usuario = req.session.user);
    
    if (usuario) {
        //El usuario está logueado : lo redirecciono a products
        res.redirect("/products?limit=6");
        
    }
    
    //El usuario no está logueado : lo dejo loguearse o registrarse
    return next()
      
}

export function usuarioEsAdministrador(req, res, next) {
    let usuario = null;
    let rolUsuario = null;
    
    req.session && req.session.user && (usuario = req.session.user);
    
    if (!usuario) {
        logger.warning("El usuario no está logueado");
        return res.status(401).send({
            status: "error",
            error: "El usuario no está logueado",
            message: "El usuario no está logueado"
        })
    }

    //El usuario está logueado: Me fijo si es adminitrador
    usuario.role && (rolUsuario = usuario.role);

    if (!rolUsuario) {
        logger.warning("El usuario no tiene privilegios para realizar la operación");
        return res.status(403).send({
            status: "error",
            error: "El usuario no tiene privilegios para realizar la operación",
            message: "El usuario no tiene privilegios para realizar la operación"
        })
    }

    if (rolUsuario !== "admin") {
        logger.warning("El usuario no tiene privilegios para realizar la operación");
        return res.status(403).send({
            status: "error",
            error: "El usuario no tiene privilegios para realizar la operación",
            message: "El usuario no tiene privilegios para realizar la operación"
        })
    }

    //Es admin: Lo dejo seguir
    return next();
}

export function usuarioEsUsuario(req, res, next) {
    let usuario = null;
    let rolUsuario = null;
    
    req.session && req.session.user && (usuario = req.session.user);
    
    if (!usuario) {
        logger.warning("El usuario no está logueado");
        return res.status(401).send({
            status: "error",
            error: "El usuario no está logueado",
            message: "El usuario no está logueado"
        })
    }

    //El usuario está logueado: Me fijo si es adminitrador
    usuario.role && (rolUsuario = usuario.role);

    if (!rolUsuario) {
        logger.warning("El usuario no tiene privilegios para realizar la operación");
        return res.status(403).send({
            status: "error",
            error: "El usuario no tiene privilegios para realizar la operación",
            message: "El usuario no tiene privilegios para realizar la operación"
        })
    }

    if (rolUsuario !== "usuario") {
        logger.warning("El usuario no tiene privilegios para realizar la operación");
        return res.status(403).send({
            status: "error",
            error: "El usuario no tiene privilegios para realizar la operación",
            message: "El usuario no tiene privilegios para realizar la operación"
        })
    }

    //Es usuario: Lo dejo seguir
    return next();
}

export function usuarioEsPremium(req, res, next) {
    let usuario = null;
    let rolUsuario = null;
    
    req.session && req.session.user && (usuario = req.session.user);
    
    if (!usuario) {
        logger.warning("El usuario no está logueado");
        return res.status(401).send({
            status: "error",
            error: "El usuario no está logueado",
            message: "El usuario no está logueado"
        })
    }

    //El usuario está logueado: Me fijo si es premium
    usuario.role && (rolUsuario = usuario.role);

    if (!rolUsuario) {
        logger.warning("El usuario no tiene privilegios para realizar la operación");
        return res.status(403).send({
            status: "error",
            error: "El usuario no tiene privilegios para realizar la operación",
            message: "El usuario no tiene privilegios para realizar la operación"
        })
    }

    if (rolUsuario !== "premium") {
        logger.warning("El usuario no tiene privilegios para realizar la operación");
        return res.status(403).send({
            status: "error",
            error: "El usuario no tiene privilegios para realizar la operación",
            message: "El usuario no tiene privilegios para realizar la operación"
        })
    }

    //Es premium: Lo dejo seguir
    return next();
}

export function applyPolicies(roles) {
    return (req, res, next) => {
        let usuario = null;
        let rolUsuario = null;
        
        req.session && req.session.user && (usuario = req.session.user);
        
        if (!usuario) {
            logger.warning("El usuario no está logueado");
            return res.status(401).send({
                status: "error",
                error: "El usuario no está logueado",
                message: "El usuario no está logueado"
            })
        }

        //El usuario está logueado: Me fijo si tiene alguno de los roles especificados en el array roles
        usuario.role && (rolUsuario = usuario.role);

        if (!rolUsuario) {
            logger.warning("El usuario no tiene privilegios para realizar la operación");
            return res.status(403).send({
                status: "error",
                error: "El usuario no tiene privilegios para realizar la operación",
                message: "El usuario no tiene privilegios para realizar la operación"
            })
        }

        if (!roles.includes(rolUsuario)) {
            logger.warning("El usuario no tiene privilegios para realizar la operación");
            return res.status(403).send({
                status: "error",
                error: "El usuario no tiene privilegios para realizar la operación",
                message: "El usuario no tiene privilegios para realizar la operación"
            })
        }
        
        //El role del usuario está incluído en los roles permitidos: lo dejo seguir
        return next();
    }
}


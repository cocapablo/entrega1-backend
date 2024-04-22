import express from "express";
import session from "express-session";

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
        return res.status(401).send({
            status: "error",
            error: "El usuario no está logueado"
        })
    }

    //El usuario está logueado: Me fijo si es adminitrador
    usuario.role && (rolUsuario = usuario.role);

    if (!rolUsuario) {
        return res.status(403).send({
            status: "error",
            error: "El usuario no tiene privilegios para realizar la operación"
        })
    }

    if (rolUsuario !== "admin") {
        return res.status(403).send({
            status: "error",
            error: "El usuario no tiene privilegios para realizar la operación"
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
        return res.status(401).send({
            status: "error",
            error: "El usuario no está logueado"
        })
    }

    //El usuario está logueado: Me fijo si es adminitrador
    usuario.role && (rolUsuario = usuario.role);

    if (!rolUsuario) {
        return res.status(403).send({
            status: "error",
            error: "El usuario no tiene privilegios para realizar la operación"
        })
    }

    if (rolUsuario !== "usuario") {
        return res.status(403).send({
            status: "error",
            error: "El usuario no tiene privilegios para realizar la operación"
        })
    }

    //Es usuario: Lo dejo seguir
    return next();
}


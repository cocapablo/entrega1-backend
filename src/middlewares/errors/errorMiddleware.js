import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {

    console.log("Entré al Middleware de Errores");
    console.error(error);

    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR :
            res.status(400).json({status: "error", error: error.name, message: error.message});
            break;
        case EErrors.DATABASE_ERROR :
                res.status(400).json({status: "error", error: error.name, message: error.message});
                break;    
        default:
            res.status(500).json({status: "error", error: "Error no contemplado"});
            break;
    }

}
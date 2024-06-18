import __dirname from "../services/path/pathUtils.js"
import multer from 'multer';


//Nota: Construir tantos storage como ubicaciones de archivos haya
//Ej: Para los profiles de usuarios, para las imagenes de productos, para los docs del usuario

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        let tipoArchivo;

        tipoArchivo = file.fieldname;
        switch (tipoArchivo) {
            case "profile":
                //Foto de perfil del usuario
                cb(null,`${__dirname}/public/profiles`);  
                break;  
            default:
                //cb(null,`${__dirname}/../public/img`); //Cambiar esto. Customizarlo de acuerdo al caso o lanzar un error
                cb(new Error("ERROR en multer: Tipo de Archivo a subir inválido")); //Lanzo un error
                break;
        }
        
    },
    filename: function(req,file,cb) {
        let tipoArchivo;
        let nombreArchivo;
        let idUsuario = "desconocido";

        tipoArchivo = file.fieldname;
        nombreArchivo = file.filename;

        console.log("nombre de Archivo original: ", nombreArchivo);
        
        req.params && req.params.uid && (idUsuario = req.params.uid);
    
        switch (tipoArchivo) {
            case "profile":
                //Foto de perfil del usuario
                cb(null, `${idUsuario}-profile.jpg`);  
                break;  
            default:    
                cb(new Error("ERROR en multer: Tipo de Archivo a subir inválido")); //Lanzo un error
                break;
        }
    }
})

const uploader = multer({storage}) 

export default uploader;
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
                cb(null,`${__dirname}/../public/img`); //Cambiar esto. Customizarlo de acuerdo al caso o lanzar un error
                break;
        }
        
    },
    filename: function(req,file,cb) {
        let tipoArchivo;
        let usuario = null;
        let idUsuario = " ";

        tipoArchivo = file.fieldname;
        
        req.session && req.session.user && (usuario = req.session.user) && (idUsuario = usuario.id);
    
        switch (tipoArchivo) {
            case "profile":
                //Foto de perfil del usuario
                cb(null,`${idUsuario}-profile`);  
                break;  
            default:    
                cb(null,`${Date.now()}-${file.originalname}`);
                break
        }
    }
})

const uploader = multer({storage}) 

export default uploader;
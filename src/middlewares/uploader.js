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
            case "thumbnailimage":
                //Foto de un producto
                cb(null,`${__dirname}/public/products`);  
                break; 
            case "identificacion":
            case "domicilio":
            case "estadodecuenta":
                cb(null,`${__dirname}/public/documents`);  
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
        let idUsuario = null;
        let idProducto = null;

        tipoArchivo = file.fieldname;
        nombreArchivo = file.originalname;

        //Cambio espacios en blanco por _
        nombreArchivo = nombreArchivo.replaceAll(" ", "_");

        //console.log("nombre de Archivo original: ", nombreArchivo);
        
        req.params && req.params.uid && (idUsuario = req.params.uid);

        req.params && req.params.pid && (idProducto = req.params.pid);
    
        switch (tipoArchivo) {
            case "profile":
                //Foto de perfil del usuario

                if (!nombreArchivo) {
                    nombreArchivo = `${Date.now()}-profile.jpg`
                }
                else {
                    if (idUsuario) {
                        nombreArchivo = `${idUsuario}-${nombreArchivo}`;
                    }
                    else {
                        nombreArchivo = `${Date.now()}-${nombreArchivo}`;
                    }
                }
                
                cb(null, nombreArchivo);  

                break;  
            case "thumbnailimage":
                //Foto de un Producto
                if (!nombreArchivo) {
                    nombreArchivo = `${Date.now()}-thumbnail.jpg`
                }
                else {
                    if (idProducto) {
                        nombreArchivo = `${idProducto}-${nombreArchivo}`;
                    }
                    else {
                        nombreArchivo = `${Date.now()}-${nombreArchivo}`;
                    }
                }
                
                cb(null, nombreArchivo);  

                break;  
            case "identificacion":
                //Identificación del Usuario (Ej: DNI)}
                if (!nombreArchivo) {
                    nombreArchivo = `${Date.now()}-identificacion.jpg`;
                }
                else {
                    if (idUsuario) {
                        nombreArchivo = `${idUsuario}-${nombreArchivo}`;
                    }
                    else {
                        nombreArchivo = `${Date.now()}-${nombreArchivo}`;
                    }
                }

                cb(null, nombreArchivo);  

                break; 
            case "domicilio":
                //Comprobante de Domicilio (Ej: DNI)}
                if (!nombreArchivo) {
                    nombreArchivo = `${Date.now()}-domicilio.pdf`;
                }
                else {
                    if (idUsuario) {
                        nombreArchivo = `${idUsuario}-${nombreArchivo}`;
                    }
                    else {
                        nombreArchivo = `${Date.now()}-${nombreArchivo}`;
                    }
                }

                cb(null, nombreArchivo);  

                break; 
            case "estadodecuenta":
                //Estado de Cuenta del Usuario (Ej: DNI)}
                if (!nombreArchivo) {
                    nombreArchivo = `${Date.now()}-estadodecuenta.pdf`;
                }
                else {
                    if (idUsuario) {
                        nombreArchivo = `${idUsuario}-${nombreArchivo}`;
                    }
                    else {
                        nombreArchivo = `${Date.now()}-${nombreArchivo}`;
                    }
                }

                cb(null, nombreArchivo);  

                break; 
            default:    
                cb(new Error("ERROR en multer: Tipo de Archivo a subir inválido")); //Lanzo un error
                break;
        }
    }
})

const uploader = multer({storage}) 

export default uploader;
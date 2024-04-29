export const generateProductErrorInfo = (product) => {
    let mensaje;

    mensaje = `Una o mas propiedades del producto estaban incompletas o inválidas.
               Lista de propiedades requeridas:
          *     title: necesita un String, se recibió ${product.title}
          *     description:  necesita un String, se recibió ${product.description}
          *     price: se necesita un Number > 0, se recibió ${product.price}
          *     code: se necesita un String, se recibió ${product.code} 
          *     category: se necesita un String, se recibió ${product.category} 
          *     
    `;

    return mensaje;
}

export const generateCartErrorInfo = (cart) => {
    let mensaje;

    mensaje = `Una o mas propiedades del carrito estaban incompletas o inválidas.
               Lista de propiedades requeridas:
          *     id : se necesitaba un id válido y se envió : ${cart.id}
          *     
    `;

    return mensaje;
}

export const generateDatabaseErrorInfo = (error) => {
    let mensaje;

    mensaje = `La Base de Datos devolvió el siguiente mensaje de error: ${error.message}`;
        
    return mensaje;    
}


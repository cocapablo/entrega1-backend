let usuarioLogueado = null;

function agregarProductoAlCarrito(idProducto) {
    let idCarrito = null;

    //Verifico que esté configurado el Carrito
    usuarioLogueado && usuarioLogueado.cart && (idCarrito = usuarioLogueado.cart);

    if (!idCarrito) {
        Swal.fire({
            icon: "warning",
            title: "ERROR",
            text: `Carrito no configurado`
        }) 
        
        return;
    }
    
    //Agrego el producto al carrito
    let datos = {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
    }

    let api = `/api/carts/${idCarrito}/products/${idProducto}`;

    fetch(api, datos)
    .then(res => res.json())
    .then(resultado => {
        if (resultado.status === "accepted") {
            Swal.fire({
                icon: "success",
                title: "Operación exitosa",
                text: `El producto fué agregado correctamente al carrito`
            })
        }
        else {
            Swal.fire({
                icon: "warning",
                title: "ERROR",
                text: `Se produjo el siguiente error: ${resultado.error}`
            })    
        }
    })
    .catch(err => {
        Swal.fire({
            icon: "warning",
            title: "ERROR",
            text: `Se produjo el siguiente error: ${err.toString()}`
        })
    });

}

function obtenerUsuarioLogueado() {
    //Llamo a la api para obtener los datos de usuario
    fetch("/api/sessions/current")
    .then(res => res.json())
    .then(resultados => {
        console.log("Resultados: ", resultados);

        //Analizo los Resultados devueltos
        let usuario = null;

        resultados.user && resultados.user.id && (usuario = resultados.user);
        if (!usuario) {
            //Hubo un error
            let mensajeError = resultados.user;
            Swal.fire({
                icon: "warning",
                title: "ERROR",
                text: `Se produjo el siguiente error: ${mensajeError}`
            })    
        }
        else {
            //Exito!!!
            console.log("Usuario logueado: ", usuario);
            
            //Seteo el Usuario logueado
            usuarioLogueado = usuario;
        }
    })
    .catch(err => {
        Swal.fire({
            icon: "warning",
            title: "ERROR",
            text: `Se produjo el siguiente error: ${err.toString()}`
        })
    });

    return;

}

function mostrarCarrito() {
    let idCarrito = null;

    //Verifico que esté configurado el Carrito
    usuarioLogueado && usuarioLogueado.cart && (idCarrito = usuarioLogueado.cart);

    if (!idCarrito) {
        Swal.fire({
            icon: "warning",
            title: "ERROR",
            text: `Carrito no configurado`
        }) 
        
        return;
    }

    //Paso 2: Voy al carrito
    let url = `/cart/${idCarrito}`;

    window.location.href = url;

    
}

//Arranque
obtenerUsuarioLogueado();
function eliminarProducto(idProducto) {
    let idCarrito;
    
    console.log("idProducto: ", idProducto);

    //Paso 1: Obtengo idCarrito
    idCarrito = document.getElementById("idCarrito").value;

    console.log("IdCarrito: ", idCarrito);

    //Paso 2: Borro el Producto del Carrito
    let datos = {
        method: "DELETE",
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
                text: `El producto fué eliminado correctamente del carrito`
            })
            .then((valor) => {
                //Paso 3: Recargo el carrito
                let url = `/cart/${idCarrito}`;
            
                window.location.href = url;
                //window.location.reload(true);
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

function comprar() {
    let idCarrito;
    

    //Paso 1: Obtengo idCarrito
    idCarrito = document.getElementById("idCarrito").value;

    console.log("IdCarrito: ", idCarrito);

    //Paso 2: Realizo la Compra
    let datos = {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
    }

    let api = `/api/carts/${idCarrito}/purchase`;

    fetch(api, datos)
    .then(res => res.json())
    .then(resultado => {
        if ((resultado.status === "success") || (resultado.status === "partial-success")) {
            let mensaje = "";

            mensaje = `Resumen de Compra : Code: ${resultado.ticket.code} - Total:$ ${resultado.ticket.amount}`;
            if (resultado.status === "partial-success") {
                let titulosProductos = "";

                resultado.rejectedProducts.forEach(producto => titulosProductos = titulosProductos + producto.title + " ");
                mensaje += `  -   Los siguientes productos no se incluyeron en la compra por falta de Stock: ${titulosProductos}`;
            }

            Swal.fire({
                icon: "success", 
                title: "Operación exitosa",
                text: mensaje
            })
            .then((valor) => {
                //Paso 3: Recargo el carrito
                let url = `/cart/${idCarrito}`;
            
                window.location.href = url;
                //window.location.reload(true);
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
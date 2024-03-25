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
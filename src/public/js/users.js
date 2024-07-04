function eliminarUsuario(idUsuario) {
        
    console.log("idUsuario: ", idUsuario);

       
    //Paso 1: Borro el Usuario
    let datos = {
        method: "DELETE",
        headers: {"Content-type": "application/json; charset=UTF-8"},
    }

    let api = `/api/users/${idUsuario}`;

    fetch(api, datos)
    .then(res => res.json())
    .then(resultado => {
        if (resultado.status === "success") {
            Swal.fire({
                icon: "success",
                title: "Operación exitosa",
                text: `El Usuario fué eliminado correctamente`
            })
            .then((valor) => {
                //Paso 3: Recargo la tabla de usuarios
                let url = `/users`;
            
                window.location.href = url;
                //window.location.reload(true);
            })

            
        }
        else {
            Swal.fire({
                icon: "warning",
                title: "ERROR",
                text: `Se produjo el siguiente error: ${resultado.message}`
            })    
        }
    })
    .catch(err => {
        Swal.fire({
            icon: "warning",
            title: "ERROR",
            text: `Se produjo el siguiente error: ${err.message}`
        })
    });


}

function cambiarRolUsuario(idUsuario) {
    console.log("idUsuario: ", idUsuario);

       
    //Paso 1: Cambio el Rol del Usuario
    let datos = {
        method: "PUT",
        headers: {"Content-type": "application/json; charset=UTF-8"},
    }

    let api = `/api/users/premium/${idUsuario}`;

    fetch(api, datos)
    .then(res => res.json())
    .then(resultado => {
        if (resultado.status === "success") {
            Swal.fire({
                icon: "success",
                title: "Operación exitosa",
                text: `El Rol del Usuario fué cambiado correctamente`
            })
            .then((valor) => {
                //Paso 3: Recargo la tabla de usuarios
                let url = `/users`;
            
                window.location.href = url;
                //window.location.reload(true);
            })

            
        }
        else {
            Swal.fire({
                icon: "warning",
                title: "ERROR",
                text: `Se produjo el siguiente error: ${resultado.message}`
            })    
        }
    })
    .catch(err => {
        Swal.fire({
            icon: "warning",
            title: "ERROR",
            text: `Se produjo el siguiente error: ${err.message}`
        })
    });
}

function eliminarUsuariosInactivos() {

    //Paso 1: Elimino los Uusarios inactivos
    let datos = {
        method: "DELETE",
        headers: {"Content-type": "application/json; charset=UTF-8"},
    }

    let api = `/api/users/`;

    fetch(api, datos)
    .then(res => res.json())
    .then(resultado => {
        if (resultado.status === "success") {
            Swal.fire({
                icon: "success",
                title: "Operación exitosa",
                text: `Los Usuarios inactivos fueron eliminados correctamente`
            })
            .then((valor) => {
                //Paso 3: Recargo la tabla de usuarios
                let url = `/users`;
            
                window.location.href = url;
                //window.location.reload(true);
            })

            
        }
        else {
            Swal.fire({
                icon: "warning",
                title: "ERROR",
                text: `Se produjo el siguiente error: ${resultado.message}`
            })    
        }
    })
    .catch(err => {
        Swal.fire({
            icon: "warning",
            title: "ERROR",
            text: `Se produjo el siguiente error: ${err.message}`
        })
    });
}
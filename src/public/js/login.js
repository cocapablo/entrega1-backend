
function restaurarPasswordDeForm() {
    let datosOk = validarDatosForm();

    if (datosOk === false) return;

    let email = obtenerEmailDeForm();

    console.log("Email obtenido de Form: ", email);

    restaurarPassword(email);

}

function validarDatosForm() {
    let mensajeError = "";
    let datosOk = true;

    //Obtengo el email del Form
    let email = document.getElementById("idemail").value;
       

    //Validaciones
    if (email.trim().length === 0) {
        mensajeError = "ERROR: email vacío";
    }

        
    //¿Hay errores?
    if (mensajeError === "") {
        //No hay errores
        document.getElementById("idError").style.display = "none";
    }
    else {
        //Hay errores
        document.getElementById("idError").style.display = "block"; 
        document.getElementById("idError").innerText = mensajeError;   
        datosOk = false;
    }

    return datosOk;

}

function obtenerEmailDeForm() {
    //Obtengo el email del Form
    let email = document.getElementById("idemail").value;
    
    return email;
}

function restaurarPassword(email) {

    let datos = {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify({email})
    }

    fetch("/api/sessions/reset-password", datos)
    .then(res => res.json())
    .then(resultado => {
        let mensajeError = null;

        resultado.status && resultado.status === "error" && (mensajeError = resultado.message);
        if (!mensajeError) {
            Swal.fire({
                icon: "success",
                title: "Operación exitosa",
                text: `${resultado.payload}`
            })
        }
        else {
            Swal.fire({
                icon: "warning",
                title: "ERROR",
                text: `Se produjo el siguiente error: ${mensajeError}`
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


function obtenerDocumentosDeForm() {
    let profile = null;
    let identificacion = null;
    let domicilio = null;
    let estadodecuenta = null;

    let documentos = new FormData();

    //Obtengo cada Documento del Usuario
    //Primero obtengo idUsuario
    let id = document.getElementById("formIdUsuario").innerText;

    //Documentos
    //Profile
    let profileElement = document.getElementById("formProfile");
    profileElement.files && profileElement.files[0] && (profile = profileElement.files[0]);

    //Identificacion
    let identificacionElement = document.getElementById("formIdentificacion");
    identificacionElement.files && identificacionElement.files[0] && (identificacion = identificacionElement.files[0]);
    
    //Domicilio
    let domicilioElement = document.getElementById("formDomicilio");
    domicilioElement.files && domicilioElement.files[0] && (domicilio = domicilioElement.files[0]);

    //Estado de Cuenta
    let estadodecuentaElement = document.getElementById("formEstadoDeCuenta");
    estadodecuentaElement.files && estadodecuentaElement.files[0] && (estadodecuenta = estadodecuentaElement.files[0]);
    
    //Armo el objeto producto
    documentos.append("id", id);
    
    if (profile) {
        documentos.append("profile", profile, profile.name);
    }

    if (identificacion) {
        documentos.append("identificacion", identificacion, identificacion.name);
    }

    if (domicilio) {
        documentos.append("domicilio", domicilio, domicilio.name);
    }
    
    if (estadodecuenta) {
        documentos.append("estadodecuenta", estadodecuenta, estadodecuenta.name);
    }

    return documentos;    
}

function validarDatosForm() {
    let mensajeError = "";
    let datosOk = true;
    let profile = null;
    let identificacion = null;
    let domicilio = null;
    let estadodecuenta = null;

    //Obtengo cada propiedad a validar del producto del Form
    //Documentos
    //Profile
    let profileElement = document.getElementById("formProfile");
    profileElement.files && profileElement.files[0] && (profile = profileElement.files[0]);

    //Identificacion
    let identificacionElement = document.getElementById("formIdentificacion");
    identificacionElement.files && identificacionElement.files[0] && (identificacion = identificacionElement.files[0]);
    
    //Domicilio
    let domicilioElement = document.getElementById("formDomicilio");
    domicilioElement.files && domicilioElement.files[0] && (domicilio = domicilioElement.files[0]);

    //Estado de Cuenta
    let estadodecuentaElement = document.getElementById("formEstadoDeCuenta");
    estadodecuentaElement.files && estadodecuentaElement.files[0] && (estadodecuenta = estadodecuentaElement.files[0]);
    

    //Validaciones
    if (!(profile || identificacion || domicilio || estadodecuenta)) {
        mensajeError = "ERROR: debe seleccionar al menos un archivo";
    }

    //¿Hay errores?
    if (mensajeError === "") {
        //No hay errores
        document.getElementById("formError").style.display = "none";
    }
    else {
        //Hay errores
        document.getElementById("formError").style.display = "block"; 
        document.getElementById("formError").innerText = mensajeError;   
        datosOk = false;
    }

    return datosOk;

}

function agregarDocumentosDeForm() {
    let datosOk = validarDatosForm();

    if (datosOk === false) return;

    let documentosDataForm = obtenerDocumentosDeForm();

    console.log("Documentos obtenidos de Form: ", documentosDataForm);

    agregarDocumentos(documentosDataForm);
        
    resetearForm();
}

function agregarDocumentos(formDataDocumentos) {

    let datos = {
        method: "POST",
        //headers: {"Content-type": "multipart/form-data;"},
        body: formDataDocumentos
    }

    let idUsuario = formDataDocumentos.get("id");

    console.log("idUsuario: ", idUsuario);

    fetch("/api/users/" + idUsuario + "/documents", datos)
    .then(res => res.json())
    .then(usuarioActualizado => {
        let mensajeError = null;

        usuarioActualizado.status && usuarioActualizado.status === "error" && (mensajeError = usuarioActualizado.message);
        if (!mensajeError) {
            Swal.fire({
                icon: "success",
                title: "Operación exitosa",
                text: `Los documentos del usuario se agregaron correctamente`
            })
            .then((valor) => {
                //Recargo el profile 
                let url = `/profile`;
            
                window.location.href = url;
                
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

function resetearForm() {
    
    //Borro los datos del formulario
    document.getElementById("formError").style.display = "none";
       
    document.getElementById("formProfile").value = null;
    document.getElementById("formIdentificacion");
    document.getElementById("formDomicilio");
    estadodecuentaElement = document.getElementById("formEstadoDeCuenta");

     
}


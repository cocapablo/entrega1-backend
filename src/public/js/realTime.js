const socket = io();

socket.on("obtenerProductos", productos => {
    renderizarProductos(productos);
    resetearForm();
});

function obtenerProductoDeCard(idProducto) {
    let producto = {};

    //Obtengo cada propiedad del producto de idProducto
    let id = idProducto;
    let title = document.getElementById("title" + idProducto).innerText;
    let description = document.getElementById("description" + idProducto).innerText;
    let price = parseFloat(document.getElementById("price" + idProducto).innerText);
    let thumbnail = document.getElementById("thumbnail" + idProducto).innerText;
    let code = document.getElementById("code" + idProducto).innerText;
    let stock = parseInt(document.getElementById("stock" + idProducto).innerText);
    let category = document.getElementById("category" + idProducto).innerText;
    let status = document.getElementById("status" + idProducto).innerText == "true" ? true : false;

    //Armo el objeto producto
    producto = {
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status
    }

    return producto;
}

function cargarProductoEnForm(producto) {

    //Cargo los datos del producto en el formulario
    document.getElementById("formIdProducto").value = producto.id;
    document.getElementById("formTitle").value = producto.title;
    document.getElementById("formDescription").value = producto.description;
    document.getElementById("formPrice").value = producto.price;
    document.getElementById("formThumbnail").value = producto.thumbnail;
    document.getElementById("formCode").value = producto.code;
    document.getElementById("formStock").value = producto.stock;
    document.getElementById("formCategory").value = producto.category;
    document.getElementById("formStatus").value = producto.status;   

    //Configuro los botones
    document.getElementById("btnActualizarProducto").style.display = "block";
    document.getElementById("btnAgregarProducto").style.display = "none";
}

function editarProducto(idProducto) {
    let producto = obtenerProductoDeCard(idProducto);

    console.log("Producto obtenido", producto);

    cargarProductoEnForm(producto);
}

function resetearForm() {
    
    //Borro los datos del formulario
    document.getElementById("formIdProducto").value = 0;
    document.getElementById("formTitle").value = "";
    document.getElementById("formDescription").value = "";
    document.getElementById("formPrice").value = 0;
    document.getElementById("formThumbnail").value = "";
    document.getElementById("formCode").value = "";
    document.getElementById("formStock").value = 0;
    document.getElementById("formCategory").value = "";
    document.getElementById("formStatus").value = true;   

    //Configuro los botones
    document.getElementById("btnActualizarProducto").style.display = "none";
    document.getElementById("btnAgregarProducto").style.display = "block";    
}

function obtenerProductoDeForm() {
    let producto = {};

    //Obtengo cada propiedad del producto de idProducto
    let id = document.getElementById("formIdProducto").value;
    let title = document.getElementById("formTitle").value;
    let description = document.getElementById("formDescription").value;
    let price = parseFloat(document.getElementById("formPrice").value);
    let thumbnail = document.getElementById("formThumbnail").value;
    let code = document.getElementById("formCode").value;
    let stock = parseInt(document.getElementById("formStock").value);
    let category = document.getElementById("formCategory").value;
    let status = document.getElementById("formStatus").value == "true" ? true : false;

    //Armo el objeto producto
    producto = {
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status
    }

    return producto;    
}

function agregarProductoDeForm() {
    let datosOk = validarDatosForm();

    if (datosOk === false) return;
    
    let producto = obtenerProductoDeForm();

    console.log("Producto obtenido de Form: ", producto);

    agregarProducto(producto);

    resetearForm();
}

function actualizarProductoDeForm() {
    let datosOk = validarDatosForm();

    if (datosOk === false) return;

    let producto = obtenerProductoDeForm();

    console.log("Producto obtenido de Form: ", producto);

    actualizarProducto(producto);

    resetearForm();
}

function validarDatosForm() {
    let mensajeError = "";
    let datosOk = true;

    //Obtengo cada propiedad a validar del producto del Form
    let title = document.getElementById("formTitle").value;
    let description = document.getElementById("formDescription").value;
    let price = parseFloat(document.getElementById("formPrice").value);
    let code = document.getElementById("formCode").value;
    let stock = parseInt(document.getElementById("formStock").value);
    let category = document.getElementById("formCategory").value;
    

    //Validaciones
    if (title.trim().length === 0) {
        mensajeError = "ERROR: title vacío";
    }

    if (description.trim().length === 0) {
        mensajeError = "ERROR: description vacío";
    }

    if (isNaN(price) || price <=0) {
        mensajeError = "ERROR: price debe ser un número mayor que cero";    
    }

    if (category.trim().length === 0) {
        mensajeError = "ERROR: category vacío";
    }

    if (code.trim().length === 0) {
        mensajeError = "ERROR: code vacío";
    }

    if (isNaN(stock) || stock <=0) {
        mensajeError = "ERROR: stock debe ser un número mayor que cero";    
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

function agregarProducto(producto) {

    let datos = {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(producto)
    }

    fetch("/api/products", datos)
    .then(res => res.json())
    .then(prodAgregado => {
        Swal.fire({
            icon: "success",
            title: "Operación exitosa",
            text: `El producto ${producto.title} se agregó correctamente`
        })
    })
    .catch(err => {
        Swal.fire({
            icon: "warning",
            title: "ERROR",
            text: `Se produjo el siguiente error: ${err.toString()}`
        })
    });
}

function actualizarProducto(producto) {

    let datos = {
        method: "PUT",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(producto)
    }

    fetch("/api/products/" + producto.id, datos)
    .then(res => res.json())
    .then(prodActualizado => {
        Swal.fire({
            icon: "success",
            title: "Operación exitosa",
            text: `El producto ${producto.title} se actualizó correctamente`
        })
    })
    .catch(err => {
        Swal.fire({
            icon: "warning",
            title: "ERROR",
            text: `Se produjo el siguiente error: ${err.toString()}`
        })
    });
}

function eliminarProducto(idProducto) {

    let datos = {
        method: "DELETE",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify({idProducto})
    }

    fetch("/api/products/" + idProducto, datos)
    .then(res => res.json())
    .then(prodActualizado => {
        Swal.fire({
            icon: "success",
            title: "Operación exitosa",
            text: `El producto se eliminó correctamente`
        })
    })
    .catch(err => {
        Swal.fire({
            icon: "warning",
            title: "ERROR",
            text: `Se produjo el siguiente error: ${err.toString()}`
        })
    });
}

function renderizarProductos(productos) {
    let contenidoHTML = "";

    let divProductos = document.getElementById("idListaProductos");

    contenidoHTML += `<div class="row">`;

    productos.forEach(producto => {
        contenidoHTML += ` 
        <div id="idProducto${producto.id}" class="col-3 card w-25 m-3">
            <div className="card-body p-0 my-3">
                <img src=${producto.thumbnail} class="w-100" alt="Imagen del producto" />
                <h5 class="card-title">${producto.title}</h5>
                <p>${producto.description}</p>
                <p><span class="fw-bold">Precio: </span>$ ${producto.price}</p>
                <p><span class="fw-bold">Stock: </span>${producto.stock}</p>
                <p><span class="fw-bold">Categoría: </span>${producto.category}</p>
            </div>
            <div className="card-footer">
                <button class="btn btn-primary my-3 mx-2" onclick="editarProducto('${producto.id}')">Editar</a>
                <button class="btn btn-danger my-3 mx-2" onclick="eliminarProducto('${producto.id}')">Eliminar</a>
            </div>
        </div>
    
        <div id="camposOcultos" style="display: none;">
            <div  id="title${producto.id}">${producto.title}</div>
            <div  id="description${producto.id}">${producto.description}</div>
            <div  id="price${producto.id}">${producto.price}</div>
            <div  id="thumbnail${producto.id}">${producto.thumbnail}</div>
            <div  id="code${producto.id}">${producto.code}</div>
            <div  id="stock${producto.id}">${producto.stock}</div>
            <div  id="category${producto.id}">${producto.category}</div>
            <div  id="status${producto.id}">${producto.status}</div>
        </div> 
        `;   
    });

    contenidoHTML += `</div>`;

    divProductos.innerHTML = contenidoHTML;

}




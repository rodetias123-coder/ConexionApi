// Explorador de contenido aleatorio
// Cuatro funciones independientes, cada una consulta su propia API con
// fetch + async/await y actualiza únicamente su sección de la página.

function marcarCargando(elementoEstado, boton) {
    boton.disabled = true;
    elementoEstado.textContent = "Cargando...";
    elementoEstado.className = "estado-seccion cargando";
}

function marcarListo(elementoEstado, boton) {
    elementoEstado.textContent = "";
    elementoEstado.className = "estado-seccion";
    boton.disabled = false;
}

function marcarError(elementoEstado, boton, mensaje) {
    elementoEstado.textContent = mensaje + " Presiona el botón para reintentar.";
    elementoEstado.className = "estado-seccion error";
    boton.disabled = false;
}

async function obtenerCita() {
    const estado = document.getElementById("citaEstado");
    const boton = document.getElementById("btnCita");
    const textoEl = document.getElementById("citaTexto");
    const autorEl = document.getElementById("citaAutor");

    marcarCargando(estado, boton);
    try {
        const respuesta = await fetch("https://dummyjson.com/quotes/random");
        if (!respuesta.ok) {
            throw new Error("La API de citas respondió con error " + respuesta.status);
        }
        const datos = await respuesta.json();
        textoEl.textContent = "“" + datos.quote + "”";
        autorEl.textContent = "— " + datos.author;
        marcarListo(estado, boton);
    } catch (error) {
        console.error("Error al obtener la cita:", error);
        marcarError(estado, boton, "No se pudo obtener la cita.");
    }
}

async function obtenerPerro() {
    const estado = document.getElementById("perroEstado");
    const boton = document.getElementById("btnPerro");
    const imagenEl = document.getElementById("perroImagen");

    marcarCargando(estado, boton);
    imagenEl.hidden = true;
    try {
        const respuesta = await fetch("https://dog.ceo/api/breeds/image/random");
        if (!respuesta.ok) {
            throw new Error("La API de perros respondió con error " + respuesta.status);
        }
        const datos = await respuesta.json();

        await cargarImagen(imagenEl, datos.message);
        marcarListo(estado, boton);
    } catch (error) {
        console.error("Error al obtener el perro:", error);
        marcarError(estado, boton, "No se pudo obtener la imagen del perro.");
    }
}

async function obtenerGato() {
    const estado = document.getElementById("gatoEstado");
    const boton = document.getElementById("btnGato");
    const imagenEl = document.getElementById("gatoImagen");

    marcarCargando(estado, boton);
    imagenEl.hidden = true;
    try {
        const respuesta = await fetch("https://cataas.com/cat?json=true");
        if (!respuesta.ok) {
            throw new Error("La API de gatos respondió con error " + respuesta.status);
        }
        const datos = await respuesta.json();

        // La API devuelve una URL absoluta en "url". Si alguna vez solo
        // llegara el identificador, se arma la URL con /cat/{id}.
        const urlImagen = datos.url ?? ("https://cataas.com/cat/" + datos.id);
        await cargarImagen(imagenEl, urlImagen);
        marcarListo(estado, boton);
    } catch (error) {
        console.error("Error al obtener el gato:", error);
        marcarError(estado, boton, "No se pudo obtener la imagen del gato.");
    }
}

async function obtenerDato() {
    const estado = document.getElementById("datoEstado");
    const boton = document.getElementById("btnDato");
    const textoEl = document.getElementById("datoTexto");

    marcarCargando(estado, boton);
    try {
        const respuesta = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
        if (!respuesta.ok) {
            throw new Error("La API de datos curiosos respondió con error " + respuesta.status);
        }
        const datos = await respuesta.json();
        textoEl.textContent = datos.text;
        marcarListo(estado, boton);
    } catch (error) {
        console.error("Error al obtener el dato curioso:", error);
        marcarError(estado, boton, "No se pudo obtener el dato curioso.");
    }
}

// Carga una imagen y espera a que termine de descargarse (o falle) antes
// de continuar, para poder mostrar un error controlado si la URL de la
// API no sirve una imagen válida.
function cargarImagen(imagenEl, url) {
    return new Promise((resolve, reject) => {
        imagenEl.onload = () => {
            imagenEl.hidden = false;
            resolve();
        };
        imagenEl.onerror = () => {
            imagenEl.hidden = true;
            reject(new Error("La imagen no se pudo cargar desde " + url));
        };
        imagenEl.src = url;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnCita").addEventListener("click", obtenerCita);
    document.getElementById("btnPerro").addEventListener("click", obtenerPerro);
    document.getElementById("btnGato").addEventListener("click", obtenerGato);
    document.getElementById("btnDato").addEventListener("click", obtenerDato);

    // Contenido inicial al ingresar a la página, cada sección por separado.
    obtenerCita();
    obtenerPerro();
    obtenerGato();
    obtenerDato();
});


// Accediendo a los elementos del formulario
const formulario = document.getElementById("idFormEstudiante");
const resultado = document.getElementById("idResultado");

const inputCarnet = document.getElementById("idCarnet");
const inputNombre = document.getElementById("idNombre");
const inputDui = document.getElementById("idDui");
const inputNit = document.getElementById("idNit");
const inputFecha = document.getElementById("idFecha");
const inputCorreo = document.getElementById("idCorreo");
const inputEdad = document.getElementById("idEdad");

// Expresiones regulares
const regexCarnet = /^[A-Za-z]{2}[0-9]{3}$/;
const regexNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?: [A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/;
const regexDui = /^[0-9]{8}-[0-9]{1}$/;
const regexNit = /^[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]{1}$/;
const regexFecha = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexEdad = /^[0-9]+$/;

// Funcion para validar fechas reales
function validarFecha(fecha) {
    if (!regexFecha.test(fecha)) {
        return false;
    }

    let partes = fecha.split("/");

    let dia = parseInt(partes[0]);
    let mes = parseInt(partes[1]);
    let anio = parseInt(partes[2]);

    if (anio < 1900 || anio > new Date().getFullYear()) {
        return false;
    }

    let fechaIngresada = new Date(anio, mes - 1, dia);

    return (
        fechaIngresada.getFullYear() == anio &&
        fechaIngresada.getMonth() == mes - 1 &&
        fechaIngresada.getDate() == dia &&
        fechaIngresada <= new Date()
    );
}

// Funcion para marcar campos correctos o incorrectos
function marcarCampo(campo, valido) {
    campo.classList.remove("is-valid", "is-invalid");

    if (valido) {
        campo.classList.add("is-valid");
    } else {
        campo.classList.add("is-invalid");
    }
}

// Funcion para validar el formulario
function validarEstudiante(evento) {
    evento.preventDefault();

    // Capturando valores
    let carnet = inputCarnet.value.trim();
    let nombre = inputNombre.value.trim();
    let dui = inputDui.value.trim();
    let nit = inputNit.value.trim();
    let fecha = inputFecha.value.trim();
    let correo = inputCorreo.value.trim();
    let edad = inputEdad.value.trim();

    // Comprobando las expresiones regulares
    let carnetValido = regexCarnet.test(carnet);
    let nombreValido = regexNombre.test(nombre);
    let duiValido = regexDui.test(dui);
    let nitValido = regexNit.test(nit);
    let fechaValida = validarFecha(fecha);
    let correoValido = regexCorreo.test(correo);
    let edadValida = regexEdad.test(edad);

    // Mostrando el estado de cada campo
    marcarCampo(inputCarnet, carnetValido);
    marcarCampo(inputNombre, nombreValido);
    marcarCampo(inputDui, duiValido);
    marcarCampo(inputNit, nitValido);
    marcarCampo(inputFecha, fechaValida);
    marcarCampo(inputCorreo, correoValido);
    marcarCampo(inputEdad, edadValida);

    // Verificando que todos los campos sean validos
    if (
        carnetValido &&
        nombreValido &&
        duiValido &&
        nitValido &&
        fechaValida &&
        correoValido &&
        edadValida
    ) {
        resultado.innerHTML = `
            <div class="alert alert-success">
                <strong>¡Registro válido!</strong>
                Todos los datos del estudiante cumplen
                con el formato solicitado.
            </div>
        `;
    } else {
        resultado.innerHTML = `
            <div class="alert alert-danger">
                <strong>Datos incorrectos.</strong>
                Revise los campos marcados en rojo.
            </div>
        `;
    }
}

// Asociando el evento submit a la funcion
formulario.addEventListener("submit", validarEstudiante);

// Limpiar las validaciones
formulario.addEventListener("reset", function () {
    let campos = formulario.querySelectorAll("input");

    campos.forEach(function (campo) {
        campo.classList.remove("is-valid", "is-invalid");
    });

    resultado.innerHTML = "";
});

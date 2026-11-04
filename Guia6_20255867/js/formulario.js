// Accediendo a los elementos HTML
const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const tablaPacientes = document.getElementById("idTablaPacientes");
const notificacion = document.getElementById("idNotificacion");
const mensaje = document.getElementById("idMensaje");
const idModal = document.getElementById("idModal");

// Componente de Bootstrap
const toast = new bootstrap.Toast(notificacion);

// Recuperando los datos guardados
let arrayPaciente = JSON.parse(localStorage.getItem("pacientes")) || [];
let paisesAgregados = JSON.parse(localStorage.getItem("paises")) || [];

// Variable para saber si estamos editando
let indiceEditar = -1;

// Funcion para mostrar notificaciones
const mostrarMensaje = (texto) => {
    mensaje.textContent = texto;
    toast.show();
};

// Funcion para guardar los pacientes en LocalStorage
const guardarLocalStorage = () => {
    localStorage.setItem("pacientes", JSON.stringify(arrayPaciente));
};

// Funcion para limpiar el formulario
const limpiarForm = () => {
    inputNombre.value = "";
    inputApellido.value = "";
    inputFechaNacimiento.value = "";
    inputRdMasculino.checked = false;
    inputRdFemenino.checked = false;
    cmbPais.value = "0";
    inputDireccion.value = "";
    inputNombrePais.value = "";

    indiceEditar = -1;
    buttonAgregarPaciente.innerHTML =
        '<i class="bi bi-person-plus-fill"></i> Guardar Datos';

    inputNombre.focus();
};

// Funcion para agregar o actualizar pacientes
const addPaciente = function () {
    let nombre = inputNombre.value.trim();
    let apellido = inputApellido.value.trim();
    let fechaNacimiento = inputFechaNacimiento.value;

    let sexo = inputRdMasculino.checked
        ? "Hombre"
        : inputRdFemenino.checked
        ? "Mujer"
        : "";

    let pais = cmbPais.value;
    let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
    let direccion = inputDireccion.value.trim();

    // Validando campos completos
    if (
        nombre != "" &&
        apellido != "" &&
        fechaNacimiento != "" &&
        sexo != "" &&
        pais != "0" &&
        direccion != ""
    ) {
        let paciente = [
            nombre,
            apellido,
            fechaNacimiento,
            sexo,
            labelPais,
            direccion
        ];

        // Verificando si estamos registrando o editando
        if (indiceEditar == -1) {
            arrayPaciente.push(paciente);
            mostrarMensaje("Se ha registrado un nuevo paciente");
        } else {
            arrayPaciente[indiceEditar] = paciente;
            mostrarMensaje("Paciente actualizado correctamente");
        }

        // Guardamos los cambios
        guardarLocalStorage();

        // Actualizamos la tabla y limpiamos el formulario
        imprimirPacientes();
        limpiarForm();
    } else {
        mostrarMensaje("Faltan campos por completar");
    }
};

// Funcion para crear las filas de la tabla
function imprimirFilas() {
    let filas = "";

    arrayPaciente.forEach((paciente, indice) => {
        filas += `<tr>
            <td scope="row" class="text-center fw-bold">${indice + 1}</td>
            <td>${escaparHTML(paciente[0])}</td>
            <td>${escaparHTML(paciente[1])}</td>
            <td>${escaparHTML(paciente[2])}</td>
            <td>${escaparHTML(paciente[3])}</td>
            <td>${escaparHTML(paciente[4])}</td>
            <td>${escaparHTML(paciente[5])}</td>
            <td>
                <button type="button" class="btn btn-primary"
                    data-accion="editar" data-indice="${indice}">
                    <i class="bi bi-pencil-square"></i>
                    Editar
                </button>
                <button type="button" class="btn btn-danger"
                    data-accion="eliminar" data-indice="${indice}">
                    <i class="bi bi-trash3-fill"></i>
                    Eliminar
                </button>
            </td>
        </tr>`;
    });

    return filas;
}

// Evita interpretar los datos ingresados como etiquetas HTML
function escaparHTML(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

// Funcion para mostrar los pacientes
const imprimirPacientes = () => {
    if (arrayPaciente.length == 0) {
        tablaPacientes.textContent = "Ninguno";
        return;
    }

    let tabla = `<div class="table-responsive">
        <table class="table table-striped table-hover table-bordered">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Fecha nacimiento</th>
                    <th>Sexo</th>
                    <th>Pais</th>
                    <th>Dirección</th>
                    <th>Opciones</th>
                </tr>
            </thead>
            <tbody>
                ${imprimirFilas()}
            </tbody>
        </table>
    </div>`;

    tablaPacientes.innerHTML = tabla;
};

// EJERCICIO COMPLEMENTARIO 1
// Funcion para editar un paciente
function editarPaciente(indice) {
    let paciente = arrayPaciente[indice];

    if (!paciente) {
        return;
    }

    inputNombre.value = paciente[0];
    inputApellido.value = paciente[1];
    inputFechaNacimiento.value = paciente[2];

    inputRdMasculino.checked = paciente[3] == "Hombre";
    inputRdFemenino.checked = paciente[3] == "Mujer";

    // Buscar el pais correspondiente
    for (let i = 0; i < cmbPais.options.length; i++) {
        if (cmbPais.options[i].text == paciente[4]) {
            cmbPais.selectedIndex = i;
            break;
        }
    }

    inputDireccion.value = paciente[5];

    indiceEditar = indice;

    buttonAgregarPaciente.innerHTML =
        '<i class="bi bi-check-circle"></i> Actualizar datos';

    inputNombre.focus();
    window.scrollTo(0, 0);
}

// EJERCICIO COMPLEMENTARIO 1
// Funcion para eliminar un paciente
function eliminarPaciente(indice) {
    let confirmar = confirm("¿Desea eliminar este paciente?");

    if (confirmar) {
        arrayPaciente.splice(indice, 1);

        // Actualizar LocalStorage
        guardarLocalStorage();

        // Actualizar la tabla
        imprimirPacientes();
        limpiarForm();

        mostrarMensaje("Paciente eliminado correctamente");
    }
}

// Detectar clic en Editar o Eliminar
tablaPacientes.addEventListener("click", function (evento) {
    let boton = evento.target.closest("button[data-accion]");

    if (boton == null) {
        return;
    }

    let indice = parseInt(boton.dataset.indice);

    if (boton.dataset.accion == "editar") {
        editarPaciente(indice);
    } else if (boton.dataset.accion == "eliminar") {
        eliminarPaciente(indice);
    }
});

// Funcion para agregar un pais
const addPais = () => {
    let paisNew = inputNombrePais.value.trim();

    if (paisNew != "") {
        let option = document.createElement("option");

        option.textContent = paisNew;
        option.value = cmbPais.options.length;

        cmbPais.appendChild(option);
        cmbPais.value = option.value;

        // Guardando los nuevos paises
        paisesAgregados.push(paisNew);
        localStorage.setItem("paises", JSON.stringify(paisesAgregados));

        mostrarMensaje("Pais agregado correctamente");
    } else {
        mostrarMensaje("Faltan campos por completar");
    }
};

// Recuperar los paises agregados anteriormente
paisesAgregados.forEach((pais) => {
    let option = document.createElement("option");
    option.textContent = pais;
    option.value = cmbPais.options.length;
    cmbPais.appendChild(option);
});

// Agregando eventos a los botones
buttonLimpiarPaciente.onclick = () => {
    limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
    addPaciente();
};

buttonMostrarPaciente.onclick = () => {
    imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
    addPais();
};

// Evento al abrir el modal
idModal.addEventListener("shown.bs.modal", () => {
    inputNombrePais.value = "";
    inputNombrePais.focus();
});

// Evitar envio normal del formulario
document.getElementById("idForm").addEventListener("submit", function (e) {
    e.preventDefault();
});

// Ejecutar funciones cuando carga la pagina
limpiarForm();
imprimirPacientes();

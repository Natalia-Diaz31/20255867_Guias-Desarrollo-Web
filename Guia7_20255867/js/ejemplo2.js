 // Obteniendo las referencias del formulario
 const formulario = document.forms["frmRegistro"];
 const button = formulario.elements["btnRegistro"];

 // CREANDO MODAL CON BOOTSTRAP
 const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

 // OBTENIENDO LA REFERENCIA DEL CUERPO DEL MODAL
 const bodyModal = document.getElementById("idBodyModal");

 // FUNCION PARA VALIDAR LA INFORMACION DEL FORMULARIO
 const validarFormulario = function () {

     // Obteniendo los valores de los campos
     const nombre = document.getElementById("idNombre").value.trim();
     const apellidos = document.getElementById("idApellidos").value.trim();
     const fecha = document.getElementById("idFechaNac").value;
     const correo = document.getElementById("idCorreo").value.trim();
     const password = document.getElementById("idPassword").value;
     const repetirPassword = document.getElementById("idPasswordRepetir").value;
     const pais = document.getElementById("idCmPais");
     const archivo = document.getElementById("idArchivo");

     // a. Validar que los campos no esten vacios
     if (nombre == "" || apellidos == "" || fecha == "" ||
         correo == "" || password == "" || repetirPassword == "") {
         alert("Debe completar todos los campos del formulario");
         return;
     }

     // b. Validar que la fecha de nacimiento no supere la fecha actual
     const fechaActual = new Date();
     const fechaNacimiento = new Date(fecha + "T00:00:00");

     if (fechaNacimiento > fechaActual) {
         alert("La fecha de nacimiento no puede superar la fecha actual");
         return;
     }

     // c. Validar el correo electronico con expresiones regulares
     const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     if (!expresionCorreo.test(correo)) {
         alert("Debe ingresar un correo electronico valido");
         return;
     }

     // d. Validar que las contraseñas sean iguales
     if (password != repetirPassword) {
         alert("Las contraseñas no coinciden");
         return;
     }

     // e. Validar que se seleccione al menos un interes
     const intereses = [
         document.getElementById("idCkProgramacion"),
         document.getElementById("idCkBD"),
         document.getElementById("idCkRedes"),
         document.getElementById("idCkSeguridad")
     ];

     let interesesSeleccionados = [];

     for (const interes of intereses) {
         if (interes.checked) {
             const texto = document.querySelector(`label[for="${interes.id}"]`);
             interesesSeleccionados.push(texto.textContent.trim());
         }
     }

     if (interesesSeleccionados.length == 0) {
         alert("Debe seleccionar al menos un interes");
         return;
     }

     // f. Validar que se seleccione una carrera
     const carrera = document.querySelector('input[name="idRdCarrera"]:checked');

     if (carrera == null) {
         alert("Debe seleccionar una carrera");
         return;
     }

     const nombreCarrera = document.querySelector(`label[for="${carrera.id}"]`).textContent.trim();

     // g. Validar que se seleccione un pais de origen
     if (pais.selectedIndex == 0) {
         alert("Debe seleccionar un pais de origen");
         return;
     }

     // Validar que se seleccione un archivo
     if (archivo.files.length == 0) {
         alert("Debe seleccionar una imagen para su avatar");
         return;
     }

     // Guardando los datos validados
     const datos = [
         ["Nombres", nombre],
         ["Apellidos", apellidos],
         ["Fecha de nacimiento", fecha],
         ["Correo electronico", correo],
         ["Contraseña", "********"],
         ["Intereses", interesesSeleccionados.join(", ")],
         ["Carrera", nombreCarrera],
         ["Pais de origen", pais.options[pais.selectedIndex].text],
         ["Avatar", archivo.files[0].name]
     ];

     // Mostrar los datos en una tabla creada con DOM
     crearTabla(datos);
 };

 // FUNCION PARA CREAR LA TABLA CON DOM
 const crearTabla = function (datos) {

     // Limpiando el contenido anterior del modal
     bodyModal.replaceChildren();

     // Creando la tabla
     const tabla = document.createElement("table");
     tabla.setAttribute("class", "table table-bordered table-striped");

     // Creando el encabezado
     const encabezado = document.createElement("thead");
     const filaEncabezado = document.createElement("tr");

     const columnaCampo = document.createElement("th");
     columnaCampo.textContent = "Campo";

     const columnaValor = document.createElement("th");
     columnaValor.textContent = "Informacion";

     filaEncabezado.appendChild(columnaCampo);
     filaEncabezado.appendChild(columnaValor);
     encabezado.appendChild(filaEncabezado);
     tabla.appendChild(encabezado);

     // Creando el cuerpo de la tabla
     const cuerpoTabla = document.createElement("tbody");

     for (const dato of datos) {

         // Creando una fila
         const fila = document.createElement("tr");

         // Creando las columnas
         const celdaCampo = document.createElement("td");
         const celdaValor = document.createElement("td");

         // Agregando los valores
         celdaCampo.textContent = dato[0];
         celdaValor.textContent = dato[1];

         // Agregando las columnas a la fila
         fila.appendChild(celdaCampo);
         fila.appendChild(celdaValor);

         // Agregando la fila a la tabla
         cuerpoTabla.appendChild(fila);
     }

     tabla.appendChild(cuerpoTabla);

     // Agregando la tabla al modal
     bodyModal.appendChild(tabla);

     // Cambiando el titulo del modal
     document.getElementById("modalLabel").textContent =
         "Informacion del registro";

     // Mostrando el modal
     modal.show();
 };

 // AGREGANDO EVENTO AL BOTON
 button.onclick = () => {
     validarFormulario();
 };


 // CONFIGURACION DE LA API
 const API = "https://graphql.anilist.co";
 const ID_NANA = 877;

 // REFERENCIAS A LOS ELEMENTOS HTML
 const listaPersonajes = document.getElementById("listaPersonajes");
 const estado = document.getElementById("estado");
 const totalPersonajes = document.getElementById("totalPersonajes");
 const buscarPersonaje = document.getElementById("buscarPersonaje");
 const btnRecargar = document.getElementById("btnRecargar");
 const btnCerrar = document.getElementById("btnCerrar");
 const seccionDetalle = document.getElementById("seccionDetalle");
 const contenidoDetalle = document.getElementById("contenidoDetalle");

 let personajes = [];

 // IMAGEN DE RESPALDO
 const imagenRespaldo = "data:image/svg+xml;charset=UTF-8," +
     encodeURIComponent(
         '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="550">' +
         '<rect width="400" height="550" fill="#e9ced5"/>' +
         '<text x="200" y="250" text-anchor="middle" font-size="100" fill="#8d344c">ナナ</text>' +
         '<text x="200" y="310" text-anchor="middle" font-size="25" fill="#8d344c">NANA 707</text>' +
         '</svg>'
     );

 // FUNCION PARA CREAR ELEMENTOS CON DOM
 const crearElemento = function (etiqueta, texto, clase) {
     const elemento = document.createElement(etiqueta);

     elemento.textContent = texto || "";

     if (clase) {
         elemento.className = clase;
     }

     return elemento;
 };

 // FUNCION PARA CREAR IMAGENES
 const crearImagen = function (personaje, clase) {
     const imagen = document.createElement("img");

     imagen.src = personaje.image?.large ||
                  personaje.image?.medium ||
                  imagenRespaldo;

     imagen.alt = personaje.name.full;
     imagen.className = clase;
     imagen.loading = "lazy";

     imagen.onerror = function () {
         imagen.onerror = null;
         imagen.src = imagenRespaldo;
     };

     return imagen;
 };

 // FUNCION PARA CONSULTAR LA API
 const consultarAPI = async function (query, variables) {
     const respuesta = await fetch(API, {
         method: "POST",
         headers: {
             "Content-Type": "application/json"
         },
         body: JSON.stringify({
             query: query,
             variables: variables
         })
     });

     if (!respuesta.ok) {
         throw new Error("Error en la solicitud: " + respuesta.status);
     }

     const resultado = await respuesta.json();

     if (resultado.errors) {
         throw new Error(resultado.errors[0].message);
     }

     return resultado.data;
 };

 // FUNCION PARA MOSTRAR LOS PERSONAJES
 const mostrarPersonajes = function (lista) {
     listaPersonajes.replaceChildren();

     if (lista.length == 0) {
         estado.textContent = "No encontramos personajes con ese nombre.";
         return;
     }

     estado.textContent = "";

     for (let index = 0; index < lista.length; index++) {
         const personaje = lista[index];

         // Creando tarjeta
         const tarjeta = document.createElement("button");
         tarjeta.type = "button";
         tarjeta.className = "tarjeta";

         // Creando contenedor de imagen
         const contenedorImagen = crearElemento(
             "div", "", "tarjeta-imagen"
         );

         const imagen = crearImagen(personaje.node, "");

         const numero = crearElemento(
             "span",
             String(index + 1).padStart(2, "0"),
             "tarjeta-numero"
         );

         contenedorImagen.appendChild(imagen);
         contenedorImagen.appendChild(numero);

         // Creando informacion
         const informacion = crearElemento(
             "div", "", "tarjeta-info"
         );

         const papel = crearElemento(
             "span",
             personaje.role == "MAIN"
                 ? "PERSONAJE PRINCIPAL"
                 : "PERSONAJE SECUNDARIO",
             "tarjeta-papel"
         );

         const nombre = crearElemento(
             "h3",
             personaje.node.name.full
         );

         const accion = crearElemento(
             "p",
             "Ver personaje ↗",
             "tarjeta-accion"
         );

         informacion.appendChild(papel);
         informacion.appendChild(nombre);
         informacion.appendChild(accion);

         tarjeta.appendChild(contenedorImagen);
         tarjeta.appendChild(informacion);

         // Evento para consultar el detalle
         tarjeta.addEventListener("click", function () {
             mostrarDetalle(personaje.node.id);
         });

         listaPersonajes.appendChild(tarjeta);
     }
 };

 // FUNCION PARA CARGAR LOS PERSONAJES DE NANA
 const cargarPersonajes = async function () {
     estado.textContent = "Cargando personajes de NANA...";
     listaPersonajes.replaceChildren();
     btnRecargar.disabled = true;
     seccionDetalle.hidden = true;

     // CONSULTA 1: LISTADO DE PERSONAJES
     const query = `
         query ($id: Int) {
             Media(id: $id, type: ANIME) {
                 characters(page: 1, perPage: 25, sort: ROLE) {
                     edges {
                         role
                         node {
                             id
                             name {
                                 full
                             }
                             image {
                                 large
                                 medium
                             }
                         }
                     }
                 }
             }
         }
     `;

     try {
         const resultado = await consultarAPI(query, {
             id: ID_NANA
         });

         personajes = resultado.Media.characters.edges;

         totalPersonajes.textContent = personajes.length;

         filtrarPersonajes();

     } catch (error) {
         personajes = [];
         totalPersonajes.textContent = "0";
         estado.textContent = "No se pudieron cargar los personajes. " +
                              error.message;

         console.error(error);

     } finally {
         btnRecargar.disabled = false;
     }
 };

 // FUNCION PARA BUSCAR PERSONAJES
 const filtrarPersonajes = function () {
     const busqueda = buscarPersonaje.value.toLowerCase().trim();

     const filtrados = personajes.filter(function (personaje) {
         return personaje.node.name.full
             .toLowerCase()
             .includes(busqueda);
     });

     mostrarPersonajes(filtrados);
 };

 // FUNCION PARA MOSTRAR EL DETALLE
 const mostrarDetalle = async function (id) {
     seccionDetalle.hidden = false;
     contenidoDetalle.replaceChildren();

     contenidoDetalle.appendChild(
         crearElemento("p", "Cargando personaje...", "estado")
     );

     // Evitar que la pagina se desplace mientras la ficha esta abierta
    document.body.style.overflow = "hidden";

     // CONSULTA 2: DETALLE DE UN PERSONAJE
     const query = `
         query ($id: Int) {
             Character(id: $id) {
                 id
                 name {
                     full
                     native
                 }
                 image {
                     large
                     medium
                 }
                 description(asHtml: false)
                 age
                 gender
                 favourites
                 siteUrl
             }
         }
     `;

     try {
         const resultado = await consultarAPI(query, {
             id: id
         });

         const personaje = resultado.Character;

         contenidoDetalle.replaceChildren();

         // Creando ficha
         const ficha = crearElemento("div", "", "ficha");

         const imagen = crearImagen(
             personaje, "ficha-imagen"
         );

         const informacion = document.createElement("div");

         const etiqueta = crearElemento(
             "span",
             "SOBRE EL PERSONAJE",
             "etiqueta"
         );

         const nombre = crearElemento(
             "h2", personaje.name.full
         );

         const nombreJapones = crearElemento(
             "p",
             personaje.name.native || "",
             "ficha-japones"
         );

         const edad = crearElemento(
             "p",
             personaje.age ? "Edad: " + personaje.age : ""
         );

         const favoritos = crearElemento(
             "p",
             "♡ " + personaje.favourites + " favoritos en AniList",
             "ficha-favoritos"
         );

         const descripcion = crearElemento(
             "p",
             personaje.description ||
             "No hay una descripción disponible.",
             "ficha-descripcion"
         );

         // Enlace a AniList
         const enlace = document.createElement("a");
         enlace.href = personaje.siteUrl;
         enlace.target = "_blank";
         enlace.rel = "noopener noreferrer";
         enlace.className = "ficha-enlace";
         enlace.textContent = "VER EN ANILIST ↗";

         informacion.appendChild(etiqueta);
         informacion.appendChild(nombre);
         informacion.appendChild(nombreJapones);
         informacion.appendChild(edad);
         informacion.appendChild(favoritos);
         informacion.appendChild(descripcion);
         informacion.appendChild(enlace);

         ficha.appendChild(imagen);
         ficha.appendChild(informacion);

         contenidoDetalle.appendChild(ficha);

     } catch (error) {
         contenidoDetalle.replaceChildren();

         contenidoDetalle.appendChild(
             crearElemento(
                 "p",
                 "No se pudo cargar el personaje. " + error.message,
                 "estado"
             )
         );
     }
 };

 // EVENTOS DE LOS BOTONES
 buscarPersonaje.addEventListener("input", filtrarPersonajes);

 btnRecargar.addEventListener("click", cargarPersonajes);

 
// FUNCION PARA CERRAR LA FICHA
const cerrarDetalle = function () {
    seccionDetalle.hidden = true;
    document.body.style.overflow = "";
};

// Cerrar al presionar el boton
btnCerrar.addEventListener("click", cerrarDetalle);

// Cerrar al presionar Escape
document.addEventListener("keydown", function (event) {
    if (event.key == "Escape" && !seccionDetalle.hidden) {
        cerrarDetalle();
    }
});

// Cerrar al hacer clic fuera de la ficha
seccionDetalle.addEventListener("click", function (event) {
    if (event.target == seccionDetalle) {
        cerrarDetalle();
    }
});

 // CARGAR PERSONAJES AL ABRIR LA PAGINA
 cargarPersonajes();

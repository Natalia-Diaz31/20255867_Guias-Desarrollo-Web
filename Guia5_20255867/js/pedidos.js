
 // Creamos un arreglo vacío donde se guardarán todos los pedidos
    const pedidos = [];

// Accedemos al formulario donde el usuario ingresará los pedidos
    const formulario = document.querySelector("#formPedido");

// Accedemos al campo donde se escribe el nombre del producto
    const producto = document.querySelector("#producto");

// Accedemos al campo donde se ingresa el precio del producto
    const precio = document.querySelector("#precio");

// Accedemos al campo donde se ingresa la cantidad solicitada
    const cantidad = document.querySelector("#cantidad");

    // Accedemos al cuerpo de la tabla donde mostraremos los pedidos
    const tablaPedidos = document.querySelector("#tablaPedidos");

    // Accedemos al elemento donde mostraremos el total de unidades
    const totalUnidades = document.querySelector("#totalUnidades");

    // Accedemos al elemento donde mostraremos el monto total de los pedidos
    const montoTotal = document.querySelector("#montoTotal");

    // Accedemos al campo donde el usuario ingresará el precio máximo para filtrar
    const precioMaximo = document.querySelector("#precioMaximo");

    // Accedemos al botón que permitirá filtrar los productos por precio
    const btnFiltrar = document.querySelector("#btnFiltrar");

    // Accedemos al botón que permitirá mostrar nuevamente todos los pedidos
    const btnMostrarTodos = document.querySelector("#btnMostrarTodos");

    // Accedemos al botón que permitirá eliminar todos los pedidos
    const btnLimpiar = document.querySelector("#btnLimpiar");


    // Creamos una función para registrar los pedidos
    function agregarPedido(evento) {

        // Evitamos que el formulario recargue la página al enviarse
        evento.preventDefault();

        // Obtenemos el nombre del producto y eliminamos espacios innecesarios
        let nombreProducto = producto.value.trim();

        // Convertimos el precio ingresado a un número decimal
        let precioProducto = parseFloat(precio.value);

        // Convertimos la cantidad ingresada a un número
        let cantidadProducto = Number(cantidad.value);

        // Verificamos que el nombre del producto no esté vacío
        if (nombreProducto == "") {
            alert("Debe ingresar el nombre del producto");
            return;
        }

        // Verificamos que el precio sea válido y mayor que cero
        if (isNaN(precioProducto) || precioProducto <= 0) {
            alert("El precio debe ser un número mayor que cero");
            return;
        }

        // Verificamos que la cantidad sea un número entero positivo
        if (!Number.isInteger(cantidadProducto) || cantidadProducto <= 0) {
            alert("La cantidad debe ser un número entero mayor que cero");
            return;
        }

        // Creamos un objeto con los datos del pedido
        const pedido = {
            producto: nombreProducto,
            precio: precioProducto,
            cantidad: cantidadProducto
        };

        // Agregamos el objeto al arreglo de pedidos
        pedidos.push(pedido);

        // Mostramos en la consola el arreglo actualizado
        console.log(pedidos);

        // Actualizamos la tabla para mostrar el nuevo pedido
        mostrarPedidos(pedidos);
        // Actualizamos los totales cada vez que agregamos un pedido
        calcularTotales();
    }

    // Ejecutamos la función cuando el usuario envía el formulario
    formulario.addEventListener("submit", agregarPedido);
    
    // Creamos una función para mostrar los pedidos en la tabla
    function mostrarPedidos(listaPedidos) {

        // Utilizamos map para recorrer los pedidos y crear las filas HTML
        let filas = listaPedidos.map(pedido => {

            // Calculamos el subtotal multiplicando precio por cantidad
            let subtotal = pedido.precio * pedido.cantidad;

            // Devolvemos una fila HTML con los datos del pedido
            return `
                <tr>
                    <td>${pedido.producto}</td>
                    <td>$${pedido.precio.toFixed(2)}</td>
                    <td>${pedido.cantidad}</td>
                    <td>$${subtotal.toFixed(2)}</td>
                </tr>
            `;
        });

        // Unimos todas las filas en una sola cadena de texto
        let contenidoTabla = filas.join("");

        // Mostramos las filas dentro de la tabla HTML
        tablaPedidos.innerHTML = contenidoTabla;
    }

    // Creamos una función para calcular los totales de los pedidos
    function calcularTotales() {

        // Sumamos las cantidades de todos los pedidos utilizando reduce
        let unidades = pedidos.reduce((acumulador, pedido) => {
            return acumulador + pedido.cantidad;
        }, 0);

        // Sumamos los subtotales de todos los pedidos utilizando reduce
        let total = pedidos.reduce((acumulador, pedido) => {
            return acumulador + (pedido.precio * pedido.cantidad);
        }, 0);

        // Mostramos el total de unidades en el HTML
        totalUnidades.innerHTML = unidades;

        // Mostramos el monto total con dos decimales
        montoTotal.innerHTML = total.toFixed(2);
    }
    
    // Creamos una función para filtrar los pedidos por precio
    function filtrarProductos() {

        // Obtenemos el precio máximo ingresado por el usuario
        let maximo = parseFloat(precioMaximo.value);

        // Verificamos que se haya ingresado un precio válido
        if (isNaN(maximo) || maximo < 0) {
            alert("Debe ingresar un precio máximo válido");
            return;
        }

        // Utilizamos filter para obtener los pedidos que cumplen la condición
        let pedidosFiltrados = pedidos.filter(pedido => {
            return pedido.precio <= maximo;
        });

        // Mostramos solamente los pedidos filtrados en la tabla
        mostrarPedidos(pedidosFiltrados);
    }

    // Ejecutamos la función al hacer clic en el botón Filtrar productos
    btnFiltrar.addEventListener("click", filtrarProductos);

    
    // Creamos una función para mostrar nuevamente todos los pedidos
    function mostrarTodos() {

        // Mostramos en la tabla todos los pedidos del arreglo original
        mostrarPedidos(pedidos);
    }

    // Ejecutamos la función cuando el usuario presiona Mostrar todos
    btnMostrarTodos.addEventListener("click", mostrarTodos);

    // Creamos una función para eliminar todos los pedidos
    function limpiarPedidos() {

        // Vaciamos el arreglo donde se guardan los pedidos
        pedidos.length = 0;

        // Actualizamos la tabla para que no muestre pedidos
        mostrarPedidos(pedidos);

        // Actualizamos los totales para que vuelvan a cero
        calcularTotales();
    }

    // Ejecutamos la función cuando el usuario presiona Limpiar pedidos
    btnLimpiar.addEventListener("click", limpiarPedidos);



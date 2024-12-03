const entradaExcel = document.getElementById('excel-input');
const funcionsDiv = document.querySelector('.funcions'); // Obtener el div contenedor

// Ocultar el div contenedor inicialmente
funcionsDiv.style.display = 'none'; 
const campoFiltro = document.getElementById('filtro-input');
const botonFiltrar = document.getElementById('boton-filtrar'); // Obtener el botón existente
const campoTopeMaximo = document.getElementById('tope-maximo'); // Obtener el input de tope máximo

campoFiltro.style.display = 'none'; // Inicialmente ocultar el campo de filtro
campoTopeMaximo.style.display = 'none'; // Inicialmente ocultar el campo de filtro

entradaExcel.addEventListener('change', async function() {
    // Limpiar la tabla y el contenedor de descripción
    const contenedorDescripcion = document.getElementById('description-container');
    const tabla = document.getElementById('data-table');
    contenedorDescripcion.innerHTML = ''; // Limpiar descripciones anteriores
    tabla.innerHTML = ''; // Limpiar la tabla anterior

    // Cargar el nuevo archivo Excel
    const contenido = await readXlsxFile(entradaExcel.files[0]);
    mostrarDatos(contenido);
    // funcionsDiv.style.display = 'flex';
});

function mostrarDatos(datos) {
    const contenedorDescripcion = document.getElementById('description-container');
    const tabla = document.getElementById('data-table');
    tabla.innerHTML = ''; // Limpiar la tabla anterior
    contenedorDescripcion.innerHTML = ''; // Limpiar descripciones anteriores

    // Crear encabezados de la tabla
    const filaEncabezado = document.createElement('tr');
    const encabezados = datos[7]; // Encabezados en la fila de inicio
    if (!Array.isArray(encabezados)) {
        console.error("No se encontraron los encabezados en los datos del archivo.");
        alert("El archivo no tiene los encabezados esperados. Por favor, verifica el archivo.");
        return; // Salir si no encontramos los encabezados
    }

    const columnasDeseadas = ['código', 'nombre', 'cantidad inventario final', 'subtotal', 'iva', 'valor total', 'valor unitario con iva', 'referencia', 'precio compra', 'marca'];
    const indicesColumnas = [];

    const estadosFilas = []; // Array para mantener el estado de las filas

    const encabezadosPresentes = [];

    // Buscar índices de las columnas deseadas
    encabezados.forEach((encabezado, indice) => {
        if (columnasDeseadas.includes(encabezado.toLowerCase())) {
            indicesColumnas.push(indice);
            encabezadosPresentes.push(encabezado.toLowerCase());
            const th = document.createElement('th');
            th.textContent = encabezado;
            filaEncabezado.appendChild(th);
        }
    });

    // Comprobar si al menos una columna de columnasDeseadas no está presente
    const columnasFaltantes = columnasDeseadas.filter(col => !encabezadosPresentes.includes(col.toLowerCase()));
    if (columnasFaltantes.length > 0) {
        console.error("Faltan columnas: " + columnasFaltantes.join(", "));
        alert("El archivo no tiene las siguientes columnas: " + columnasFaltantes.join(", ") + ". Por favor, verifica el archivo.");
        return; // Salir si faltan columnas
    }

    // Añadir columna de checkbox al inicio
    const thCheckbox = document.createElement('th');
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    thCheckbox.appendChild(selectAllCheckbox);
    thCheckbox.appendChild(document.createTextNode('Seleccionar'));
    filaEncabezado.insertBefore(thCheckbox, filaEncabezado.firstChild);
    tabla.appendChild(filaEncabezado);

    // Solo agregar el encabezado si las columnas deseadas están presentes
    if (columnasFaltantes.length === 0) {
        tabla.appendChild(filaEncabezado);

        funcionsDiv.style.display = 'flex';
    }

   // Evento del checkbox "Seleccionar todas"
    selectAllCheckbox.addEventListener('change', () => {
        const checkboxes = document.querySelectorAll('.checkbox-fila');
        const filas = tabla.getElementsByTagName('tr');

        checkboxes.forEach((checkbox, index) => {
            const fila = filas[index + 1]; // Ajustar para omitir el encabezado
            checkbox.checked = selectAllCheckbox.checked && fila.style.display !== 'none';
        });
    });

    // Añadir encabezado "Producto Faltante"
    const thProductoFaltante = document.createElement('th');
    thProductoFaltante.textContent = 'Producto Faltante'; 
    filaEncabezado.appendChild(thProductoFaltante); 
    tabla.appendChild(filaEncabezado);

    // Asignar el evento al botón de "Filtrar Datos"
    botonFiltrar.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.checkbox-fila');
        const filas = tabla.getElementsByTagName('tr');

        console.log("Iniciando ocultación de filas...");

        // Ocultar solo las filas seleccionadas
        for (let i = 1; i < filas.length; i++) { // Comenzar en 1 para omitir el encabezado
            const checkbox = checkboxes[i - 1]; // Ajustar el índice para las filas
            const fila = filas[i];

            if (checkbox.checked && fila.style.display !== 'none') {
                fila.style.display = 'none';
                console.log(`Ocultando fila ${i}: ${fila.innerText}`);
                // estadosFilas[i - 1] = false;
                // checkbox.checked = false;
            }
        }

         // Asegurarse de que las filas no seleccionadas ni ocultadas permanezcan visibles
        for (let i = 1; i < filas.length; i++) {
            const fila = filas[i];

            // Mostrar todas las filas que no están ocultas
            if (fila.style.display === 'none' && checkboxes[i - 1].checked === false) {
                fila.style.display = ''; // Mostrar filas que no fueron ocultadas
            }
        }

        campoFiltro.value = '';
        selectAllCheckbox.checked = false;
    });

    // Agregar evento de doble clic al botón de ocultar datos
    botonFiltrar.addEventListener('dblclick', () => {
        const filas = tabla.getElementsByTagName('tr');

        // Mostrar todas las filas
        for (let i = 1; i < filas.length; i++) { // Comenzar en 1 para omitir el encabezado
            filas[i].style.display = ''; // Mostrar fila
            estadosFilas[i - 1] = true; // Marcar fila como visible
        }

        // Limpiar los checkboxes después de mostrar todas las filas
        const checkboxes = document.querySelectorAll('.checkbox-fila');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false; // Desmarcar todos los checkboxes
        });
          // Limpiar el campo de filtro
        campoFiltro.value = ''; 
    });

    // Crear filas de datos
    for (let i = 8; i < datos.length; i++) {
        const fila = datos[i];
        const tr = document.createElement('tr');

           // Marca la fila como visible
        estadosFilas.push(true); // Agregar estado de fila

        // Checkbox para cada fila
        const tdCheckbox = document.createElement('td');
        const checkboxFila = document.createElement('input');
        checkboxFila.type = 'checkbox';
        checkboxFila.className = 'checkbox-fila'; // Clase para seleccionar filas
        tdCheckbox.appendChild(checkboxFila);
        tr.appendChild(tdCheckbox);

        indicesColumnas.forEach(indice => {
            const td = document.createElement('td');
            td.textContent = fila[indice]; // Mostrar solo los datos de las columnas deseadas
            tr.appendChild(td);
        });

        tabla.appendChild(tr);
    }

    // Mostrar el campo de filtro y el botón
    campoFiltro.style.display = '';
    campoTopeMaximo.style.display = ''; 
    botonFiltrar.style.display = ''; 

    // Llamar a la función para manejar el tope máximo
    manejarTopeMaximo(tabla);

    // Añadir evento de filtrado
    const indicesFiltrar = [1, 2, 8, 11, 12]
    campoFiltro.addEventListener('input', () => {
        const valorFiltro = campoFiltro.value.toLowerCase(); // Obtener el texto del campo de filtro
        const filas = tabla.getElementsByTagName('tr'); // Obtener todas las filas de la tabla

        // console.log(`Filtrando por: "${valorFiltro}"`);

        for (let i = 1; i < filas.length; i++) { // Comenzar en 1 para omitir el encabezado
            const fila = filas[i];
            const celdas = fila.getElementsByTagName('td');
            let mostrarFila = false;

            // Verificar solo las columnas especificadas
            for (let j of indicesFiltrar) {
                if (j < celdas.length && celdas[j].textContent.toLowerCase().includes(valorFiltro)) {
                    mostrarFila = true;
                    break;
                }
            }

            fila.style.display = mostrarFila ? '' : 'none'; // Mostrar u ocultar la fila

            // Ajustar el estado del checkbox
            // const checkbox = filas[i].querySelector('.checkbox-fila');
            const checkbox = fila.querySelector('.checkbox-fila');
            checkbox.checked = false;
        }
    });
}

// Función para calcular productos faltantes
function manejarTopeMaximo(tabla) {
    campoTopeMaximo.addEventListener('input', () => {
        const topeMaximo = parseFloat(campoTopeMaximo.value);
        const filas = tabla.getElementsByTagName('tr');

        for (let i = 1; i < filas.length; i++) {
            const fila = filas[i];
            const celdas = fila.getElementsByTagName('td');
            const cantidadInventarioFinal = parseFloat(celdas[3].textContent); // Índice de la columna "cantidad inventario final"

            const tdProductoFaltante = fila.querySelector('.producto-faltante') || document.createElement('td');
            tdProductoFaltante.className = 'producto-faltante'; // Clase para la nueva celda
            if (!fila.contains(tdProductoFaltante)) {
                fila.appendChild(tdProductoFaltante); // Añadir la nueva celda a la fila
            }

            if (!isNaN(topeMaximo)) {
                const cantidadFaltante = topeMaximo - cantidadInventarioFinal;

                if (cantidadFaltante > 0) {
                    tdProductoFaltante.textContent = `Faltan ${cantidadFaltante}`;
                    tdProductoFaltante.style.backgroundColor = '#ff9999';
                } else if (cantidadFaltante == 0){
                    tdProductoFaltante.textContent = `Bien ${cantidadFaltante}`;
                    tdProductoFaltante.style.backgroundColor = '#ecf890';

                } else {
                    tdProductoFaltante.textContent = `Suficiente ${Math.abs(cantidadFaltante)}`;
                    tdProductoFaltante.style.backgroundColor = '#94e195';
                }
            } else {
                tdProductoFaltante.textContent = ''; // Limpiar si el tope no es un número
                tdProductoFaltante.style.backgroundColor = '';
            }
        }
    });
}

//Guardar datos en un acrhivo excel
// Obtener elementos

const modal = document.getElementById('modal');
const btnAbrirModal = document.getElementById('abrir-modal');
const btnCerrarModal = document.getElementsByClassName('cerrar')[0];

// Abrir la modal
btnAbrirModal.onclick = function() {
    modal.style.display = 'block';
}

// Cerrar la modal
btnCerrarModal.onclick = function() {
    modal.style.display = 'none';
}

// Cerrar la modal al hacer clic fuera de ella
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Evento para guardar la tabla como Excel
document.getElementById('guardar-excel').addEventListener('click', () => {
    const nombreArchivo = document.getElementById('nombre-archivo').value || 'datos_tabla';
    const tabla = document.getElementById('data-table');
    const wb = XLSX.utils.table_to_book(tabla, { sheet: "Datos" });
    XLSX.writeFile(wb, `${nombreArchivo}.xlsx`);
    
    // Cerrar la modal después de guardar
    modal.style.display = 'none';
});


// Evento para guardar la tabla como PDF Función con htmljs
document.getElementById('guardar-pdf').addEventListener('click', () => {
    const nombreArchivo = document.getElementById('nombre-archivo').value || 'datos_tabla';
    const tabla = document.getElementById('data-table');

    // Ocultar la primera columna (columna 0)
    const columna0 = tabla.querySelectorAll('tr td:nth-child(1), tr th:nth-child(1)');
    columna0.forEach(cell => {
        cell.style.display = 'none'; // Ocultar la primera columna
    });

    // Usar html2pdf para generar el PDF
    const opt = {
        margin:       2,
        filename:     `${nombreArchivo}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, logging: false, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak:    { mode: 'avoid-all', before: '.avoid-page-break' }, // Aquí ajustamos el salto de página
        html2canvas: {
            letterRendering: true,  // Asegura una renderización adecuada de los caracteres
            scale: 2,               // Escala para mayor calidad
            useCORS: true,          // Habilita CORS
        },
    };

    html2pdf()
        .from(tabla)
        .set(opt)
        .save()
        .then(() => {
            // Restaurar la primera columna después de la captura
            columna0.forEach(cell => {
                cell.style.display = ''; // Restaurar la visibilidad de la columna
            });
        });

    modal.style.display = 'none'; // Asegúrate de que modal esté definido
});

// Obtener el botón de agrupar
const botonAgrupar = document.getElementById('boton-agrupar');

// Obtener el elemento de la modal y el botón de cierre
const modalAgrupar = document.getElementById('modalDatosAgrupados');
const filtroNombre = document.getElementById('filtroNombre');
const closeModal = document.getElementById('closeModal');
const closeBtn = document.getElementById('closeBtn');
const ocultarBtn = document.getElementById('ocultarBtn');
const seleccionarTodosBtn = document.getElementById('seleccionarTodosBtn');

let filasAgrupadas = []; //Almacenar todas las filas agrupadas
let filasOcultas = []; // Alamcenar las filas que se han ocultado

// Evento para agrupar los datos
botonAgrupar.addEventListener('click', () => {
    const tabla = document.getElementById('data-table');
    const filas = tabla.getElementsByTagName('tr');
    
    // Crear un objeto para almacenar los datos agrupados
    const datosAgrupados = {};

    // Procesar las filas (empezamos desde 1 para omitir el encabezado)
    for (let i = 1; i < filas.length; i++) {
        const fila = filas[i];
        const celdas = fila.getElementsByTagName('td');

        const nombre = celdas[2].textContent.trim(); // El nombre está en la columna 2 (índice 2)
        const cantidadInventarioFinal = parseFloat(celdas[3].textContent.trim()); // La cantidad está en la columna 3 (índice 3)

        if (nombre && !isNaN(cantidadInventarioFinal)) {
            // Si ya existe el nombre en el objeto, sumamos la cantidad
            if (datosAgrupados[nombre]) {
                datosAgrupados[nombre] += cantidadInventarioFinal;
            } else {
                // Si no existe el nombre, lo añadimos al objeto
                datosAgrupados[nombre] = cantidadInventarioFinal;
            }
        }
    }

    // Obtener el valor del "Tope Máximo" desde un campo de entrada
    const topeMaximoInput = document.getElementById('tope-maximo');
    const topeMaximo = parseFloat(topeMaximoInput.value); // Convertir a número

    // Verificar si el valor del Tope Máximo es válido
    if (isNaN(topeMaximo) || topeMaximo <= 0) {
        alert("Por favor, ingrese un Tope Máximo válido (número positivo).");
        return;
    }

    // Limpiar la tabla dentro de la modal antes de llenarla
    const tablaAgrupada = document.getElementById('tablaAgrupada').getElementsByTagName('tbody')[0];
    tablaAgrupada.innerHTML = '';
    filasAgrupadas = [];

    // Crear filas agrupadas con las cantidades sumadas
    for (const nombre in datosAgrupados) {
        const tr = document.createElement('tr');

        //Crear una celda con una casilla de seleccionar
        const tdSeleccionar = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        tdSeleccionar.appendChild(checkbox);

        //Crear las celdas para el nombre y la cantidad
        const tdNombre = document.createElement('td');
        tdNombre.textContent = nombre;
        
        const tdCantidad = document.createElement('td');
        tdCantidad.textContent = datosAgrupados[nombre];
        
        // Calcular el "Producto Faltante"
        const cantidadFaltante = topeMaximo - datosAgrupados[nombre];
        const tdProductoFaltante = document.createElement('td');
        
        if (cantidadFaltante > 0) {
            tdProductoFaltante.textContent = `Faltan ${cantidadFaltante}`;
            tdProductoFaltante.style.backgroundColor = '#ff9999'; // Color de alerta (rojo claro)
        } else if (cantidadFaltante === 0) {
            tdProductoFaltante.textContent = `Bien ${cantidadFaltante}`;
            tdProductoFaltante.style.backgroundColor = '#ecf890'; // Color verde claro
        } else {
            tdProductoFaltante.textContent = `Suficiente ${Math.abs(cantidadFaltante)}`;
            tdProductoFaltante.style.backgroundColor = '#94e195'; // Color verde (exceso de inventario)
        }
        
        tr.appendChild(tdSeleccionar);
        tr.appendChild(tdNombre);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdProductoFaltante); // Añadir la columna de "Producto Faltante"
        tablaAgrupada.appendChild(tr);

        filasAgrupadas.push(tr);
    }

    // Mostrar la modal después de agregar los datos
    modalAgrupar.style.display = 'block';
});

// Filtrar las filas por nombre cuando el usuario escriba en el campo de búsqueda
// filtroNombre.addEventListener('input', () => {
//     const filtroValor = filtroNombre.value.trim().toLowerCase();
    
//     filasAgrupadas.forEach(fila => {
//         const nombreCelda = fila.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
        
//         // Mostrar o ocultar la fila según si coincide con el filtro
//         if (nombreCelda.includes(filtroValor)) {
//             fila.style.display = '';
//         } else {
//             fila.style.display = 'none';
//         }
//     });
// });

// Filtrar las filas por nombre o producto faltante cuando el usuario escriba en el campo de búsqueda
filtroNombre.addEventListener('input', () => {
    const filtroValor = filtroNombre.value.trim().toLowerCase();
    
    filasAgrupadas.forEach(fila => {
        const nombreCelda = fila.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
        const productoFaltanteCelda = fila.querySelector('td:nth-child(4)').textContent.trim().toLowerCase(); // Producto Faltante está en la columna 4
        
        // Mostrar o ocultar la fila según si coincide con el filtro en nombre o producto faltante
        if (nombreCelda.includes(filtroValor) || productoFaltanteCelda.includes(filtroValor)) {
            fila.style.display = ''; // Mostrar fila
        } else {
            fila.style.display = 'none'; // Ocultar fila
        }
    });
});

// Botón para seleccionar todas las filas filtradas
seleccionarTodosBtn.addEventListener('click', () => {
    const filasVisibles = Array.from(filasAgrupadas).filter(fila => fila.style.display !== 'none');
    filasVisibles.forEach(fila => {
        const checkbox = fila.querySelector('input[type="checkbox"]');
        checkbox.checked = true; // Seleccionar las filas visibles
    });
});

// Ocultar las filas seleccionadas al hacer clic en el botón "Ocultar Seleccionados"
ocultarBtn.addEventListener('click', () => {
    const filas = document.getElementById('tablaAgrupada').getElementsByTagName('tr');
    for (let i = 0; i < filas.length; i++) {
        const fila = filas[i];
        const checkbox = fila.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            fila.style.display = 'none'; // Ocultar la fila si está seleccionada
            filasOcultas.push(fila); // Guardar las filas ocultas
        }
    }

    // Almacenar las filas ocultas
    filasOcultas.forEach(fila => {
        filasAgrupadas = filasAgrupadas.filter(f => f !== fila); // Eliminar las filas ocultadas de filasAgrupadas
    });

    actualizarTabla();
});

function actualizarTabla() {
    filasAgrupadas.forEach(fila => {
        fila.style.display = '';
    })
}

// Cerrar la modal al hacer clic en la "X"
closeModal.addEventListener('click', () => {
    modalAgrupar.style.display = 'none';
    filtroNombre.value = '';
});

// Cerrar la modal al hacer clic en el botón "Cerrar"
// closeBtn.addEventListener('click', () => {
//     modalAgrupar.style.display = 'none';
// });

// Cerrar la modal si el usuario hace clic fuera de la modal
window.addEventListener('click', (event) => {
    if (event.target === modalAgrupar) {
        modalAgrupar.style.display = 'none';
        filtroNombre.value = '';
    }
});

document.getElementById('descargarExcel').addEventListener('click', function() {
    // Obtener la tabla
    const tabla = document.getElementById('tablaAgrupada');
    
    // Crear un array de filas para almacenar los datos
    const filasExcel = [];

    // Obtener los encabezados de la tabla
    const encabezado = tabla.getElementsByTagName('tr')[0];
    const celdasEncabezado = encabezado.getElementsByTagName('th');

    const encabezadoData = [];
    for (let j = 1; j < celdasEncabezado.length; j++) {
        encabezadoData.push(celdasEncabezado[j].textContent.trim());
    }
    filasExcel.push(encabezadoData);
    
    // Obtener las filas de la tabla (sin contar la primera columna de selección)
    const filas = tabla.getElementsByTagName('tr');
    
    // Iterar por cada fila de la tabla (empezamos desde 1 para omitir el encabezado)
    for (let i = 1; i < filas.length; i++) {
        const fila = filas[i];
        
        // Comprobar si la fila está visible
        if (fila.style.display !== 'none') {
            const celdas = fila.getElementsByTagName('td');
            const filaData = [];
        
            // Iterar por cada celda de la fila y almacenar los datos (omitiendo la primera columna)
            for (let j = 1; j < celdas.length; j++) {  // Empezamos en j = 1 para omitir la columna de selección (índice 0)
                filaData.push(celdas[j].textContent.trim());
            }
             // Agregar los datos de la fila al array de filas
            filasExcel.push(filaData);
        }
    }

    // Crear una hoja de Excel a partir de los datos
    const ws = XLSX.utils.aoa_to_sheet(filasExcel);

    // Crear un libro de trabajo con la hoja
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'reporte de productos.xlsx');
});




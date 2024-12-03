// Variable para almacenar el tipo de datos seleccionado (emitidos o recibidos)
let tipoDatos = 'emitido';  // Por defecto, 'emitido'

// Función para leer los datos de un archivo Excel
function leerArchivoExcel(archivo, cabeceraFila, tipoDatos) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const datos = e.target.result;
            const libro = XLSX.read(datos, { type: 'binary' });
            const hoja = libro.Sheets[libro.SheetNames[0]]; // Tomamos la primera hoja
            const filas = XLSX.utils.sheet_to_json(hoja, { header: 1 }); // Convertimos la hoja en un array de arrays

            const cabeceras = filas[cabeceraFila] || []; // Extraemos las cabeceras
            const datosRestantes = filas.slice(cabeceraFila + 1); // Obtenemos las filas de datos

            // Normalizar las cabeceras antes de buscar la columna 'grupo'
            const cabecerasNormalizadas = normalizarCabeceras(cabeceras);

            resolve({ cabeceras, datos: datosRestantes });
        };

        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(archivo);
    });
}

// Función para normalizar las cabeceras (a minúsculas, quitar acentos y espacios)
function normalizarCabeceras(cabeceras) {
    return cabeceras.map(columna => columna.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
}

// Función para obtener el índice de una columna por su nombre
function obtenerIndiceColumna(cabeceras, nombreColumna) {
    const indice = cabeceras.indexOf(nombreColumna);
    // if (indice === -1) {
    //     console.error(`Columna "${nombreColumna}" no encontrada en las cabeceras.`);
    // }
    return indice;
}

// Función para mostrar el toggle después de seleccionar el archivo de la DIAN
function mostrarTipoDatos() {
    const archivo2 = document.getElementById('archivo2').files[0];
    
    if (archivo2) {
        // Mostrar el toggle switch para seleccionar "emitidos" o "recibidos"
        document.getElementById('toggleContainer').style.display = 'block';
    }
}
// Agregar un event listener para cuando se seleccione el archivo 2 (archivo de la DIAN)
document.getElementById('archivo2').addEventListener('change', mostrarTipoDatos);

// Función para manejar el cambio en el toggle (emitidos/recibidos)
function actualizarTipoDatos() {
    const tipoDatosSwitch = document.getElementById('tipoDatos');
    const tipoTexto = document.getElementById('tipoTexto');

    if (tipoDatosSwitch.checked) {
        tipoDatos = 'recibido';
        tipoTexto.textContent = 'Recibidos';
    } else {
        tipoDatos = 'emitido';
        tipoTexto.textContent = 'Emitidos';
    }

    mostrarConsistencias();
}

// 1. Definición de la función concatenarPrefijoYFolio
function concatenarPrefijoYFolio(datosArchivo2, cabecerasNormalizadasArchivo2) {
    // Obtener los índices de las columnas 'prefijo' (D) y 'folio' (C)
    const prefijoIndex = cabecerasNormalizadasArchivo2.indexOf('Prefijo');
    const folioIndex = cabecerasNormalizadasArchivo2.indexOf('Folio');

    // Si no se encuentran las columnas 'prefijo' o 'folio', lanzar un error
    if (prefijoIndex === -1 || folioIndex === -1) {
        console.error('No se encontraron las columnas "prefijo" o "folio" en el archivo 2.');
        alert('No se encontraron las columnas "prefijo" o "folio" en el archivo 2.');
        return;
    }

    // Añadir la nueva columna 'numfactura' concatenando 'prefijo' y 'folio'
    datosArchivo2.forEach(fila => {
        const prefijo = fila[prefijoIndex]?.toString().trim() || '';
        const folio = fila[folioIndex]?.toString().trim() || '';

        // Si el prefijo está vacío, usamos solo el folio
        const numfactura = prefijo ? prefijo + folio : folio;

        fila.push(numfactura);  // Añadimos el valor concatenado (o solo folio) al final de la fila
       
    });

    return datosArchivo2;
}

// Función para convertir fechas del formato 'YYYY-MM-DD HH:MM:SS' a 'DD-MM-YYYY'
function formatearFecha(fecha) {
    // Si la fecha es válida y no es un valor nulo
    if (fecha && !isNaN(new Date(fecha))) {
        const fechaObj = new Date(fecha);
        
        // Obtener los componentes de la fecha
        const dia = String(fechaObj.getDate()).padStart(2, '0'); // Día con 2 dígitos
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Mes con 2 dígitos (Mes empieza desde 0)
        const anio = fechaObj.getFullYear(); // Año con 4 dígitos
        
        return `${dia}-${mes}-${anio}`; 
    }
    return fecha; 
}

let cabecerasNormalizadasArchivo1 = [];
let cabecerasNormalizadasArchivo2 = [];

// Variables globales
let diferencias = [];
let filasConsistentes = [];

// Función para eliminar contenido entre guiones y los guiones
function eliminarGuionesYContenido(factura) {
    console.log('Factura:', factura);  // Esto te mostrará el valor de la factura antes de la verificación
    if (typeof factura === 'string') {
        return factura.replace(/_[^_]*_/g, '');  // Elimina los guiones bajos y el texto entre ellos
    }
    return factura;
}

let coincidencias = []; // Nueva variable para almacenar las filas coincidentes

async function compararArchivos() { 
    const archivo1 = document.getElementById('archivo1').files[0];
    const archivo2 = document.getElementById('archivo2').files[0];

    // Verificar si los archivos están seleccionados
    if (!archivo1) {
        console.error("No se ha seleccionado el archivo 1.");
        alert("No se ha seleccionado el archivo de Globpin");
        return;
    }
    if (!archivo2) {
        console.error("No se ha seleccionado el archivo 2.");
        alert("No se ha seleccionado el archivo de la DIAN");
        return;
    }

    try {
        // Leer los archivos
        const { cabeceras: cabecerasArchivo1, datos: datosArchivo1 } = await leerArchivoExcel(archivo1, 12, tipoDatos);
        console.log("Datos archivo1", datosArchivo1);
        const { cabeceras: cabecerasArchivo2, datos: datosArchivo2 } = await leerArchivoExcel(archivo2, 0, tipoDatos);
        console.log("Datos archivo2", datosArchivo2);

        // Eliminar guiones y contenido de las facturas (ítem 1 de cada fila) SOLO en archivo 1
        datosArchivo1.forEach(fila => {
            // Asegurarse de que la factura esté en el índice 1 en archivo 1
            fila[1] = eliminarGuionesYContenido(fila[1]); // Eliminar guiones en la columna de factura en archivo 1
        });

        // Normalizar las cabeceras
        const cabecerasNormalizadasArchivo1 = normalizarCabeceras(cabecerasArchivo1);
        const cabecerasNormalizadasArchivo2 = normalizarCabeceras(cabecerasArchivo2);

        // Filtrar los datos del archivo 2 según el tipo
        const grupoColumnaIndexArchivo2 = cabecerasNormalizadasArchivo2.indexOf('grupo');
        const datosArchivo2ConNumFactura = concatenarPrefijoYFolio(datosArchivo2, cabecerasArchivo2);
        const datosFiltradosArchivo2 = datosArchivo2ConNumFactura.filter(fila => {
            const grupo = fila[grupoColumnaIndexArchivo2]?.toString().trim().toLowerCase();
            return grupo === tipoDatos;
        });

        // Comparar las filas
        console.log("Inicio de la comparación de archivos");

        for (let i = 0; i < datosFiltradosArchivo2.length; i++) {
            const filaArchivo2 = datosFiltradosArchivo2[i];
            const numfactura2 = filaArchivo2[filaArchivo2.length - 1];  // Obtener numfactura

            //Condición para que cuando en la factura2 se encuentre una dato que empiza con "E0" se omita del reporte
            if (numfactura2.startsWith("E0")) {
                continue;  // Salta a la siguiente iteración sin que el ciclo se pare
            }

            const filaArchivo1 = buscarFilaCorrespondiente(filaArchivo2, datosArchivo1, cabecerasNormalizadasArchivo1, cabecerasNormalizadasArchivo2);

            if (filaArchivo1) {
                // Comparar las filas y obtener diferencias
                const diferenciasFila = compararFilas(filaArchivo1, filaArchivo2, cabecerasNormalizadasArchivo1, cabecerasNormalizadasArchivo2);
                if (diferenciasFila.length > 0) {
                    diferencias.push(...diferenciasFila);
                } else {
                    // Si no hay diferencias, almacenar las filas como coincidentes
                    coincidencias.push({ archivo1: filaArchivo1, archivo2: filaArchivo2 });
                    // console.log("Coincidencias encontradas", coincidencias);
                }
            } else {
                // Si no se encuentra la fila correspondiente, agregar mensaje
                diferencias.push(`<div class="diferencia-error">No se encontró la factura ${numfactura2} en el archivo de Globpin</div>`);
            }
        }

        // Mostrar las diferencias
        const reporte = document.getElementById('resultado');
        if (diferencias.length > 0) {
            reporte.innerHTML = diferencias.join("");  // Usamos innerHTML para insertar HTML
        } else {
            reporte.innerHTML = "<div class='sin-diferencias'>No se encontraron diferencias.</div>";
        }

        // Mostrar el botón de ver consistencias después de la comparación
        const botonVerConsistencias = document.getElementById('verSinDiferencias');
        botonVerConsistencias.style.display = 'inline-block';  // Mostrar el botón
        
        // Mostrar el botón de descargar Inf.Excel
        const botonDescargar = document.getElementById('descargarReporte');
        botonDescargar.style.display = 'inline-block'; 
        botonDescargar.onclick = () => descargarReporte('diferencias');

    } catch (error) {
        console.error("Error al leer los archivos:", error);
    }
}


function buscarFilaCorrespondiente(filaArchivo2, datosArchivo1, cabecerasNormalizadasArchivo1, cabecerasNormalizadasArchivo2) {
    // Obtenemos los valores clave de la fila del archivo 2
    const numfactura2 = filaArchivo2[filaArchivo2.length - 1];  // Número de factura (asumido)

    // Buscar la fila correspondiente en archivo 1
    return datosArchivo1.find(fila => {
        const numfactura1 = fila[obtenerIndiceColumna(cabecerasNormalizadasArchivo1, 'factura')];
        // Comparar numfactura
        return numfactura1 === numfactura2;
    });
}

// Función para comparar las filas
function compararFilas(filaArchivo1, filaArchivo2, cabecerasNormalizadasArchivo1, cabecerasNormalizadasArchivo2) {
    let diferencias = [];

    // Obtener datos de ambos archivos
    const factura1 = eliminarGuionesYContenido(filaArchivo1[obtenerIndiceColumna(cabecerasNormalizadasArchivo1, 'factura')]);
    const fecha1Index = obtenerIndiceColumna(cabecerasNormalizadasArchivo1, 'feacha');
    const fecha1 = fecha1Index !== -1 ? filaArchivo1[fecha1Index] : filaArchivo1[obtenerIndiceColumna(cabecerasNormalizadasArchivo1, 'fecha')];
    const nit1 = filaArchivo1[obtenerIndiceColumna(cabecerasNormalizadasArchivo1, 'nit')];
    const tercero1 = filaArchivo1[obtenerIndiceColumna(cabecerasNormalizadasArchivo1, 'tercero')];
    const total1 = filaArchivo1[obtenerIndiceColumna(cabecerasNormalizadasArchivo1, 'total')];

    const fecha1Formateada = formatearFecha(fecha1);

    const factura2 = filaArchivo2[filaArchivo2.length - 1];
    const fecha2 = filaArchivo2[obtenerIndiceColumna(cabecerasNormalizadasArchivo2, 'fecha emision')];
    const nit2 = filaArchivo2[obtenerIndiceColumna(cabecerasNormalizadasArchivo2, tipoDatos === 'emitido' ? 'nit receptor' : 'nit emisor')];
    const tercero2 = filaArchivo2[obtenerIndiceColumna(cabecerasNormalizadasArchivo2, tipoDatos === 'emitido' ? 'nombre receptor' : 'nombre emisor')];
    const total2 = filaArchivo2[obtenerIndiceColumna(cabecerasNormalizadasArchivo2, 'total')];

    const fecha2Formateada = fecha2;

    // Función para normalizar texto (eliminar espacios extra y convertir a minúsculas)
    function normalizarTexto(texto) {
        return texto
            .trim()  // Elimina los espacios al principio y al final
            .replace(/\s+/g, ' ')  // Reemplaza múltiples espacios por un solo espacio
            .replace(/S\.A\.S/g, 'SAS')  // Unifica las abreviaturas S.A.S a SAS
            .toLowerCase()  // Convierte todo a minúsculas
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");  // Elimina tildes y caracteres especiales
    }

    // Comparación del campo tercero (se divide en palabras y se compara si todas las palabras del tercero2 están en tercero1)
    function compararNombres(tercero1, tercero2) {
        const palabras1 = normalizarTexto(tercero1).split(' ');  // Convertimos a minúsculas y separamos en palabras
        const palabras2 = normalizarTexto(tercero2).split(' ');  // Lo mismo para el segundo nombre

        const contieneTodasLasPalabras = palabras1.some(palabra => palabras2.includes(palabra)); // Verificamos que todas las palabras estén contenidas

        // Si es una coincidencia, la agregamos a filasConsistentes
        if (contieneTodasLasPalabras) {
            filasConsistentes.push({
                archivo1: filaArchivo1, 
                archivo2: filaArchivo2
            });
            return null;  // No hay diferencia
        } else {
            return `<span class="diferencia">Tercero: ${tercero1} no está contenido en ${tercero2}</span>`;
        }
    }

    // Verificar si la factura fue encontrada en el archivo 1
    if (!factura1) {
        diferencias.push(`<div class="diferencia-error">No se encontró la fila correspondiente a la factura ${factura2} en el archivo 1.</div>`);
    } else {
        // Si se encontró la factura, comparar cada campo
        let bloqueDiferencias = [];

        if (factura1 !== factura2) bloqueDiferencias.push(`<span class="diferencia">Factura: ${factura1} ≠ ${factura2}</span>`);
        if (fecha1Formateada !== fecha2Formateada) bloqueDiferencias.push(`<span class="diferencia">Fecha: ${fecha1Formateada} ≠ ${fecha2Formateada}</span>`);
        if (nit1 != nit2) bloqueDiferencias.push(`<span class="diferencia">Nit: ${nit1} ≠ ${nit2}</span>`);

        // Comparar el campo "tercero" utilizando la nueva función
        const diferenciaTercero = compararNombres(tercero1, tercero2);
        if (diferenciaTercero) bloqueDiferencias.push(diferenciaTercero);

        if (total1 !== total2) bloqueDiferencias.push(`<span class="diferencia">Total: ${total1} ≠ ${total2}</span>`);

        // Si existen diferencias, agregar el bloque de diferencias
        if (bloqueDiferencias.length > 0) {
            diferencias.push(`<div class="diferencia-factura">Diferencias para la factura ${factura2}:</div>`);
            diferencias = diferencias.concat(bloqueDiferencias);
        }
    }

    return diferencias;
}

function mostrarConsistencias() {
    const reporteSinDiferencias = document.getElementById('resultadoSinDiferencias');

    // Verificar que coincidencias tenga datos
    // console.log("Coincidencias:", coincidencias);

    if (coincidencias.length > 0) {
        const consistenciasHTML = coincidencias.map(fila => {
            // Si el tipo de datos es 'recibido', mostramos los índices correspondientes a 'recibido'
            if (tipoDatos === 'recibido') {
                return `
                    <div class="consistencia">
                        <b>Factura 1: ${fila.archivo1[1]} - Factura 2: ${fila.archivo2[16]} </b>
                        <br>
                        <b>Fecha 1:</b> ${fila.archivo1[2]} - <b>Fecha 2:</b> ${fila.archivo2[4]}
                        <br>
                        <b>Nit 1:</b> ${fila.archivo1[3]} - <b>Nit 2:</b> ${fila.archivo2[6]}
                        <br>
                        <b>Tercero 1:</b> ${fila.archivo1[4]} - <b>Tercero 2:</b> ${fila.archivo2[7]}
                        <br>
                        <b>Total 1:</b> ${fila.archivo1[11]} - <b>Total 2:</b> ${fila.archivo2[13]}
                    </div>
                `;
            } else {
                // Si el tipo de datos es 'emitido', mostramos los índices correspondientes a 'emitido'
                return `
                    <div class="consistencia">
                        <b>Factura 1: ${fila.archivo1[1]} - Factura 2: ${fila.archivo2[16]} </b>
                        <br>
                        <b>Fecha 1:</b> ${fila.archivo1[2]} - <b>Fecha 2:</b> ${fila.archivo2[4]}
                        <br>
                        <b>Nit 1:</b> ${fila.archivo1[5]} - <b>Nit 2:</b> ${fila.archivo2[8]}
                        <br>
                        <b>Tercero 1:</b> ${fila.archivo1[6]} - <b>Tercero 2:</b> ${fila.archivo2[9]}
                        <br>
                        <b>Total 1:</b> ${fila.archivo1[21]} - <b>Total 2:</b> ${fila.archivo2[13]}
                    </div>
                `;
            }
        }).join(''); 

        reporteSinDiferencias.innerHTML = consistenciasHTML;
    } else {
        reporteSinDiferencias.innerHTML = "<div class='sin-diferencias'>No se encontraron filas consistentes.</div>";
    }
}


function eliminarEtiquetasHTML(str) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.body.textContent || "";
}

function descargarReporte(tipo) {
    let datosReporte = [];
    let facturaProcesada = new Set();  // Para rastrear las facturas que ya han sido procesadas

    if (tipo === 'diferencias') {
        // Si estamos viendo las diferencias, usamos la variable 'diferencias'
        diferencias.forEach((diferencia) => {
            const diferenciaLimpia = eliminarEtiquetasHTML(diferencia);
            if (diferenciaLimpia.includes("Diferencias para la factura")) {
                const factura = diferenciaLimpia.replace("Diferencias para la factura ", "").replace(":", "");
                if (!facturaProcesada.has(factura)) {
                    facturaProcesada.add(factura);
                    datosReporte.push({ Factura: `Factura ${factura}`, Diferencia: "" });
                }
            } else {
                if (diferenciaLimpia.includes("No se encontró la fila correspondiente")) {
                    const facturaError = diferenciaLimpia.match(/factura (\S+)/);
                    if (facturaError) {
                        datosReporte.push({ Factura: `Factura ${facturaError[1]}`, Diferencia: diferenciaLimpia });
                    }
                } else {
                    datosReporte.push({ Factura: "", Diferencia: diferenciaLimpia });
                }
            }
        });
    } else if (tipo === 'consistencias') {
        // Si estamos viendo las consistencias, usamos la variable 'filasConsistentes'
        coincidencias.forEach((fila) => {
            // Verificar si la fila ya ha sido procesada para evitar duplicados
            const claveFila = `${fila.archivo1[1]}-${fila.archivo2[16]}-${fila.archivo1[2]}-${fila.archivo2[4]}`;
            if (!facturaProcesada.has(claveFila)) {
                facturaProcesada.add(claveFila);
                // Añadir la fila si no ha sido procesada
                if (tipoDatos === 'recibido') {
                    datosReporte.push({
                        Factura1: fila.archivo1[1],
                        Factura2: fila.archivo2[16],
                        Fecha1: fila.archivo1[2],
                        Fecha2: fila.archivo2[4],
                        Nit1: fila.archivo1[3],
                        Nit2: fila.archivo2[6],
                        Total1: fila.archivo1[11],
                        Total2: fila.archivo2[13]
                    });
                } else {
                    datosReporte.push({
                        Factura1: fila.archivo1[1],
                        Factura2: fila.archivo2[16],
                        Fecha1: fila.archivo1[2],
                        Fecha2: fila.archivo2[4],
                        Nit1: fila.archivo1[5],
                        Nit2: fila.archivo2[8],
                        Total1: fila.archivo1[21],
                        Total2: fila.archivo2[13]
                    });
                }
            }
        });
    }

    // Convertir los datos a una hoja de Excel
    const ws = XLSX.utils.json_to_sheet(datosReporte);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'reporte_conciliador.xlsx');
}


document.getElementById('verDiferencias').addEventListener('click', function() {
    const reporteDiferencias = document.getElementById('resultado');
    const reporteSinDiferencias = document.getElementById('resultadoSinDiferencias');
    const tituloReporte = document.getElementById('tituloReporte');
    const verSinDiferenciasBtn = document.getElementById('verSinDiferencias');
    const verDiferenciasBtn = document.getElementById('verDiferencias');
    const botonDescargar = document.getElementById('descargarReporte');

    // Cambiar el título y mostrar las diferencias
    tituloReporte.innerText = "Diferencias Encontradas"; // Cambiar título
    verSinDiferenciasBtn.style.display = 'inline-block';  // Mostrar el botón de ver consistencias
    verDiferenciasBtn.style.display = 'none';  // Ocultar el botón de volver a diferencias
    reporteDiferencias.style.display = 'block';  // Asegurarse de que el contenedor de diferencias esté visible
    reporteSinDiferencias.style.display = 'none';  // Ocultar las consistencias

    botonDescargar.style.display = 'inline-block';
    botonDescargar.onclick = () => descargarReporte('diferencias');
});

document.getElementById('verSinDiferencias').addEventListener('click', function() {
    const reporteDiferencias = document.getElementById('resultado');
    const reporteSinDiferencias = document.getElementById('resultadoSinDiferencias');
    const tituloReporte = document.getElementById('tituloReporte');
    const verSinDiferenciasBtn = document.getElementById('verSinDiferencias');
    const verDiferenciasBtn = document.getElementById('verDiferencias');
    const botonDescargar = document.getElementById('descargarReporte');
    // Cambiar el título y mostrar las consistencias
    tituloReporte.innerText = "Coincidencias Encontradas"; // Cambiar título
    verSinDiferenciasBtn.style.display = 'none';  // Ocultar el botón de ver consistencias
    verDiferenciasBtn.style.display = 'inline-block';  // Mostrar el botón de volver a diferencias
    reporteDiferencias.style.display = 'none';  // Ocultar las diferencias
    mostrarConsistencias();  // Llamar a la función para mostrar las consistencias
    reporteSinDiferencias.style.display = 'block';  // Asegurarse de que el contenedor de consistencias esté visible

    botonDescargar.style.display = 'inline-block';
    botonDescargar.onclick = () => descargarReporte('consistencias');
});

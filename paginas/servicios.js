document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los botones de abrir modales
    var openModalButtons = document.querySelectorAll('.open-modal');
    
    // Obtener todos los botones de cerrar modales
    var closeModalButtons = document.querySelectorAll('.close');
    
    // Mostrar el modal
    openModalButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            var modalId = button.getAttribute('data-modal');
            var modal = document.getElementById(modalId);
            modal.style.display = 'block';
        });
    });

    // Ocultar el modal
    closeModalButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var modalId = button.getAttribute('data-modal');
            var modal = document.getElementById(modalId);
            modal.style.display = 'none';
        });
    });

    // Cerrar el modal si se hace clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});

//Funcion para poner las primeras letras del nombre en mayuscula (Formulario)
function capitalizeWords() {
    const input = document.getElementById('nom');
    const value = input.value;

    // Capitaliza la primera letra de cada palabra
    input.value = value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Validar datos formulario  cambio forms por datos
// codigo normal::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// const form = document.getElementById('forms');
// form.addEventListener('submit', (e) => {
//     e.preventDefault(); // Evitar el envío por defecto

//     const formData = new FormData(form);
//     for (const [key, value] of formData.entries()) {
//         console.log(`${key}: ${value}`); // Imprimir los datos en consola
//     }

//     // const formData = new FormData(form); // Usar 'form' en lugar de 'this'

//     fetch('/validar', {
//         method: 'POST',
//         body: formData, // Enviar los datos del formulario
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             // form.reset(); // Limpiar el formulario
//             document.getElementById('mensajeExito').style.display = 'block';  // Mostrar mensaje de éxito 
//             document.getElementById('forms').reset();
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// });


//codigo actualizado :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// const form = document.getElementById('forms');
// form.addEventListener('submit', (e) => {
//     e.preventDefault(); // Evitar el envío por defecto

//     const formData = new FormData(form);
//     for (const [key, value] of formData.entries()) {
//         console.log(`${key}: ${value}`); // Imprimir los datos en consola
//     }

//     fetch('/validar', {
//         method: 'POST',
//         body: formData, // Enviar los datos del formulario
//     })
//     .then(response => {
//         if (!response.ok) { // Verificar si la respuesta es correcta
//             throw new Error('Error en la red');
//         }
//         return response.json(); // Convertir a JSON
//     })
//     .then(data => {
//         if (data.success) {
//             document.getElementById('mensajeExito').style.display = 'block'; // Mostrar mensaje de éxito
//             form.reset(); // Limpiar el formulario
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// });
function enviarWhatsApp() {
    const usuario = document.getElementById('nom').value;
    const cedula = document.getElementById('ced').value;
    const contacto = document.getElementById('cel').value;
    const placa = document.getElementById('placa').value;
    const fecha = document.getElementById('fec').value;
    const servicio = document.getElementById('servicio').value;
    const vehiculo = document.getElementById('vehiculo').value;

    const mensaje = `Hola, deseo agendar una cita con ustedes. Adjuntaré mis datos: \n**Usuario:** ${usuario} \n**Cédula:** ${cedula} \n**Contacto:** ${contacto} \n**Placa:** ${placa} \n**Fecha:** ${fecha} \n**Servicio:** ${servicio} \n**Vehículo:** ${vehiculo}`;
    const url = `https://wa.me/573122548016?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');

    // Limpiar el formulario
    document.getElementById('forms').reset();

    // Mostrar el mensaje de éxito
    const mensajeDiv = document.getElementById('mensajeExito');
    mensajeDiv.style.display = 'block';

    // Opcional: Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 3000);
}



//SweetAlert
// $('#btn_agendar').click(function() {
//     Swal.fire({
//         title: "¿Desea agendar su servicio?",
//         //text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Sí, agendar!"
//       }).then((result) => {
//         if (result.isConfirmed) {
//           Swal.fire({
//             title: "Agendado con éxito!",
//             //text: "Your file has been deleted.",
//             icon: "success"
//           });
//         }
//       });
// });


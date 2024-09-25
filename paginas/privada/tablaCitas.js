// const table = document.getElementById("table");
// const modal = document.getElementById("modal");
// const inputs = document.querySelectorAll("input");
// let count = 0;



// window.addEventListener("click", (e) => {
//   if (e.target.matches(".btn-warning")) {
//     let data = e.target.parentElement.parentElement.children;
//     fillData(data);
//     modal.classList.toggle("translate");
//   }

//   if (e.target.matches(".btn-danger")) {
//   modal.classList.toggle("translate");
//   count = 0
//   }
// });

// const fillData = (data) => {
//   for (let index of inputs) {
//     count += 1;
//     index.value = data[count].textContent;
//     console.log(index);
    
//   }
// };

//SweetAlert
// $('#btn_eliminar').click(function() {
//     Swal.fire({
//       title: "Do you want to save the changes?",
//       showDenyButton: true,
//       showCancelButton: true,
//       confirmButtonText: "Save",
//       denyButtonText: `Don't save`
//     }).then((result) => {
//       /* Read more about isConfirmed, isDenied below */
//       if (result.isConfirmed) {
//         Swal.fire("Saved!", "", "success");
//       } else if (result.isDenied) {
//         Swal.fire("Changes are not saved", "", "info");
//       }
//     });
// });


//Codigo bueno 
window.onload = function(){
    if (localStorage.getItem('authenticated') !== 'true'){
        window.location.href = '/citas.html'
    }
};

document.getElementById('singupButton').addEventListener('click', () => {
    window.location.href = '/citas.html';
});

const modal = document.getElementById("modal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.querySelector(".close");




// const conexion = require('../router');

// const listaCitas = "SELECT * FROM citas";
// conexion.query(listaCitas, function(error,lista){
//     if(error){
//         throw error;
//     } else {
//         console.log(lista);
//     }
// });

// document.addEventListener('DOMContentLoaded', () => {
//     fetch('http://localhost:3000/../router')
//         .then(response => response.json())
//         .then(data => {
//             const tbody = document.querySelector('#table tbody');
//             data.forEach(item => {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${index + 1}</td>
//                     <td>${user.nombre}</td>
//                     <td>${user.cedula}</td>
//                     <td>${user.numero_contacto}</td>
//                     <td>${user.placa_vehiculo}</td>
//                     <td>${user.fecha}</td>
//                     <td>${user.tipo_servicio}</td>
//                     <td>${user.tipo_vehiculo}</td>
//                 `;
//                 tbody.appendChild(row);
//             });
//         })
//         .catch(error => console.error('Error:', error));
// });

// Mostrar el modal al hacer clic en cualquier botón de edición
document.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', function() {
        document.getElementById('modal').style.display = 'block';
    });
});

// Cerrar el modal al hacer clic en el botón de cerrar
document.querySelector('.btn-close').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
});



// Funcion para abrir modal 1 vez
// openModalButton.addEventListener("click", () => {
//     modal.classList.remove("translate"); // Quita la clase para mostrar la modal
// });

// closeModalButton.addEventListener("click", () => {
//     modal.classList.add("translate"); // Agrega la clase para ocultar la modal
// });

//Funcion para el botón eliminar
// document.addEventListener('DOMContentLoaded', () => {
//     const tabla = document.getElementById('table');

//     tabla.addEventListener('click', (event) => {
//         if (event.target.closest('.btn_eliminar')) { // Verifica si se hizo clic en el botón de eliminar
//             const fila = event.target.closest('tr'); // Encuentra la fila más cercana
//             if (fila) {
//                 // Aquí puedes hacer una llamada a tu backend para eliminar la cita, si es necesario.
//                 const id = fila.getAttribute('data-id'); // Obtén el ID de la fila

//                 // Aquí puedes agregar el fetch para eliminar en el servidor
//                 fetch(`/citas/${id}`, {
//                     method: 'DELETE',
//                 })
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.success) {
//                         fila.remove(); // Elimina la fila del DOM
//                     }
//                 })
//                 .catch(error => console.error('Error:', error));
//             }
//         }
//     });
// });












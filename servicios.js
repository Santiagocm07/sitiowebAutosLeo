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

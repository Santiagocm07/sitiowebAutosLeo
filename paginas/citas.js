document.getElementById('loginForm').addEventListener('submit', function(event){
    event.preventDefault();

    const password = document.getElementById('password').value;
    const correctPassword = 'autosLeo2024';

    if (password ===correctPassword) {
        localStorage.setItem('authenticated', 'true');
        window.location.href = 'privada/tablaCitas.html';
    } else {
        document.getElementById('message').innerText = 'Contraseña incorrecta, intentalo de nuevo'
    }
});
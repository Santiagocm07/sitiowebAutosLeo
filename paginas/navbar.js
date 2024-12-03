const dropdownLink = document.getElementById('dropdownMenuLink');
const options = document.querySelector('.dropdown-menu');
const pinModal = document.getElementById('pin-modal');
const pinInput = document.getElementById('pin-input');
const submitPin = document.getElementById('submit-pin');
const cancelPin = document.getElementById('cancel-pin');
const overlay = document.getElementById('overlay');

const correctPin = ['1036394885','98709493', '1036393737', '090716', '17328016'];

dropdownLink.addEventListener('click', (e) => {
    e.preventDefault(); 
    overlay.style.display = 'block'; 
    pinModal.style.display = 'block'; 
    options.style.display = 'none';
});

submitPin.addEventListener('click', () => {
    const enteredPin = pinInput.value;
    if (correctPin.includes(enteredPin)) {
        options.style.display = 'block'; 
        overlay.style.display = 'none'; 
        pinModal.style.display = 'none';
        
        pinInput.value = '';
    } else {
        alert('PIN incorrecto. Intenta nuevamente.'); 
        pinInput.value = '';
    }
});

cancelPin.addEventListener('click', () => {
    overlay.style.display = 'none'; 
    pinModal.style.display = 'none'; 
});

window.addEventListener('click', (event) => {
    if (!dropdownLink.contains(event.target) && !pinModal.contains(event.target)) {
        overlay.style.display = 'none'; 
        pinModal.style.display = 'none'; 
    }
});




document.addEventListener('DOMContentLoaded', () => {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const images = document.querySelectorAll('.slider-image');
    const totalImages = images.length;
    let index = 0;

    function showNextImage() {
        index = (index + 1) % totalImages;
        sliderWrapper.style.transform = `translateX(-${index * 100}%)`;
    }

    // Cambiar la imagen cada 3 segundos
    setInterval(showNextImage, 3000);
});

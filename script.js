// Fungsi untuk memicu pembukaan surat dan memutar lagu
function openLetter() {
    // 1. Putar Musik
    const music = document.getElementById('bg-music');
    music.play().catch(error => {
        console.log("Autoplay dicegah oleh browser, namun sudah dihandle via klik.", error);
    });

    // 2. Efek Transisi Amplop menghilang, Konten muncul
    const envelopeContainer = document.getElementById('envelope-container');
    const mainContent = document.getElementById('main-content');

    envelopeContainer.style.transition = 'opacity 0.5s ease';
    envelopeContainer.style.opacity = '0';

    setTimeout(() => {
        envelopeContainer.classList.add('hidden');
        mainContent.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
}

// Logika Image Slider (Galeri Foto)
let currentSlide = 0;

function moveSlide(direction) {
    const slides = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slide').length;

    currentSlide += direction;

    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }

    const offset = -currentSlide * 100;
    slides.style.transform = `translateX(${offset}%)`;
}

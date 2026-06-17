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

// Fungsi untuk membuat 1 butir love jatuh
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart-falling');
    
    // Karakter love pakai emoji atau simbol teks
    heart.innerText = '❤️'; 
    
    // Mengatur posisi horizontal acak (dari kiri 0% sampai kanan 100% layar)
    heart.style.left = Math.random() * 100 + "vw";
    
    // Mengatur ukuran love acak (antara 10px sampai 30px)
    const size = Math.random() * 20 + 10;
    heart.style.fontSize = size + "px";
    
    // Mengatur kecepatan jatuh acak (antara 3 sampai 6 detik)
    const duration = Math.random() * 3 + 3;
    heart.style.animationDuration = duration + "s";
    
    // Mengatur tingkat kegelapan/transparansi acak
    heart.style.opacity = Math.random() * 0.5 + 0.5;
    
    // Masukkan ke dalam HTML body
    document.body.appendChild(heart);
    
    // Hapus elemen love dari memori setelah animasinya selesai (biar HP gak lemot)
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// Modifikasi fungsi openLetter yang lama agar memicu hujan love
// Cari fungsi openLetter() kamu yang lama di script.js, lalu pastikan di dalamnya ada baris interval ini:
const originalOpenLetter = openLetter;
openLetter = function() {
    originalOpenLetter(); // Menjalankan fungsi buka surat & musik yang lama
    
    // Mulai hujan love: bikin love baru setiap 300 milidetik (0.3 detik)
    setInterval(createHeart, 600);
};

// Fungsi untuk memunculkan Halaman Hadiah (Screen 3)
function showGiftPage() {
    const giftSection = document.getElementById('gift-section');
    const btnGoToGift = document.getElementById('btn-go-to-gift');
    
    // Tampilkan section hadiah
    giftSection.classList.remove('hidden');
    
    // Sembunyikan tombol pembukanya agar rapi
    btnGoToGift.style.display = 'none';
    
    // Otomatis scroll ke area hadiah dengan smooth
    setTimeout(() => {
        giftSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Fungsi untuk membuka Kotak Surprise dengan Efek Transisi
function openGift(city) {
    // 1. Cari elemen kotak dan kartu reward yang diklik
    const selectedBox = document.getElementById(`box-${city}`);
    const selectedCard = document.querySelector(`.gift-reward-card.id-${city}`);
    
    // 2. Tambahkan class animasinya
    selectedBox.classList.add('opened');
    
    // 3. Munculkan teks hadiah dengan delay kecil agar efek tutup kotak terbang kelihatan dulu
    setTimeout(() => {
        selectedCard.classList.remove('hidden');
        // Trigger class reveal untuk animasi pop-up smooth
        setTimeout(() => {
            selectedCard.classList.add('reveal');
        }, 50);
    }, 400);
}

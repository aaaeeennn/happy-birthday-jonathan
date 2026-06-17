// ========================================================
// LOGIKA BUKA SURAT & TRANSISI HALAMAN (SUDAH DIGABUNG RAPI)
// ========================================================
function openLetter() {
    // Jalankan animasi buka penutup dan kertas meluncur ke atas (CSS Class)
    document.getElementById('envelope-container').classList.add('open');

    // Mainkan musik latar
    const music = document.getElementById('bg-music');
    music.play().catch(error => {
        console.log("Musik diputar setelah klik interaksi user.", error);
    });

    // Beri jeda 1.8 detik agar kertas kelihatan meluncur naik dulu, baru transisi halaman memudar
    setTimeout(() => {
        const envelopeContainer = document.getElementById('envelope-container');
        const mainContent = document.getElementById('main-content');

        envelopeContainer.style.transition = 'opacity 0.5s ease';
        envelopeContainer.style.opacity = '0';

        setTimeout(() => {
            envelopeContainer.classList.add('hidden');
            mainContent.classList.remove('hidden');
            
            // PANGGIL KUIS DI SINI AGAR SIAP DIMAINKAN
            initQuiz();
            
            // Mulai memicu hujan love berjatuhan: bikin love baru setiap 300 milidetik (0.3 detik)
            setInterval(createHeart, 300);
            
            // Scroll otomatis ke posisi paling atas halaman utama
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
    }, 1800); // Waktu tunggu kertas naik (1.8 detik) sebelum halaman berganti
}

// ========================================================
// EFEK ANIMASI HUJAN LOVE BERJATUHAN
// ========================================================
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart-falling');
    
    // Karakter love menggunakan emoji
    heart.innerText = '❤️'; 
    
    // Mengatur posisi horizontal acak (dari kiri 0% sampai kanan 100% layar)
    heart.style.left = Math.random() * 100 + "vw";
    
    // Mengatur ukuran love acak (antara 10px sampai 30px)
    const size = Math.random() * 20 + 10;
    heart.style.fontSize = size + "px";
    
    // Mengatur kecepatan jatuh acak (antara 3 sampai 6 detik)
    const duration = Math.random() * 3 + 3;
    heart.style.animationDuration = duration + "s";
    
    // Mengatur tingkat transparansi acak
    heart.style.opacity = Math.random() * 0.5 + 0.5;
    
    // Masukkan ke dalam HTML body
    document.body.appendChild(heart);
    
    // Hapus elemen love dari memori setelah animasinya selesai (biar browser/HP gak lemot)
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// ========================================================
// LOGIKA IMAGE SLIDER (GALERI FOTO)
// ========================================================
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

// ========================================================
// FUNGSI UNTUK MEMUNCULKAN HALAMAN HADIAH (SCREEN 3)
// ========================================================
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

// ========================================================
// LOGIKA MEMBUKA KOTAK SURPRISE HADIAH
// ========================================================
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

// ========================================================
// DATABASE PERTANYAAN KUIS INTERAKTIF
// ========================================================
const quizData = [
    {
        question: "Di kota manakah aku/kita melakukan technical site visit ke Waterloo Station & Clapham Junction awal tahun ini? 🏛️",
        options: ["Jakarta", "London", "Edinburgh", "Cambridge"],
        correct: 1 // Indeks ke-1 artinya "London"
    },
    {
        question: "Kapan tanggal ulang tahun pacarmu yang paling ganteng/cantik ini? 🗓️❤️",
        options: ["19 Juni 1995", "30 Maret 1998", "3 September 1963", "6 November 1971"],
        correct: 0 // Indeks ke-0 artinya "19 Juni 1995"
    },
    {
        question: "Apa topik riset disertasi seru yang sedang dikerjakan saat ini? 🎓✨",
        options: ["Intelligent Transport Systems", "Macroscopic Traffic Variables", "Developing Short Term Traffic Flow Forecasting Model", "Civil Infrastructure Evaluation"],
        correct: 2 // Indeks ke-2 artinya "Developing Short Term Traffic Flow..."
    }
];

let currentQuestionIndex = 0;
let correctAnswersCount = 0;

// Fungsi Utama untuk Me-load Kuis Pertama Kali
function initQuiz() {
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    updateLoveMeter(0);
    loadQuestion();
}

// Membuka dan Menampilkan Soal Kuis
function loadQuestion() {
    const questionElement = document.getElementById("quiz-question");
    const optionsContainer = document.getElementById("quiz-options");
    
    // Reset container tombol pilihan
    optionsContainer.innerHTML = "";
    
    let currentQuiz = quizData[currentQuestionIndex];
    questionElement.innerHTML = `Question ${currentQuestionIndex + 1}/${quizData.length}: <br><b>${currentQuiz.question}</b>`;
    
    // Generate tombol pilihan jawaban
    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option-btn");
        button.onclick = () => checkAnswer(index, button);
        optionsContainer.appendChild(button);
    });
}

// Logika Pengecekan Jawaban Benar / Salah
function checkAnswer(selectedIndex, clickedButton) {
    const currentQuiz = quizData[currentQuestionIndex];
    const allButtons = document.querySelectorAll(".option-btn");
    
    // Kunci tombol agar tidak bisa klik dua kali
    allButtons.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === currentQuiz.correct) {
        clickedButton.classList.add("correct");
        correctAnswersCount++;
    } else {
        clickedButton.classList.add("wrong");
        // Beri highlight warna hijau ke jawaban yang benar sebagai koreksi
        allButtons[currentQuiz.correct].classList.add("correct");
    }
    
    // Update ketinggian air di Love Meter secara realtime berdasarkan jawaban benar
    let currentLoveScore = Math.round((correctAnswersCount / quizData.length) * 100);
    updateLoveMeter(currentLoveScore);

    // Delay 1.5 detik lalu lanjut ke pertanyaan berikutnya
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            // Kuis Selesai! Sembunyikan Kuis dan Munculkan Wish Box
            document.getElementById("quiz-area").classList.add("hidden");
            document.getElementById("wish-area").classList.remove("hidden");
            // Otomatis scroll ke area wish box
            document.getElementById("wish-area").scrollIntoView({ behavior: 'smooth' });
        }
    }, 1500);
}

// Fungsi Penggerak Ketinggian Cairan Gelombang Love

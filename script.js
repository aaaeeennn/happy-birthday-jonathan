function openLetter() {
    // Jalankan efek memudar pada amplop
    document.getElementById('envelope-container').classList.add('open');

    // Putar lagu latar
    const music = document.getElementById('bg-music');
    music.play().catch(error => {
        console.log("Autoplay musik dimulai setelah interaksi user.", error);
    });

    // Pindah ke Screen 2 (Main Content) setelah 0.5 detik (pas saat amplop memudar habis)
    setTimeout(() => {
        const envelopeContainer = document.getElementById('envelope-container');
        const mainContent = document.getElementById('main-content');

        envelopeContainer.classList.add('hidden');
        mainContent.classList.remove('hidden');
        
        // Mulai memicu hujan love berjatuhan
        setInterval(createHeart, 300);
        
        // Scroll otomatis ke posisi paling atas halaman utama
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500); // Diubah menjadi 500 milidetik agar instan dan mulus
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

// ========================================================
// DATABASE PERTANYAAN KUIS (Silakan ganti teks/opsi di sini)
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
        correct: 0 // Sesuaikan dengan tanggal ultahmu (Indeks ke-0 = 19 Juni 1995)
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
    
    // Update ketinggian air di Love Meter secara realtime
    let progressPercentage = Math.round(((currentQuestionIndex + 1) / quizData.length) * 100);
    // Persentase air naik dihitung hanya berdasarkan jawaban yang benar total di akhir, atau progres soal
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

// Fungsi Penggerak Ketinggian Cairan Gelombang Love Meter
function updateLoveMeter(percent) {
    const liquid = document.getElementById("love-liquid");
    const percentText = document.getElementById("love-percent");
    
    percentText.innerText = percent + "%";
    
    // Rumus membalikkan koordinat 'top' CSS (100% artinya kosong di paling bawah, 0% artinya penuh di paling atas)
    let topValue = 100 - percent;
    
    // Pengaman animasi agar gelombang lingkarannya tidak keluar bentuk hati saat penuh
    if(topValue <= 0) {
        topValue = -5; 
    }
    
    liquid.style.top = topValue + "%";
}

// ========================================================
// LOGIKA MAKE A WISH BOX & INTEGRASI WHATSAPP
// ========================================================
function sendWishToWhatsApp() {
    const wishText = document.getElementById("wish-text").value;
    
    if (wishText.trim() === "") {
        alert("Tulis wish kamu dulu ya, sayang... ❤️");
        return;
    }
    
    // Masukkan nomor WhatsApp kamu di sini (gunakan kode negara, tanpa tanda + atau spasi)
    // Contoh: "628123456789"
    const myPhoneNumber = "628123456789"; 
    
    // Encode teks agar aman dibaca url browser
    const formattedMessage = encodeURIComponent(`Hai sayang! Ini ucapan Make a Wish ulang tahunku melalui website yang kamu buat:\n\n"${wishText}"\n\nI love you so much! ❤️✨`);
    
    // Buka link WhatsApp API di tab baru
    window.open(`https://api.whatsapp.com/send?phone=${myPhoneNumber}&text=${formattedMessage}`, '_blank');
    
    // Setelah dia mengirim ucapan, buka tombol rahasia menuju kotak hadiah!
    document.getElementById("btn-go-to-gift").classList.remove("hidden");
    document.getElementById("btn-go-to-gift").scrollIntoView({ behavior: 'smooth' });
}

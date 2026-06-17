// ========================================================
// LOGIKA TIUP LILIN KUE & TRANSISI HALAMAN
// ========================================================
let blownCandlesCount = 0;
const totalCandles = 5;

function blowCandle(candleId) {
    const candle = document.getElementById(`candle-${candleId}`);
    
    // Cegah klik ganda pada lilin yang sudah padam
    if (!candle.classList.contains('blown')) {
        candle.classList.add('blown');
        blownCandlesCount++;
        
        // Putar musik otomatis pada klik tiupan lilin pertama
        if (blownCandlesCount === 1) {
            const music = document.getElementById('bg-music');
            music.play().catch(error => {
                console.log("Musik diputar setelah interaksi user.", error);
            });
        }
        
        // Pindah halaman jika kelima lilin sudah sukses mati
        if (blownCandlesCount === totalCandles) {
            setTimeout(() => {
                triggerPageTransition();
            }, 800);
        }
    }
}

function triggerPageTransition() {
    const envelopeContainer = document.getElementById('envelope-container');
    const mainContent = document.getElementById('main-content');

    envelopeContainer.style.transition = 'opacity 0.6s ease';
    envelopeContainer.style.opacity = '0';

    setTimeout(() => {
        envelopeContainer.classList.add('hidden');
        mainContent.classList.remove('hidden');
        
        initQuiz();
        setInterval(createHeart, 300);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
}

// Menjaga kecocokan deklarasi HTML klik agar tidak memicu error
function openLetter() { return; }

// ========================================================
// EFEK ANIMASI HUJAN LOVE BERJATUHAN
// ========================================================
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart-falling');
    heart.innerText = '❤️'; 
    heart.style.left = Math.random() * 100 + "vw";
    
    const size = Math.random() * 20 + 10;
    heart.style.fontSize = size + "px";
    
    const duration = Math.random() * 3 + 3;
    heart.style.animationDuration = duration + "s";
    heart.style.opacity = Math.random() * 0.5 + 0.5;
    
    document.body.appendChild(heart);
    
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
    
    giftSection.classList.remove('hidden');
    btnGoToGift.style.display = 'none';
    
    setTimeout(() => {
        giftSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// ========================================================
// LOGIKA MEMBUKA KOTAK SURPRISE HADIAH
// ========================================================
function openGift(city) {
    const selectedBox = document.getElementById(`box-${city}`);
    const selectedCard = document.querySelector(`.gift-reward-card.id-${city}`);
    
    selectedBox.classList.add('opened');
    
    setTimeout(() => {
        selectedCard.classList.remove('hidden');
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
        question: "Dimana kita pertama kali first date?",
        options: ["Ramen For The Soul", "Acta Brasserie", "BPK Blok M", "The Veranda Cafe"],
        correct: 0
    },
    {
        question: "Tanggal berapa kita jadian?",
        options: ["11 Juli 2024", "12 Juli 2024", "13 Juli 2024", "14 Juli 2024"],
        correct: 3
    },
    {
        question: "Makanan yang mau pengen banget aku makan hari ini?",
        options: ["Steak", "Pasta", "Sushi", "Kamu"],
        correct: 3
    }
];

let currentQuestionIndex = 0;
let correctAnswersCount = 0;

function initQuiz() {
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    updateLoveMeter(0);
    loadQuestion();
}

function loadQuestion() {
    const questionElement = document.getElementById("quiz-question");
    const optionsContainer = document.getElementById("quiz-options");
    
    optionsContainer.innerHTML = "";
    
    let currentQuiz = quizData[currentQuestionIndex];
    questionElement.innerHTML = `Question ${currentQuestionIndex + 1}/${quizData.length}: <br><b>${currentQuiz.question}</b>`;
    
    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option-btn");
        button.onclick = () => checkAnswer(index, button);
        optionsContainer.appendChild(button);
    });
}

// Modifikasi persentase tangki proporsional mengikuti progres jawaban yang benar
function checkAnswer(selectedIndex, clickedButton) {
    const currentQuiz = quizData[currentQuestionIndex];
    const allButtons = document.querySelectorAll(".option-btn");
    
    allButtons.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === currentQuiz.correct) {
        clickedButton.classList.add("correct");
        correctAnswersCount++;
    } else {
        clickedButton.classList.add("wrong");
        allButtons[currentQuiz.correct].classList.add("correct");
    }
    
    let currentLoveScore = Math.round((correctAnswersCount / quizData.length) * 100);
    updateLoveMeter(currentLoveScore);

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            document.getElementById("quiz-area").classList.add("hidden");
            document.getElementById("wish-area").classList.remove("hidden");
            document.getElementById("wish-area").scrollIntoView({ behavior: 'smooth' });
        }
    }, 1500);
}

function updateLoveMeter(percent) {
    const liquid = document.getElementById("love-liquid");
    const percentText = document.getElementById("love-percent");
    
    percentText.innerText = percent + "%";
    let topValue = 100 - percent;
    
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
    
    const myPhoneNumber = "6281241101848"; 
    const formattedMessage = encodeURIComponent(`Hai sayang! Ini ucapan Make a Wish ulang tahunku:\n\n"${wishText}"\n\nI love you so much! ❤️✨`);
    window.open(`https://api.whatsapp.com/send?phone=${myPhoneNumber}&text=${formattedMessage}`, '_blank');
    
    // Alur ringkas: otomatis buka modul pilihan kado sesaat setelah klik WA tanpa tombol penengah ganda
    const giftSection = document.getElementById('gift-section');
    giftSection.classList.remove('hidden');
    
    setTimeout(() => {
        giftSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

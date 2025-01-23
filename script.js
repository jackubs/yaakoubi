// Original code
const currentIndexes = [0, 0];

function moveSlide(direction, cardIndex) {
    const slider = document.querySelectorAll('.media-slider')[cardIndex];
    const slides = slider.children;
    const totalSlides = slides.length;

    currentIndexes[cardIndex] = (currentIndexes[cardIndex] + direction + totalSlides) % totalSlides;
    slider.style.transform = `translateX(-${currentIndexes[cardIndex] * 100}%)`;
}

function toggleMode() {
    document.body.classList.toggle('light-mode');
}

function scrollToGames() {
    document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
}

function toggleContactIcons() {
    const contactIcons = document.querySelector('.contact-icons');
    contactIcons.style.display = contactIcons.style.display === 'none' || !contactIcons.style.display ? 'block' : 'none';
}

// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-XXXXXX-X');

// New particle effect code
let particles = [];
let canvas;
let ctx;
let audioContext;
let lastPlayTime = 0;
let mouseX = undefined;
let mouseY = undefined;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.originalSpeed = { x: this.speedX, y: this.speedY };
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (mouseX !== undefined && mouseY !== undefined) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
                const angle = Math.atan2(dy, dx);
                this.speedX = this.originalSpeed.x - Math.cos(angle);
                this.speedY = this.originalSpeed.y - Math.sin(angle);
                return true;
            }
        }

        if (this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height) {
            this.reset();
        }

        this.speedX = this.speedX * 0.98 + this.originalSpeed.x * 0.02;
        this.speedY = this.speedY * 0.98 + this.originalSpeed.y * 0.02;

        return false;
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initCanvas() {
    canvas = document.getElementById('particleCanvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    createParticles();
    animate();
    setupEventListeners();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    const numberOfParticles = Math.floor((window.innerWidth * window.innerHeight) / 15000);
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function playSound() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.currentTime - lastPlayTime > 0.1) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400 + Math.random() * 200, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);

        lastPlayTime = audioContext.currentTime;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let particlesAffectedByMouse = 0;
    particles.forEach(particle => {
        if (particle.update()) {
            particlesAffectedByMouse++;
        }
        particle.draw();
    });

    if (particlesAffectedByMouse > 0) {
        playSound();
    }

    requestAnimationFrame(animate);
}

function setupEventListeners() {
    window.addEventListener('resize', () => {
        resizeCanvas();
        particles = [];
        createParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouseX = undefined;
        mouseY = undefined;
    });
}

// Initialize particle effect when the document is loaded
document.addEventListener('DOMContentLoaded', initCanvas);
function togglePlatform(button, platform) {
    // Get the parent card
    const card = button.closest('.game-card');
    
    // Update active button
    card.querySelectorAll('.platform-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
    
    // Update active platform
    card.querySelectorAll('.download-platform').forEach(platform => {
        platform.classList.remove('active');
    });
    card.querySelector(`.download-platform.${platform}`).classList.add('active');
}

const feedbackForm = document.getElementById("feedback-form");
const feedbackDisplay = document.getElementById("feedback-display");

feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const feedbackInput = document.getElementById("feedback-input");
    const feedbackText = feedbackInput.value.trim();
    if (feedbackText) {
        const feedbackItem = document.createElement("div");
        feedbackItem.textContent = feedbackText;
        feedbackDisplay.appendChild(feedbackItem);
        
        // Save feedback to localStorage
        let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
        feedbackList.push(feedbackText);
        localStorage.setItem('feedbackList', JSON.stringify(feedbackList));

        // Clear the input field
        feedbackInput.value = "";
        feedbackItem.style.animation = "fadeIn 1s ease-in-out";
    }
});

// Load feedback from localStorage when the page is loaded
window.addEventListener('DOMContentLoaded', () => {
    let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
    feedbackList.forEach(feedbackText => {
        const feedbackItem = document.createElement("div");
        feedbackItem.textContent = feedbackText;
        feedbackDisplay.appendChild(feedbackItem);
    });
});

// Increment Counter Animation
let downloads = 0;
const downloadCounter = document.getElementById("downloads");

function incrementDownloads(finalValue) {
    let count = 0;
    const interval = setInterval(() => {
        count += Math.ceil(finalValue / 100);
        if (count >= finalValue) {
            count = finalValue;
            clearInterval(interval);
        }
        downloadCounter.textContent = count.toLocaleString();
    }, 20);
}

// Simulate download count
document.addEventListener("DOMContentLoaded", () => {
    incrementDownloads(12); 
});



// Light/Dark Mode Toggle
function toggleMode() {
    document.body.classList.toggle("light-mode");
}

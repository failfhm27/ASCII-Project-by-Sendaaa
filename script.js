const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const asciiContainer = document.getElementById('ascii-container');
const lyricsOverlay = document.getElementById('lyrics-overlay');
const playBtn = document.getElementById('play-btn');

const density = " .:-=+*#%@";

const initialAsciiArt = "";
asciiContainer.textContent = initialAsciiArt;

const lyricsData = [
    { time: 0, text: "" },
    { time: 0.2, text: "Rayumu..." },
    { time: 2.5, text: "Katakanlah..." },
    { time: 5.0, text: "Buatku membatu tenang..." },
    { time: 8.5, text: "Kudiam membisik jangan..." },
    { time: 11.2, text: "Buatku berpaling..." },
    { time: 13.0, text: "Mencari cinta..." }
];

playBtn.addEventListener('click', () => {
    // 1. Jalankan animasi tombol menghilang
    playBtn.classList.add('fade-out-zoom');
    const instructions = document.querySelector('.instructions');
    if (instructions) instructions.classList.add('fade-out-zoom');

    video.volume = 0;

    // 2. Tunggu 0.6 detik (600ms) tepat setelah animasi tombol selesai
    setTimeout(() => {
        playBtn.style.display = 'none';
        if (instructions) instructions.style.display = 'none';

        // Picu animasi masuk pada visual ASCII
        asciiContainer.classList.add('ascii-enter');

        video.play().then(() => {
            // Fade-in suara audio untuk cegah bunyi "ck"
            let vol = 0;
            const fadeIn = setInterval(() => {
                if (vol < 1) {
                    vol += 0.1;
                    video.volume = Math.min(vol, 1);
                } else {
                    clearInterval(fadeIn);
                }
            }, 30);
        }).catch((err) => {
            alert("Gagal memutar video: " + err);
            playBtn.style.display = 'block';
            if (instructions) instructions.style.display = 'block';
            playBtn.classList.remove('fade-out-zoom');
            if (instructions) instructions.classList.remove('fade-out-zoom');
            asciiContainer.classList.remove('ascii-enter');
        });
    }, 600); // Disinkronkan dengan durasi CSS (600ms = 0.6s)
});

video.addEventListener('playing', () => {
    render();
});

function render() {
    if (video.paused || video.ended) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let asciiText = "";

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (x + y * canvas.width) * 4;
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];

            const avg = (r + g + b) / 3;
            const charIndex = Math.floor((avg / 255) * (density.length - 1));
            const c = density[charIndex];

            asciiText += (c === " ") ? " " : c;
        }
        asciiText += "\n";
    }

    asciiContainer.textContent = asciiText;

    const currentTime = video.currentTime;
    let currentText = "";
    
    for (let i = 0; i < lyricsData.length; i++) {
        if (currentTime >= lyricsData[i].time) {
            currentText = lyricsData[i].text;
        }
    }
    lyricsOverlay.innerText = currentText;

    requestAnimationFrame(render);
}

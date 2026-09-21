const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const asciiContainer = document.getElementById('ascii-container');
const lyricsOverlay = document.getElementById('lyrics-overlay');
const playBtn = document.getElementById('play-btn');


const density = " .:-=+*#%@";

const lyricsData = [
    { time: 0, text: "" },
    { time: 3.2, text: "Once bitten" },
    { time: 4.8, text: "And twice shy" },
    { time: 6.8, text: "I keep my distance" },
    { time: 9.2, text: "But you still catch my eye" },
    { time: 11.5, text: "Tell me, baby" },
    { time: 13.0, text: "Do you recognize me?" }
];

playBtn.addEventListener('click', () => {
    video.play().then(() => {
        playBtn.style.display = 'none';
        render();
    }).catch((err) => {
        alert("Gagal memutar video: " + err);
    });
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

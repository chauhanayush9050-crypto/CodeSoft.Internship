const cover = document.querySelector(".cover")
const songTitle = document.querySelector(".song-title")
const artistName = document.querySelector(".artist-name")
const audio = document.querySelector(".audio")
const playBtn = document.querySelector(".play-btn")
const prevBtn = document.querySelector(".previous")
const nextBtn = document.querySelector(".next")
const progressBar = document.querySelector(".progress-bar")
const currentTime = document.querySelector(".current-time")
const duration = document.querySelector(".duration");
const volumeSlider = document.querySelector(".volume-slider")
const volumeIcon = document.querySelector(".volume-icon");
const colorThief = new ColorThief();

function updateBackgroundColor() {
    try {
        if (!cover.complete) return;

        const color = colorThief.getColor(cover);

        document.documentElement.style.setProperty(
            "--accent",
            `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        );
    } catch (err) {
        console.log(err);
    }
}


let currentSong = 0
let isPlaying = false;
function loadSong() {

    cover.src = songs[currentSong].image;

    cover.onload = () => {
        updateBackgroundColor();
    };

    songTitle.textContent = songs[currentSong].name;
    artistName.textContent = songs[currentSong].artist;
    audio.src = songs[currentSong].audio;

}
loadSong()
function playSong() {

    audio.play();

    isPlaying = true;

    playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;

    cover.classList.add("rotate");

}

function pauseSong() {

    audio.pause();

    isPlaying = false;

    playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;

    cover.classList.remove("rotate");

}

playBtn.addEventListener("click", () => {

    if (isPlaying) {

        pauseSong();

    } else {

        playSong();

    }
    
});
loadSong();
audio.addEventListener("loadedmetadata", () => {

    progressBar.max = audio.duration;

    duration.textContent = formatTime(audio.duration);

});


nextBtn.addEventListener("click", nextSong);

prevBtn.addEventListener("click", prevSong);


audio.addEventListener("timeupdate", () => {

    progressBar.value = audio.currentTime;

    currentTime.textContent = formatTime(audio.currentTime);

    duration.textContent = formatTime(audio.duration);

});
progressBar.addEventListener("input", () => {
    audio.currentTime = progressBar.value;
});
function formatTime(time){

    const minutes = Math.floor(time / 60);

    let seconds = Math.floor(time % 60);

    if(seconds < 10){
        seconds = "0" + seconds;
    }

    return `${minutes}:${seconds}`;

}
function nextSong() {
    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    loadSong();

    progressBar.value = 0;
    currentTime.textContent = "0:00";

    if (isPlaying) {
        playSong();
    }
}
function prevSong() {

    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong();

    progressBar.value = 0;
    currentTime.textContent = "0:00";

    if (isPlaying) {
        playSong();
    }
}
audio.addEventListener("ended", () => {
    nextSong();
});
volumeSlider.addEventListener("input", () => {

    audio.volume = volumeSlider.value / 100;

    if (volumeSlider.value == 0) {
        volumeIcon.className = "fa-solid fa-volume-xmark volume-icon";
    }
    else if (volumeSlider.value < 50) {
        volumeIcon.className = "fa-solid fa-volume-low volume-icon";
    }
    else {
        volumeIcon.className = "fa-solid fa-volume-high volume-icon";
    }

});
const loadingOverlay = document.querySelector(".loading-overlay");

window.addEventListener("load", () => {
    loadingOverlay.classList.add("hidden");
});
//audio-player-controls

let playIcon = document.querySelector('.play');
let audioProgressBar = document.querySelector('.progress-bar');
let song = new Audio('./assets/audio/God Shattering Star.mp3');
let stopInterval = false;


song.addEventListener("loadedmetadata", () => {
    audioProgressBar.max = song.duration;
    audioProgressBar.value = song.currentTime;
    calculatePlayedProgressLine();
    calcTimeLeft();

});

function calcTimeLeft(){
    let currTimeInSecondes = Math.round(song.currentTime);
    let minutes = Math.floor(currTimeInSecondes/60);
    let secondes = currTimeInSecondes - (minutes*60);
    const audioDuration = document.querySelector('.audio-duration');
    audioDuration.innerText = `${minutes}:${( secondes< 10)? "0"+secondes:secondes}`;
}

playIcon.addEventListener('click', () =>{

    if(playIcon.src.includes('play-solid')){
        playIcon.src = playIcon.src.replace("play-solid","pause-solid");
        song.play();
        stopInterval = false;
    }
    else{
        song.pause();
        playIcon.src = playIcon.src.replace('pause-solid','play-solid');
        stopInterval = true;
    }
});

audioProgressBar.addEventListener('input', (event) => {
    song.currentTime = event.target.value;
});

audioProgressBar.addEventListener('mousedown', () => {
    song.pause();
});

audioProgressBar.addEventListener('mouseup', () => {
    if (
        playIcon.src.includes("pause-solid")) {
      song.play();
    }
});

song.addEventListener('play', async () => {
      progressAnimation = setInterval(function () {
  
        audioProgressBar.value = song.currentTime;
        calculatePlayedProgressLine();
        calcTimeLeft();
        if (stopInterval) {
          clearInterval(progressAnimation);
        }
      });

  });


function calculatePlayedProgressLine() {

    let valPres = Math.round((audioProgressBar.value / audioProgressBar.max) * 100);
    valPres < 10 ? valPres = valPres + 1 : valPres;
    audioProgressBar.style.background = `linear-gradient(90deg,  #6c8685 ${valPres}%, #a3bfbf ${valPres}%)`;
}

//audio list
let songsData;
const audioList = document.querySelector('.audio-list');


function buildSongsList(songObj, id){

    const songItem = document.createElement("div");
    songItem.classList.add("song-item");

    const songCounter = document.createElement('p');
    songCounter.classList.add('song-counter');
    songCounter.innerText = id;

    const songDes = document.createElement("div");
    songDes.classList.add("song-description");

    const songName = document.createElement("p");
    songName.classList.add("song-name");
    songName.innerText = songObj.name;

    const songSinger = document.createElement("p");
    songSinger.classList.add("song-singer");
    songSinger.innerText = songObj.singer;

    const songDuration = document.createElement("p");
    songDuration.classList.add("song-duration");
    songDuration.innerText = songObj.duration

    songDes.appendChild(songName);
    songDes.appendChild(songSinger);

    songItem.appendChild(songCounter);
    songItem.appendChild(songDes);
    songItem.appendChild(songDuration);

    audioList.appendChild(songItem);

    songItem.addEventListener('click', () =>{
        changeAudio(songObj);
    })

}

fetch('./audio.json')
    .then((response) => response.json())
    .then((json) => {
        songsData = json;
        songsData.forEach((element, counter) => {
            buildSongsList(element, (counter +1));
        });
        
    });

function changeAudio(songObj){

    song.src = songObj.audioSrc;
    song.alt = songObj.name;

    audioProgressBar.value = song.currentTime;
    audioProgressBar.max = song.duration;
    song.play();

    if(playIcon.src.includes('play-solid')){
        playIcon.src = playIcon.src.replace("play-solid","pause-solid");
        song.play();
        stopInterval = false;
    }
}
    



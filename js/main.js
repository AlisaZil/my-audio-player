import { songsData, songItemElements } from './audioData.js';

const playIcon = document.querySelector('.play');
let audioProgressBar = document.querySelector('.progress-bar');

let stopInterval = false;
let playNextsong = true;

//first song init
let currSongId = 1;

let song = new Audio(songsData[0].audioSrc);
document.querySelector('.song-singer').innerText = songsData[0].singer;
document.querySelector('.song-name').innerText = songsData[0].name;
document.querySelector('.audio-img').src = songsData[0].pictureSrc;

CalculateAlbumDetails(songsData);
//audio progress bar functions

function defineProgressBarValues(){
    audioProgressBar.value = song.currentTime;
    audioProgressBar.max = song.duration;
}

song.addEventListener("loadedmetadata", () => {
    console.log(song.src)
    defineProgressBarValues();
    calculatePlayedProgressLine(audioProgressBar);
    calcTimeLeftForSong();
    volumeProgressBar.style.background = 
    `linear-gradient(90deg,  #55B35E ${volumeProgressBar.value}%, #4C4B4B ${volumeProgressBar.value}%)`;
});

audioProgressBar.addEventListener('input', (event) => {
    song.currentTime = event.target.value;
    calculatePlayedProgressLine(audioProgressBar);
    calcTimeLeftForSong();
});

audioProgressBar.addEventListener('mousedown', () => {
    song.pause();
    playNextsong = false;
});

audioProgressBar.addEventListener('mouseup', () => {
    if (playIcon.className.includes("fa-pause")) {
      song.play();
    }
    playNextsong = true;
});

song.addEventListener('play', async () => {

      let progressAnimation = setInterval(function () {
  
        audioProgressBar.value = song.currentTime;
        calcTimeLeftForSong();
        calculatePlayedProgressLine(audioProgressBar);
        if (stopInterval) {
          clearInterval(progressAnimation);
        }
      },10);

});

function calcTimeLeftForSong(){

    let minutes = Math.floor(Math.round(song.currentTime)/60);
    let secondes = Math.round(song.currentTime) - (minutes*60);
    
    const audioDuration = document.querySelector('.audio-duration');

    audioDuration.innerText = `${minutes}:${( secondes< 10)? "0"+secondes:secondes}`;

}

function calculatePlayedProgressLine( progressBar ) {
    let valPres = (progressBar.value / progressBar.max) * 100;
    valPres < 10 ? valPres = valPres + 1 : valPres;
    progressBar.style.background = `linear-gradient(90deg,  #55B35E ${valPres}%, #4C4B4B ${valPres}%)`;
}

//audio player controls

playIcon.addEventListener('click', () =>{

    if(playIcon.className.includes('fa-play')){
        playIcon.className = playIcon.className.replace("fa-play","fa-pause");
        song.play();
        stopInterval = false;
    }
    else{
        playIcon.className = playIcon.className.replace('fa-pause','fa-play');
        song.pause();
        stopInterval = true;
    }

});

//audio list

function buildSongsList(songObj){

    songItemElements.forEach((element) => {

        const currentElement = document.createElement(element.type);
        currentElement.classList.add(element.class);
        currentElement.classList.add("number-" + songObj.id);

        if(element.type == 'p'){
            currentElement.innerText = songObj[element.class.replace("song-", "")];
        }

        if( element.class == "song-counter"){
            currentElement.innerText = songObj.id;
        }

        if(element.fatherElement == "audio-list"){
            document.querySelector('.audio-list').appendChild(currentElement);
        }

        else{
               document.querySelector("."+element.fatherElement +".number-"+songObj.id).appendChild(currentElement);
        }
        if(songObj.class = "song-item"){
            currentElement.addEventListener('click', () =>{
                changeAudio(songObj);
            })
        }
        
    });
}

songsData.forEach((element) => {
    buildSongsList(element);
});


function changeAlbumData(songObj){
    document.querySelector(".audio-img").src = songObj.pictureSrc;
    document.querySelector(".song-name").innerText = songObj.name;
    document.querySelector(".song-singer").innerText = songObj.singer;
}

function CalculateAlbumDetails(songsData){
    let songsDuration = 0 ;
    document.querySelector('.songs-amount').innerText = songsData.length + " songs";

    songsData.forEach(element => {
        songsDuration = songsDuration + parseInt(element.duration.split(":")[0]) + Math.round(element.duration.split(":")[1]/60);
    });

    document.querySelector('.songs-duration').innerText = songsDuration + " min";
}

function playSongAfterChange(){
    
    song.play();

    if(playIcon.className.includes('fa-play')){
        playIcon.className = playIcon.className.replace("fa-play","fa-pause");
        stopInterval = false;
    }
}

function changeAudio(songObj){

    song.src = songObj.audioSrc;
    song.alt = songObj.name;
    playSongAfterChange();
    defineProgressBarValues();
    changeAlbumData(songObj);
    currSongId = songObj.id;
}

const shuffleIcon = document.querySelector('.shuffle');
let isShuffle = false;

shuffleIcon.addEventListener('click', () =>{
    if(!isShuffle){
        shuffleIcon.style.color = "#55B35E";
        isShuffle = true;
    }
    else{
        shuffleIcon.style.color = "white";
        isShuffle = false;
    }
    shuffleSongOrder();
});

function shuffleSongOrder(){

    if(isShuffle){
        let shuffeldOrder = Array.from({length: songsData.length}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
        songsData.forEach((element, i) => {
            element.id = shuffeldOrder[i];
        });
        currSongId = 1;
    }
    else{
        let shuffeldOrder = Array.from({length: songsData.length}, (_, i) => i + 1);
        let lastSong = songsData.find((element) => element.id == currSongId);
        songsData.forEach((element, i) => {
            element.id = shuffeldOrder[i];
        });
        currSongId = songsData.find(element => element === lastSong).id;
    }
}

song.onended = function() {
        currSongId = currSongId + 1;
        song.src = songsData.find((element) => element.id == currSongId).audioSrc;
        playSongAfterChange();
        changeAlbumData(songsData.find((element) => element.id == currSongId));
};

const forwardIcon = document.querySelector('.forward');

forwardIcon.addEventListener('click', () =>{
    currSongId = currSongId + 1;
    song.src = songsData.find((element) => element.id == currSongId).audioSrc;
    playSongAfterChange();
    changeAlbumData(songsData.find((element) => element.id == currSongId));
});

const backwardsIcon = document.querySelector('.backward');

backwardsIcon.addEventListener('click', () =>{
    if(currSongId == 1 ){
        song.currentTime = 0;
        playSongAfterChange();
    }else{
        currSongId = currSongId - 1;
    song.src = songsData.find((element) => element.id == currSongId).audioSrc;
    playSongAfterChange();
    changeAlbumData(songsData.find((element) => element.id == currSongId));
    }
    
});

const volumeProgressBar = document.querySelector('.volume-progress-bar');
const volumeIcon = document.querySelector('.volume');

volumeProgressBar.addEventListener('input', (event) => {

    volumeProgressBar.style.background = 
    `linear-gradient(90deg,  #55B35E ${volumeProgressBar.value}%, #4C4B4B ${volumeProgressBar.value}%)`;

    let volume = Math.round(event.target.value)/100;
    if(volume > 0 && volume <= 0.7){
        volumeIcon.classList.remove(volumeIcon.classList[3]);
        volumeIcon.classList.add('fa-volume-low');
    }
    else if(volume <= 0){
        volumeIcon.classList.remove(volumeIcon.classList[3]);
        volumeIcon.classList.add('fa-volume-off');
    }
    else {
        volumeIcon.classList.remove(volumeIcon.classList[3]);
        volumeIcon.classList.add('fa-volume-high');
    }
    song.volume = volume;
});
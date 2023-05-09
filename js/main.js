import { songsData, songItemElements } from './audioData.js';

const playIcon = document.querySelector('.play');
let audioProgressBar = document.querySelector('.progress-bar');

let stopInterval = false;


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
    defineProgressBarValues();
    calculatePlayedProgressLine();
    calcTimeLeftForSong();

});

audioProgressBar.addEventListener('input', (event) => {
    song.currentTime = event.target.value;
    calculatePlayedProgressLine();
});

audioProgressBar.addEventListener('mousedown', () => {
    song.pause();
});

audioProgressBar.addEventListener('mouseup', () => {
    if (playIcon.src.includes("pause-solid")) {
      song.play();
    }
});

song.addEventListener('play', async () => {

      let progressAnimation = setInterval(function () {
  
        audioProgressBar.value = song.currentTime;
        calculatePlayedProgressLine();
        calcTimeLeftForSong();
        if (stopInterval) {
          clearInterval(progressAnimation);
        }
      });

});

function calcTimeLeftForSong(){

    let minutes = Math.floor(Math.round(song.currentTime)/60);
    let secondes = Math.round(song.currentTime) - (minutes*60);
    
    const audioDuration = document.querySelector('.audio-duration');

    audioDuration.innerText = `${minutes}:${( secondes< 10)? "0"+secondes:secondes}`;

}

function calculatePlayedProgressLine() {
    let valPres = Math.floor((audioProgressBar.value / audioProgressBar.max) * 100);
    valPres < 10 ? valPres = valPres + 1 : valPres;
    audioProgressBar.style.background = `linear-gradient(90deg,  #6c8685 ${valPres}%, #a3bfbf ${valPres}%)`;
}

//audio player controls

playIcon.addEventListener('click', () =>{

    if(playIcon.src.includes('play-solid')){
        playIcon.src = playIcon.src.replace("play-solid","pause-solid");
        song.play();
        stopInterval = false;
    }
    else{
        playIcon.src = playIcon.src.replace('pause-solid','play-solid');
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

    if(playIcon.src.includes('play-solid')){
        playIcon.src = playIcon.src.replace("play-solid","pause-solid");
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
        shuffleIcon.style.backgroundColor = "white";
        isShuffle = true;
    }
    else{
        shuffleIcon.style.backgroundColor = "transparent";
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

    let volume = Math.round(event.target.value)/100;
    if(volume > 0 && volume <= 0.7){
        volumeIcon.src = './assets/icons/volume-low-solid.svg';
    }
    else if(volume <= 0){
        volumeIcon.src = './assets/icons/volume-xmark-solid.svg';
    }
    else {
        volumeIcon.src = './assets/icons/volume-high-solid.svg';
    }
    console.log(volume);
    song.volume = volume;
});
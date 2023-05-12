import { songsData, songItemElements } from './audioData.js';

const playControl = document.querySelector('.play');
const volumeControl = document.querySelector('.volume');
const shuffleControl = document.querySelector('.shuffle');
const repeatControl = document.querySelector('.repeat');
const forwardControl = document.querySelector('.forward');
const backwardsControl = document.querySelector('.backward');

const audioProgressBar = document.querySelector('.progress-bar');
const volumeProgressBar = document.querySelector('.volume-progress-bar');

let isShuffle = false;
let isRepeat = false;
let nextSong = true;
let stopInterval = false;

let currSongId = 1;

//first song init

let song = new Audio(songsData[0].audioSrc);
document.querySelector('.song-singer').innerText = songsData[0].singer;
document.querySelector('.song-name').innerText = songsData[0].name;
document.querySelector('.audio-img').src = songsData[0].pictureSrc;

CalculateAlbumDetails(songsData);

/* functions */

function addStyleToSongItemElement() {

    let songElementsItems = [...document.getElementsByClassName('song-item')];

    songElementsItems.forEach(element => {
        song.src.includes(element.src.replace("./assets", ""))? 
            element.style.backgroundColor = "#202020":
            element.style.backgroundColor = ""
    });
}

function calcTimeLeftForSong(){

    let minutes = Math.floor(Math.round(song.currentTime)/60);
    let secondes = Math.round(song.currentTime) - (minutes*60);
    
    const audioDuration = document.querySelector('.audio-duration');

    audioDuration.innerText = `${minutes}:${( secondes< 10)? "0"+secondes:secondes}`;

}

function calculatePlayedProgressLine() {

    let valPres = (audioProgressBar.value / audioProgressBar.max) * 100;
    valPres < 10 ? valPres = valPres + 1 : valPres;
    audioProgressBar.style.background = `linear-gradient(90deg,  #55B35E ${valPres}%, #4C4B4B ${valPres}%)`;

}

function calculateVolumeProgressline(){
    volumeProgressBar.style.background = 
    `linear-gradient(90deg,  #55B35E ${volumeProgressBar.value}%, #4C4B4B ${volumeProgressBar.value}%)`;
}

function changeAlbumData(songObj){

    document.querySelector(".audio-img").src = songObj.pictureSrc;
    document.querySelector(".song-name").innerText = songObj.name;
    document.querySelector(".song-singer").innerText = songObj.singer;

}

function CalculateAlbumDetails(songsData){

    let songsDuration = 0;
    let secondes = 0;
    
    songsData.forEach(element => {
        secondes = secondes + parseInt(element.duration.split(":")[1]);
        songsDuration = songsDuration + parseInt(element.duration.split(":")[0]);
    });
    
    songsDuration = songsDuration + Math.round(secondes/60);

    document.querySelector('.songs-amount').innerText = songsData.length + " songs";
    document.querySelector('.songs-duration').innerText = songsDuration + " min " + (secondes % 60) + " sec";

}

function defineProgressBarValues(){

    audioProgressBar.value = song.currentTime;
    audioProgressBar.max = song.duration;

}


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

            currentElement.src = songObj.audioSrc;
            currentElement.addEventListener('click', () =>{
                changeAudio(songObj);
            })
        }
        
    });
}

function playSongAfterChange(){
    
    song.play();

    if(playControl.className.includes('fa-play')){
        playControl.className = playControl.className.replace("fa-play","fa-pause");
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

function shuffleSongOrder(){

    let songOrder;
    if(isShuffle){
        songOrder = Array.from({length: songsData.length}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
        songsData.forEach((element, i) => {
            element.id = songOrder[i];
        });
        currSongId = 1;
    }
    else{
        songOrder = Array.from({length: songsData.length}, (_, i) => i + 1);
        let lastSong = songsData.find((element) => element.id == currSongId);
        songsData.forEach((element, i) => {
            element.id = songOrder[i];
        });
        currSongId = songsData.find(element => element === lastSong).id;
    }
}

function ChangeSong(){
    song.src = songsData.find((element) => element.id == currSongId).audioSrc;
    changeAlbumData(songsData.find((element) => element.id == currSongId));
    playSongAfterChange();
}

/* EventListeners */


song.addEventListener("loadedmetadata", () => {
    
    addStyleToSongItemElement();
    defineProgressBarValues();
    calculatePlayedProgressLine();
    calcTimeLeftForSong();
    calculateVolumeProgressline();
    
});

song.addEventListener('play', async () => {

      let progressAnimation = setInterval(function () {
  
        audioProgressBar.value = song.currentTime;
        calcTimeLeftForSong();
        calculatePlayedProgressLine();
        if (stopInterval) {
          clearInterval(progressAnimation);
        }
      },10);

});

song.onended = function() {

    if(nextSong){
        currSongId = currSongId + 1;
        ChangeSong();
    }
    else{
        song.currentTime = song.duration;
    }

};

songsData.forEach((element) => {
    buildSongsList(element);
});


audioProgressBar.addEventListener('input', (event) => {
    song.currentTime = event.target.value;
    calculatePlayedProgressLine();
    calcTimeLeftForSong();
});

audioProgressBar.addEventListener('mousedown', () => {
    song.pause();
    nextSong = false;
});

audioProgressBar.addEventListener('mouseup', () => {
    if (playControl.className.includes("fa-pause")) {
      song.play();
    }
    nextSong = true;
});

volumeProgressBar.addEventListener('input', (event) => {

    calculateVolumeProgressline();

    let volume = Math.round(event.target.value)/100;
    volumeControl.classList.remove(volumeControl.classList[3]);

    if(volume > 0 && volume <= 0.7){
        volumeControl.classList.add('fa-volume-low');
    }
    else if(volume <= 0){
        volumeControl.classList.add('fa-volume-off');
    }
    else {
        volumeControl.classList.add('fa-volume-high');
    }
    song.volume = volume;
});

playControl.addEventListener('click', () =>{

    if(playControl.className.includes('fa-play')){
        playControl.className = playControl.className.replace("fa-play","fa-pause");
        song.play();
        stopInterval = false;
    }
    else{
        playControl.className = playControl.className.replace('fa-pause','fa-play');
        song.pause();
        stopInterval = true;
    }

});

shuffleControl.addEventListener('click', () =>{
    if(!isShuffle){
        shuffleControl.style.color = "#55B35E";
        isShuffle = true;
    }
    else{
        shuffleControl.style.color = "white";
        isShuffle = false;
    }
    shuffleSongOrder();
});

repeatControl.addEventListener('click', () =>{
    isRepeat = !isRepeat;
    isRepeat? repeatControl.style.color = "rgb(85, 179, 94)" : repeatControl.style.color = "white";
});

forwardControl.addEventListener('click', () =>{
    currSongId = currSongId + 1;
    ChangeSong();
    
});

backwardsControl.addEventListener('click', () =>{
    if(currSongId == 1 ){
        song.currentTime = 0;
    }else{
        currSongId = currSongId - 1;
    }
    ChangeSong();
});
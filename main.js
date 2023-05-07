playIcon = document.querySelector('.play');
audioProgressBar = document.querySelector('.audio-progress-bar');
song = new Audio('./assets/audio/Call Me.mp3');
stopInterval = false;

song.addEventListener("loadedmetadata", () => {
    audioProgressBar.max = song.duration;
    audioProgressBar.value = song.currentTime;
})

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
  
        if (stopInterval) {
          clearInterval(progressAnimation);
        }
      });

  })
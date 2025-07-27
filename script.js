console.log("let's Write javaScript");

let currentSong = new Audio();
let songs;
let currFolder;
// Function to convert seconds into MM:SS format
function convertSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Fetch all the songs
async function getSongs(folder) {
    currFolder=folder;
    let a = await fetch(`${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
     songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML="";
    for (const song of songs) {
        let song_name = song.split(`${folder}/`)[1]
            .split("(From")[0]
            .split("Full")[0]
            .split("Sanam")[0]
            .replaceAll("%20", " ")
            .replaceAll("%2C", " ")
            .replaceAll("%26", " ");
        songUL.innerHTML = songUL.innerHTML + `<li>
                             <div class="music">
                            <img src="music.svg" alt="music">
                            <div class="info">
                               <div> ${song_name} </div>
                                <div>Arijit singh</div> 
                                </div> 
                            </div> 
                             <img src="play.svg" alt="play">
                        </div>
                            </li>`;
    }
    Array.from(songUL.children).forEach((li, index) => {
        li.addEventListener("click", () => {
           // console.log(li);
            let song = songs[index].split(`${folder}`)[1]; // Get the song filename
           // console.log(song);
            playmusic(song);
        });
    });

}

// Function to play the music
const playmusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/${track}`;
   // console.log(currentSong.src);
    if (!pause) {
        currentSong.play();
        document.querySelector(".songbuttons .play_pause").src = "pause.svg"; // Change the button to pause
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
    
};
// Function to initialize the app
async function main() {
    // Get all songs
    currFolder = "ncs";
    await getSongs(`songs/${currFolder}`);
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
         
         e.addEventListener("click", async item =>{
             console.log( item.currentTarget.dataset.folder)
              currFolder= item.currentTarget.dataset.folder;
             await getSongs(`songs/${currFolder}`);   
         })
     })
    
    
    //Play the first song automatically
    // if (songs.length > 0) {
    //     let firstSong = songs[0].split(`songs/${folder}`)[1]; // Get the song filename
    //     playmusic(firstSong);        
    //     document.querySelector(".songbuttons .play_pause").src = "play.svg"; // Set to pause since the song is playing
    // }

    // Toggle play/pause when the play button in the footer is clicked
    document.querySelector(".songbuttons .play_pause").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            document.querySelector(".songbuttons .play_pause").src = "pause.svg"; // Change to pause
        } else {
            currentSong.pause();
            document.querySelector(".songbuttons .play_pause").src = "play.svg"; // Change to play
        }
    });

    // Update the current time and duration of the song
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSeconds(currentSong.currentTime)}/${convertSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    }); 

    // Seekbar functionality
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
          
    });    
}
document.querySelector(".hamburger").addEventListener("click", ()=>{
       document.querySelector(".left").style.left = "0";
})
document.querySelector(".close").addEventListener("click" ,()=>{
    document.querySelector(".left").style.left = "-120%";
})
    document.querySelector(".previous").addEventListener("click", () => {
        const index = songs.indexOf(currentSong.src);
        if (index - 1 >= 0) {
            const songPath = new URL(songs[index - 1]).pathname;
            const songFile = songPath.split(`/${currFolder}/`)[1];
            playmusic(songFile);
        }
    });

    document.querySelector(".next").addEventListener("click", () => {
        const index = songs.indexOf(currentSong.src);
        if (index + 1 < songs.length) {
            const songPath = new URL(songs[index + 1]).pathname;
            const songFile = songPath.split(`/${currFolder}/`)[1];
            playmusic(songFile);
        }
    });
// add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentSong.volume = parseInt(e.target.value)/100
})

// load the playlist when card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
   // console.log(e);
    e.addEventListener("click", async item =>{
       // console.log(item, item.currentTarget.dataset)
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      
    })
})
main(); 

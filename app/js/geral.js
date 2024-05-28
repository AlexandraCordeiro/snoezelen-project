

/*const mySlider = document.getElementById("my-slider");
const sliderValue = document.getElementById("slider-value");

function slider(){
    valPercent = (mySlider.value / mySlider.max)*100;
    sliderValue.textContent = mySlider.value;
    mySlider.style.background = `linear-gradient(to right, #0024B5 ${valPercent}%, #DCE3FF ${valPercent}%)`;
}

slider();*/

function Volume_Audio(data){
    let audios = data.metadata.audio;
    for (let i = 0; i <  audios.length; i++) {
    let data_audio = data.metadata.audio[i].metadata.file_audio;
        if(data_audio!==null){
            let n = document.querySelectorAll(".n");
            let mp3 = document.createElement ("audio");
            mp3.setAttribute("id", "player" + i);
            mp3.setAttribute("src", data.metadata.audio[i].metadata.file_audio.url);
            n[i].appendChild(mp3);
            mp3.play(); // Play the audio
            if(i==0){
                mp3.volume = 50/100;
            }else{
                mp3.volume = 0;
            }
            mp3.loop = true;
            let volumeSlider = document.getElementById("my-slider" + i); //input

            volumeSlider.addEventListener("input", () => {
                mp3.volume = volumeSlider.value/100;
            });
        }
    }
}
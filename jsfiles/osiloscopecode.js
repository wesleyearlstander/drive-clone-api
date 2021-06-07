let canvas = document.getElementById("audio_visual");
let ctx = canvas.getContext("2d");
let audioElement = document.getElementById("myAudio");

let audioCtx = new AudioContext();
let analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;

let source = audioCtx.createMediaElementSource(audioElement);

source.connect(analyser);
//this connects our music back to the default output, such as your //speakers 
source.connect(audioCtx.destination);

let data = new Uint8Array(analyser.frequencyBinCount);
requestAnimationFrame(loopingFunction);


analyser.getByteTimeDomainData(data); //passing our Uint data array


function loopingFunction() {
    requestAnimationFrame(loopingFunction);
    analyser.getByteTimeDomainData(data);
    draw(data);
}

function draw(data) {
    data = [...data];
    if (!!audioElement.paused)
        return
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let space = canvas.width / data.length;
    let start = true;
    ctx.beginPath();
    data.forEach((value, i) => {
        if (start) {
            ctx.moveTo(i, value); //x,y
            start = !start;
        } else
            ctx.lineTo(i + 1, value + 1); //x,y
    })
    ctx.stroke();
}



audioElement.onplay = () => {

    audioCtx.resume();
}
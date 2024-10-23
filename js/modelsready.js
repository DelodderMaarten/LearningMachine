
const $results = document.querySelector("#results");
const $canvas = document.querySelector('#canvas');
const $state = document.querySelector('#state');


let classifier;
let classification = [];
const words = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "up",
  "down",
  "left",
  "right",
  "go",
  "stop",
  "yes",
  "no",
  "kanker",
];

let video, ctx;
let handPose;
let hands = [];

const STATE_LOADING = "loading";
const STATE_RUNNING = "running";
const ALL_STATES = [STATE_LOADING, STATE_RUNNING];
let state = STATE_LOADING;

const setState = (value) => {
  console.log('setState', value);
  state = value;
  $state.textContent = state;
  document.documentElement.classList.remove(...ALL_STATES);
  document.documentElement.classList.add(state);
};

const preload = async () => {
  setState(STATE_LOADING);
  handPose = ml5.handPose();
  await handPose.ready;
  console.log('model ready');

  requestAnimationFrame(drawSound);
    const options = { probabilityThreshold: 0.7 };
    classifier = ml5.soundClassifier("SpeechCommands18w", options);
    await classifier.ready;
    console.log('model ready');
  
  setup();
}

const drawSound = () => {
    if (state === STATE_RUNNING) {
      let predictedWord = "no word detected";
      if (classification[0]?.confidence > 0.7) {
        predictedWord = classification[0].label;
      }
      $results.textContent = predictedWord;
    }
    requestAnimationFrame(drawSound);
  }
  


const setup = async () => {
  console.log('setup');
  ctx = $canvas.getContext('2d');
  // create a video stream - specify a fixed size
  const stream = await navigator.mediaDevices.getUserMedia({ video: {
    width: 640,
    height: 480
  } });
  video = document.createElement('video');
  video.srcObject = stream;
  video.play();
  // set canvas & video size
  $canvas.width = video.width = 640;
  $canvas.height = video.height = 480;
  // start detecting poses
  handPose.detectStart(video, (results) => {
    // store the results in a global
    hands = results;
  });
  // start the app
  
 

  console.log('setupSound');

  classifier.classifyStart((results) => {
    // store in global
    classification = results;
  });

  setState(STATE_RUNNING); 
  modelsReady(state)
  // start the app

  // Start the drawing loop here instead
  requestAnimationFrame(draw);
}

const modelsReady = (state) => {
    const loader = document.querySelector('#loader')
if (state = STATE_RUNNING){
    loader.classList.remove('display-loading', 'c-loading')
    loader.classList.add('hidden')
}
}


const draw = () => {
  
    ctx.drawImage(video, 0, 0, $canvas.width, $canvas.height);
    ctx.fillStyle = 'red';
    hands.forEach(hand => {
      hand.keypoints.forEach(keypoint => {
        // no confidence score for handPose
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 10, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  
  requestAnimationFrame(draw);
}

preload();



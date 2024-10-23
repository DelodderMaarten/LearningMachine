
    const $results = document.querySelector("#results");
    const $stateSound = document.querySelector('#state');
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

    const STATE_LOADING_SOUND = "loading";
    const STATE_RUNNING_SOUND = "running";
    const ALL_STATES_SOUND = [STATE_LOADING_SOUND, STATE_RUNNING_SOUND];
    let stateSound  = STATE_LOADING_SOUND;
 

   
    const setStateSound = (value) => {
      console.log('setState', value);
      stateSound = value;
      $stateSound.textContent = stateSound;
      document.documentElement.classList.remove(...ALL_STATES_SOUND);
      document.documentElement.classList.add(stateSound);
    };

    const preloadSound = async () => {
      setStateSound(STATE_LOADING_SOUND);
      requestAnimationFrame(drawSound);
      const options = { probabilityThreshold: 0.7 };
      classifier = ml5.soundClassifier("SpeechCommands18w", options);
      await classifier.ready;
      console.log('model ready');
      setupSound();
    }


    const setupSound = async () => {
      console.log('setupSound');
      // no need for video stream
      // classifier contains its own
      // logic to set up audio
      // start classification
      classifier.classifyStart((results) => {
        // store in global
        classification = results;
      });
      // start the app
      setStateSound(STATE_RUNNING_SOUND);
      
      
    }

    const drawSound = () => {
      if (stateSound === STATE_RUNNING_SOUND) {
        let predictedWord = "no word detected";
        if (classification[0]?.confidence > 0.7) {
          predictedWord = classification[0].label;
        }
        $results.textContent = predictedWord;
      }
      requestAnimationFrame(drawSound);
    }

    preloadSound();
  
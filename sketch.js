// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let video;
let poseNet;
let pose;
let skeleton;
let isFirstTime = true;
let song;


function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  var context = new AudioContext();
 
  document.querySelector('button').addEventListener('click', function() {
  context.resume().then(() => {
     song = new Pizzicato.Sound('https://foodadvisor.s3.us-east-2.amazonaws.com/song.wav', function() {
      // Sound loaded!
      console.log('Playback resumed successfully');
      song.play();
      console.log('PLAYING')
      
  });
});
});
poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {

  // Decide which part you want to track
  let leftShoulder = {}; 
  
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (skeleton.length > 0) {
      skeleton[0].forEach(element => {

        // check if your selected part has been detected by the webcam
        if(element.part === 'leftShoulder') {
          leftShoulder = element
        }
      });
    }

    // if your selected part has moved. Checking is "score" key is present
    // just so to make sure that the object is not empty, meaning there
    // has been movement in the part
    if('score' in leftShoulder) {
      console.log('leftShoulder MOVED ', leftShoulder)

      // storing the y coordinates of the selected part in this variable
      let freq = Math.round(leftShoulder.position.y);

      // Following are 3 different manipulations I tried.
      // Uncomment 1 code block at a time to see its effect.
      // Will develop it in functions later on to make it easier
      // to interact with.

      // ******** VOLUME MANIPULATION *************
      
      volume = (freq-0)/(480-0) * (1-0) + 0
      console.log('VOLUME ', volume)
      if(song) {

        // adding dynamic volume to the song
        song.volume = volume;
      }

    // ******** PLAY PAUSE TRIGGER *************
      // if(song) {
      //   if(leftShoulder.position.y >= 322) {
      //     song.pause();
      //   }
      //   if(leftShoulder.position.y < 322) {
      //     song.play();
      //   }
      // }

      
    //   // ******** HIGH PASS FILTER *************
     
    // 
    //   var highPassFilter = new Pizzicato.Effects.HighPassFilter({
    //     frequency: 2000,
    //     peak: 10
    // });
    
    // song.addEffect(highPassFilter);
    
    }
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  image(video, 0, 0);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, d);
    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
    
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0,255,0);
      ellipse(x,y,16,16);
    }
    
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y,b.position.x,b.position.y);      
    }
  }
}
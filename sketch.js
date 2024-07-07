
let handPose;
let video;
let hands = [];
let osc;
let particles = [];
let playing = false;

// import Particle from './particle.js'

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(1280, 960);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(1280, 960);
  video.hide();

  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);

  // sound
  osc = new p5.Oscillator(); // set frequency and type
  osc.amp(0.5);

  // Create a reverb effect
  reverb = new p5.Reverb();

  // Connect the oscillator to the reverb, then to the master output
  osc.disconnect();
  osc.connect(reverb);
  
  // Set reverb parameters
  reverb.process(osc, 2, 2); // 3 second reverbTime, 2% decayRate

  // fft = new p5.FFT();
  
}

function draw() {
  // Draw the webcam video
  background(255)
  push();
  textFont('helvetica')
  textSize(20)
  fill('rgba(0, 0, 0, 0.8)')
  noStroke()
  text("1. Place your hand in front of the camera (not too close though).",60,670 )
  text("2. Touch your thumb with your index finger. like this -> 👌🏼",60,690 )
  text("3. Move your hand up and down to control the pitch.",60,710 )
  text("Your sound should be on! :)",60,730)
  pop();



  //move image by the width of image to the left
  translate(video.width, 0);
  //then scale it by -1 in the x-axis
  //to flip the image
  scale(-1, 1);

  // if a hand is detected
  if (hands.length != 0) {
    let hand = hands[0];

    // draw points
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0);
      circle(keypoint.x, keypoint.y, 10);
    }

    //draw lines
    drawHandConnections(hand)

    let indexFinger = createVector(hands[0].index_finger_tip.x, hands[0].index_finger_tip.y)
    let thumd = createVector(hands[0].thumb_tip.x, hands[0].thumb_tip.y)
    let midPoint = p5.Vector.add(indexFinger, thumd).div(2)
    let d = dist(indexFinger.x, indexFinger.y,thumd.x, thumd.y)
    userStartAudio()
    let freq = map(hands[0].index_finger_tip.y, 0, height, 920, 40);
    osc.freq(freq);
    if (d < 50) {
        if (!playing) {
          osc.start();
          playing = true;
        }
        particles.push(new Particle(midPoint.x + random(5), midPoint.y + random(5)));
        particles.push(new Particle(midPoint.x + random(5), midPoint.y + random(5)));
        // Draw creation point
        noStroke();
        fill('rgba(0, 255, 0, 0.25)');
        ellipse(midPoint.x, midPoint.y, 30,30);
    } else {
      osc.stop();
      playing = false;
    }

  }

  for (let i = particles.length - 1; i >= 0; i--) {
  particles[i].update();
  particles[i].display();
  if (particles[i].isDead()) {
    particles.splice(i, 1);
  }
  }



}

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

function connectPoints(hand, name1, name2) {
  let point1 = hand[name1];
  let point2 = hand[name2];
  if (point1 && point2) {
    line(point1.x, point1.y, point2.x, point2.y);
  }
}



function drawHandConnections(hand) {
  stroke(0);
  strokeWeight(2);
  
  // Thumb
  connectPoints(hand, 'wrist', 'thumb_cmc');
  connectPoints(hand, 'thumb_cmc', 'thumb_mcp');
  connectPoints(hand, 'thumb_mcp', 'thumb_ip');
  connectPoints(hand, 'thumb_ip', 'thumb_tip');
  
  // Index finger
  connectPoints(hand, 'wrist', 'index_finger_mcp');
  connectPoints(hand, 'index_finger_mcp', 'index_finger_pip');
  connectPoints(hand, 'index_finger_pip', 'index_finger_dip');
  connectPoints(hand, 'index_finger_dip', 'index_finger_tip');
  
  // Middle finger
  connectPoints(hand, 'wrist', 'middle_finger_mcp');
  connectPoints(hand, 'middle_finger_mcp', 'middle_finger_pip');
  connectPoints(hand, 'middle_finger_pip', 'middle_finger_dip');
  connectPoints(hand, 'middle_finger_dip', 'middle_finger_tip');
  
  // Ring finger
  connectPoints(hand, 'wrist', 'ring_finger_mcp');
  connectPoints(hand, 'ring_finger_mcp', 'ring_finger_pip');
  connectPoints(hand, 'ring_finger_pip', 'ring_finger_dip');
  connectPoints(hand, 'ring_finger_dip', 'ring_finger_tip');
  
  // Pinky
  connectPoints(hand, 'wrist', 'pinky_finger_mcp');
  connectPoints(hand, 'pinky_finger_mcp', 'pinky_finger_pip');
  connectPoints(hand, 'pinky_finger_pip', 'pinky_finger_dip');
  connectPoints(hand, 'pinky_finger_dip', 'pinky_finger_tip');
  
  // Palm
  connectPoints(hand, 'wrist', 'index_finger_mcp');
  connectPoints(hand, 'wrist', 'middle_finger_mcp');
  connectPoints(hand, 'wrist', 'ring_finger_mcp');
  connectPoints(hand, 'wrist', 'pinky_finger_mcp');
}


function connectPoints(hand, name1, name2) {
  let point1 = hand[name1];
  let point2 = hand[name2];
  if (point1 && point2) {
    line(point1.x, point1.y, point2.x, point2.y);
  }
}


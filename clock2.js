let video;
let poseNet;
let wristX = 0;
let wristY = 0;
let gradientRadius = 300;
let showText = true; 
let newText = true;
let newText2 = true;
let hoursLeft;
let minutesLeft;
let secondsLeft;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 100);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide(); 
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  hoursLeft = 24 - hour();
  minutesLeft = 60 - minute();
  secondsLeft = 60 - second();
}

function modelLoaded() {
  console.log('PoseNet model loaded');
}

function gotPoses(poses) {
  if (poses.length > 0) {
    let wrist = poses[0].pose.keypoints[10];
    wristX = wrist.position.x;
    wristY = wrist.position.y;
  }
}

function draw() {
  image(video, 0, 0, width, height);

  let h = hour();
  let m = minute();
  let s = second();

  linearGradientFill(
    width/2, 100, 
    width/2, height-100, 
    color(47, 56, 99, 100), 
    color(47, 30, 41, 100) 
  );

  push();
  translate(width/2, height/2);
  strokeWeight(5);
  let secondAngle = map(s, 0, 60, 0, 360);
  rotate(secondAngle);
  stroke(220, 50, 38, 100); 
  line(0, 0, 0, -200);
  pop();

  push();
  translate(width/2, height/2);
  strokeWeight(7);
  let minuteAngle = map(m, 0, 60, 0, 360);
  rotate(minuteAngle);
  stroke(220, 52, 26, 100); 
  line(0, 0, 0, -250);
  pop();

  push();
  translate(width/2, height/2);
  strokeWeight(10);
  if (h > 11) {
    h = h - 12;
  }
  let hourAngle = map(h, 0, 12, 0, 360);
  rotate(hourAngle);
  stroke(220, 100, 15, 100);
  line(0, 0, 0, -150);
  pop();

  //wrist and clock touch
  let d = dist(wristX, wristY, width/2, height/2);
  if (d < gradientRadius) {
    // wrist circle
    fill(255, 0, 0);
    ellipse(wristX, wristY, 20, 20);
    
    //changed clock color
    fill(0, 0, 255, 50);
    ellipse(width/2, height/2, gradientRadius * 2);
    
    // hide the text
    showText = false;
    newText = true;
    newText2 = true;
  } else {
    //show the text
    showText = true;
    newText = false;
    newText2 = false;
  }
    
  //main hours circles
  strokeWeight(0);
  drawSpecialClockCircle(width/2, height/2 - 250, 17, 17); // 12
  drawSpecialClockCircle(width/2 + 250, height/2, 17, 17); // 3
  drawSpecialClockCircle(width/2, height/2 + 250, 17, 17); // 6
  drawSpecialClockCircle(width/2 - 250, height/2, 17, 17); // 9
//other hours smaller circles
  strokeWeight(0);
  drawNormalClockCircle(width/2 + 200 * cos(30), height/2 - 200 * sin(30), 10, 10); // 1
  drawNormalClockCircle(width/2 + 200 * cos(60), height/2 - 200 * sin(60), 10, 10); // 2
  drawNormalClockCircle(width/2 + 200 * cos(120), height/2 - 200 * sin(120), 10, 10); // 4
  drawNormalClockCircle(width/2 + 200 * cos(150), height/2 - 200 * sin(150), 10, 10); // 5
  drawNormalClockCircle(width/2 + 200 * cos(210), height/2 - 200 * sin(210), 10, 10); // 7
  drawNormalClockCircle(width/2 + 200 * cos(240), height/2 - 200 * sin(240), 10, 10); // 8
  drawNormalClockCircle(width/2 + 200 * cos(300), height/2 - 200 * sin(300), 10, 10); // 10
  drawNormalClockCircle(width/2 + 200 * cos(330), height/2 - 200 * sin(330), 10, 10); // 11

  if (showText) {
    push();
    noStroke(); 
    fill(219, 48, 19, 75);
    rectMode(CENTER);
    rect(width/2, height/2 + 150, 100, 50);
    pop();

    push();
    textAlign(CENTER, CENTER);
    textFont("Lato");
    textSize(30);
    fill(255);
    text("Wave", width/2, height/2 + 150);
    pop();
  }

  if (newText) {
    push();
    noStroke(); 
    fill(219, 48, 19, 90);
    rectMode(CENTER);
    rect(width/2, height/2 - 20, 435, 50);
    pop();

    push();
    textAlign(CENTER, CENTER);
    textFont("Lato");
    textSize(30);
    fill(255);
    text(hoursLeft + ":" + minutesLeft + ":" + secondsLeft + " till the end of the day", width/2, height/2 - 20);
    pop();
  }

  if (newText2) {
    push();
    noStroke(); 
    fill(313, 87, 53, 85);
    rectMode(CENTER);
    let textNew2X = width / 2;
    let textNew2Y = height / 2 + 80;
    let textNew2Width = 290;
    let textNew2Height = 72;
    rect(textNew2X, textNew2Y, textNew2Width + 30, textNew2Height + 30);

    textAlign(CENTER, CENTER);
    textFont("Lato");
    textSize(30);
    fill(255);
    text("Maximize your day, every tick is a chance!", textNew2X, textNew2Y, textNew2Width, textNew2Height);
    pop();
}
}
//gradient filling of the clock
function linearGradientFill(x1, y1, x2, y2, colorS, colorE) {
  let gradient = drawingContext.createLinearGradient(
    x1, y1, x2, y2
  );
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);

  drawingContext.fillStyle = gradient;
  drawingContext.beginPath();
  drawingContext.arc(width/2, height/2, gradientRadius, 0, TWO_PI);
  drawingContext.fill();
}

function drawSpecialClockCircle(x, y, w, h) {
  fill(220, 43, 33, 100); 
  ellipse(x, y, w, h);
}

//(1, 2, 4, 5, 7, 8, 10, 11)
function drawNormalClockCircle(x, y, w, h) {
  fill(220, 59, 57, 58);
  ellipse(x, y, w, h);
}
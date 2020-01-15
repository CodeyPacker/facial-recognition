const video = document.querySelector('.webcam');

const canvas = document.querySelector('.video');
const ctx = canvas.getContext('2d');
ctx.strokeStyle = '#fff';
ctx.lineWidth = 2;

const faceCanvas = document.querySelector('.face');
const faceCtx = canvas.getContext('2d');

// make a new face detector
const faceDetector = new window.FaceDetector();

// populate the users video
async function populateVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 360 }
  });

  video.srcObject = stream;
  await video.play();
  // size canvases to same height as video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  faceCanvas.width = video.videoWidth;
  faceCanvas.height = video.videoHeight;
}

async function detect() {
  const faces = await faceDetector.detect(video);
  // ask the browser when the next animation frame is, and tell it to run detect
  faces.forEach(drawFace);
  requestAnimationFrame(detect);
}

function drawFace(face) {
  const { width, height, top, left } = face.boundingBox;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(left, top, width, height);
}

populateVideo().then(detect);

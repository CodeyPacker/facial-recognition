const video = document.querySelector('.webcam');
const canvas = document.querySelector('.video');
const ctx = canvas.getContext('2d');
const faceCanvas = document.querySelector('.face');
const faceCtx = faceCanvas.getContext('2d');
const size = 10;
const scale = 1.35;
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
  faces.forEach(sensor);
  requestAnimationFrame(detect);
}

function drawFace(face) {
  const { width, height, top, left } = face.boundingBox;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(left, top, width, height);
}

function sensor({ boundingBox: face }) { // destructure bounding box from face, rename it to face
  faceCtx.imageSmoothingEnabled = false; // Keeps it pixelated
  faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
  // take a snapshot of the bounding box, but shrink it to 10px
  // then scale it back up, so it loses img quality/gets pixelated.
  faceCtx.drawImage(
    // 5 src args
    video, // where the src comes from
    face.x, // where we start
    face.y,
    face.width,
    face.height,
    // 4 draw args
    face.x,
    face.y, // where we should start drawing the x and y
    size,
    size
  )

  const width = face.width * scale;
  const height = face.height * scale;
  // draw the small face back on, but scaled up
  faceCtx.drawImage(
    // 5 src args
    faceCanvas, // source
    face.x,
    face.y,
    size,
    size,
    // 4 draw args
    face.x - (width - face.width) / 2,
    face.y - (height - face.height) / 2, // where we should start drawing the x and y
    width,
    height,
  )
}

populateVideo().then(detect);

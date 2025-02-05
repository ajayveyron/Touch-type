// DOM Elements
const video = document.getElementById("webcam");
const canvas = document.getElementById("overlayCanvas");
const ctx = canvas.getContext("2d");
const textElement = document.getElementById("variableFontText");

// Set canvas dimensions
canvas.width = 640;
canvas.height = 480;

// Initialize MediaPipe Hands
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

// Configure MediaPipe Hands
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

// Initialize camera
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480,
});

// Smoothing variables
const smoothingFactor = 0.8;
let smoothedWeight = 400; // Start with middle weight
let smoothedSize = 6; // Start with 6rem font size
let smoothedSlant = 0; // Start with no slant

// Helper function to calculate distance between two points
function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Map a value from one range to another
function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Process hand landmarks and update font weight and size
hands.onResults((results) => {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];

    // Draw hand landmarks for debugging
    drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
      color: "#00FF00",
      lineWidth: 2,
    });
    drawLandmarks(ctx, landmarks, { color: "#FF0000", lineWidth: 1 });

    // Get thumb tip (landmark 4) and index finger tip (landmark 8)
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];

    // Calculate distance between thumb and index finger for weight
    const distance = calculateDistance(
      thumbTip.x * canvas.width,
      thumbTip.y * canvas.height,
      indexTip.x * canvas.width,
      indexTip.y * canvas.height
    );

    // Map the distance to font weight (100-900)
    const weight = mapRange(distance, 20, 200, 100, 900);

    // Get hand height position (using index finger MCP joint - landmark 5)
    const handHeight = landmarks[5].y;

    // Get hand horizontal position for slant
    const handX = landmarks[5].x;

    // Map hand height to font size (2rem to 12rem)
    // Note: Y coordinates are inverted (0 is top, 1 is bottom)
    const fontSize = mapRange(handHeight, 0.8, 0.2, 2, 12);

    // Map hand X position to slant angle (-15 to 15 degrees)
    const slant = mapRange(handX, 0.2, 0.8, -15, 15);

    // Apply smoothing to weight, size and slant
    smoothedWeight =
      smoothedWeight * smoothingFactor + weight * (1 - smoothingFactor);
    smoothedSize =
      smoothedSize * smoothingFactor + fontSize * (1 - smoothingFactor);
    smoothedSlant =
      smoothedSlant * smoothingFactor + slant * (1 - smoothingFactor);

    // Clamp the values
    const clampedWeight = Math.max(
      100,
      Math.min(900, Math.round(smoothedWeight))
    );
    const clampedSize = Math.max(2, Math.min(12, smoothedSize));
    const clampedSlant = Math.max(-15, Math.min(15, smoothedSlant));

    // Update the font weight, size and slant
    textElement.style.fontWeight = clampedWeight;
    textElement.style.fontSize = `${clampedSize}rem`;
    textElement.style.fontStyle = "oblique";
    textElement.style.transform = `skew(${clampedSlant}deg)`;
  }
});

// Start the camera
camera.start().catch((err) => {
  console.error("Error starting camera:", err);
  alert(
    "Error accessing camera. Please make sure you have granted camera permissions and are using HTTPS or localhost."
  );
});

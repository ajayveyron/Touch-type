# Goal

Build a webpage that does real-time hand-tracking through the user's webcam and modifies a variable font's properties based on finger positions. We'll do the following:

1. Use `navigator.mediaDevices.getUserMedia({ video: true })` to capture live video from the user's webcam
2. Integrate a hand-tracking library (MediaPipe Hands, TensorFlow.js Handpose, handtrack.js, or ML5.js)
3. Extract finger-joint landmarks, specifically the index finger tip (landmarks[8]) and the thumb tip (landmarks[4])
4. Compute the distance (or angle) between those fingertips
5. Map that distance to a CSS variable font parameter, like the "wght" axis for a variable font
6. Dynamically update the text in real time, so the font weight changes as the user moves their fingers

## Detailed Requirements

### 1. File Structure

- **index.html** – Contains the basic UI:
  - A `<video>` element to show the webcam feed
  - A `<canvas>` (if needed) to visualize landmarks (optional but helpful for debugging)
  - A text container that uses a variable font or references Wentin's font-playground
- **script.js** (optional) – Contains all the logic for:
  - Setting up the camera stream
  - Initializing and running the hand-tracking model
  - Calculating distances/angles from landmarks
  - Mapping those values to the variable font's properties
  - If referencing Wentin's font-playground, either clone or link it so we can manipulate the variable font controls from JavaScript

### 2. HTML Setup

- A `<video id="webcam" autoplay playsinline>` for the live feed
- A `<canvas id="overlayCanvas">` to optionally draw the hand landmarks for debugging
- A `<div id="variableFontText">Some text here</div>` or connect to Wentin's type playground
- Use a variable font that has a "wght" axis with a range (e.g., 100–900). If you want to embed a custom font, please do so

### 3. Hand-Tracking Integration

- If you pick MediaPipe Hands for JavaScript, do something like:
- If you pick TensorFlow.js Handpose, do:

### 4. Mapping Landmarks to Font Settings

- Example: measure the distance between index fingertip (landmarks[8]) and thumb tip (landmarks[4]). Use a small helper function
- Normalize or re-scale that distance for the range of font weight (e.g., 100–900):
  - Suppose the distance goes from 0.0 (fingers touching) to about 0.2 (fingers spread)
  - Map [0.0..0.2] → [100..900]
- Update the font in real-time

### 5. Real-Time Loop

Use either requestAnimationFrame or the library's built-in callback. For each frame:

1. Get the latest landmarks
2. Calculate distance → convert to weight
3. Update the font
4. Optionally draw the hand joints on `<canvas>` for debugging

### 6. Smoothing (Optional)

- Add some simple smoothing or averaging for the distance so the text doesn't jitter too much
- E.g., keep a rolling average of the last few frames or apply a low-pass filter

### 7. Performance Considerations

- We should run at ~30 FPS or so, but if performance lags, consider limiting your updates (e.g., only run detection every 2nd or 3rd frame) or lowering the model size

### 8. Finishing Touches

- Provide a basic CSS style for the page
- Show instructions on the webpage so the user knows how to move their fingers to adjust the font
- Confirm the code works over HTTPS or localhost so getUserMedia permissions are granted

## Deliverables

- A complete index.html with embedded or linked scripts, or index.html + script.js
- Basic instructions in comments so I can tweak the code
- A working demonstration that shows my text changing weight (or other variable font axes) as I move my fingers in front of the camera

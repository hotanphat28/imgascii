# Epic 2: High-Fidelity Media Capture

## 1. Context Gathering & Hypothesis
**[Product Owner]**
* **Context**: The tool currently has a mock export button. Users cannot extract the 3D ASCII art they've created.
* **Problem**: Digital artists and creators need a way to export high-quality WebM or GIF files of their animations to share on social media or integrate into other video software.
* **Hypothesis**: If we provide a reliable, high-fidelity media capture system that runs in the browser, users will successfully export and share their creations, leading to increased adoption and organic marketing.

## 2. Technical Context & Feasibility
**[Solution Architect]**
* **Constraints**: 
  * Capturing a WebGL canvas frame-by-frame can cause severe performance drops or dropped frames if tied directly to the main thread's requestAnimationFrame.
  * WebM/GIF encoding is CPU intensive.
* **Proposed Architecture**:
  * **Frame Extraction**: Hook into Three.js's rendering loop (`useFrame`). Pause the standard clock and manually advance time by `1/FPS` to ensure every single frame is rendered perfectly, even if the actual browser framerate drops during capture.
  * **Encoding Library**: Use `FFmpeg.wasm` (via a background Web Worker) to encode the captured frames into a `.webm` or `.gif` file. This prevents the main UI thread from locking up during the heavy encoding process.
  * **State Management**: Update the Zustand store to include `isExporting` and `exportProgress` variables.

## 3. Implementation Plan
**[Business Analyst]**
### Step 1: Export Settings UI
* Add a modal or expanding section in the sidebar for Export Settings.
* Inputs: Format (WebM, GIF), Duration (seconds), FPS (target framerate).

### Step 2: Canvas Capture Logic
* Implement a custom frame extractor for perfect fidelity:
  1. Freeze standard Three.js time.
  2. For `t = 0` to `duration`:
     - Render frame at time `t`.
     - Read pixels using `gl.readPixels()` or `canvas.toDataURL()`.
     - Send frame data to the Web Worker.

### Step 3: Web Worker Encoding
* Setup an `ffmpeg-worker.js` script.
* Load `FFmpeg.wasm`.
* Receive frames and run the `ffmpeg -framerate {FPS} -i img%d.png ... output.webm` command.
* Post `progress` messages back to the main thread.

### Step 4: Progress UI & Download
* Replace the mock "Export" button with a real progress bar listening to `exportProgress` in the Zustand store.
* Once encoding is complete, generate an Object URL and trigger a file download for the user.

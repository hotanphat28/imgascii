# Epic 4: Product Design Polish

## 1. Context Gathering & Hypothesis
**[Product Owner]**
* **Context**: The current UI is a functional throwaway layout built with basic TailwindCSS classes.
* **Problem**: The tool doesn't "feel" like a premium creative tool. A lack of aesthetic polish may deter professional artists from adopting it.
* **Hypothesis**: By redesigning the UI to embrace a "retro/brutalist" aesthetic tailored for digital artists and adding advanced creative controls, we will significantly improve user engagement, perceived value, and session lengths.

## 2. Technical Context & Feasibility
**[Solution Architect]**
* **Constraints**: 
  * The redesign must be implemented using Vanilla CSS or strictly styled TailwindCSS, avoiding heavily opinionated component libraries that clash with the brutalist aesthetic.
  * Advanced controls (like lighting and FOV) need to be efficiently wired to the Three.js scene without causing re-renders of the canvas.
* **Proposed Architecture**:
  * **Design System**: Establish a custom color palette, typography (using a modern Google Font like Space Mono or Inter), and spacing variables in `index.css` or Tailwind config.
  * **State Extension**: Expand the Zustand store to handle new parameters: `lightDirection` (Vector3), `cameraFov` (Number), and `bgImage` (String/URL).
  * **Shader Updates**: Ensure the ASCII shader can composite over an optional background image rather than just a solid color.

## 3. Implementation Plan
**[Business Analyst]**
### Step 1: Design System & Styling
* Define the Retro/Brutalist aesthetic:
  - High contrast (black/white/neon accents).
  - Monospaced typography for UI elements.
  - Sharp borders and pronounced drop shadows for panels.
* Apply these styles to the main layout and sidebar.

### Step 2: Advanced Controls UI
* Expand the sidebar into accordion sections or tabs (e.g., "Typography", "Scene", "Export").
* Add controls for:
  - **Lighting**: A 2D joystick or XY sliders to set light direction.
  - **Camera**: FOV slider to create dramatic perspectives.
  - **Background**: Image upload or URL input for the scene background.

### Step 3: WebGL & Shader Wiring
* Connect the `lightDirection` state to the `<directionalLight>` in the scene.
* Connect the `cameraFov` to the `<PerspectiveCamera>` and trigger a projection matrix update.
* Update the Custom WebGL ASCII Post-Processing shader to accept a background texture uniform and blend it appropriately behind the ASCII text mask.

### Step 4: Micro-interactions
* Add hover states, subtle transitions, and focus states to all inputs to ensure the tool feels alive and responsive.

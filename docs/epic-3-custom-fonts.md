# Epic 3: Custom Fonts & Inputs

## 1. Context Gathering & Hypothesis
**[Product Owner]**
* **Context**: The current `<Text3D>` component is using a hardcoded, standard Three.js font.
* **Problem**: Artists need typographic freedom. A single standard font does not allow for unique, expressive typography, which is central to ASCII art and graphic design.
* **Hypothesis**: By allowing users to upload custom `.ttf` or `.woff` files, we will unlock a core creative vector for the tool, making it useful for a wider variety of aesthetic use cases (e.g., logo design, posters).

## 2. Technical Context & Feasibility
**[Solution Architect]**
* **Constraints**: 
  * Three.js's `<Text3D>` typically requires a specific JSON font format (facetype.js). 
  * Parsing standard `.ttf`/`.woff` directly into 3D geometry in the browser can be complex and computationally expensive.
  * Very detailed fonts (e.g., script or distressed fonts) may generate too many vertices and tank WebGL performance.
* **Proposed Architecture**:
  * **Client-Side Parser**: Use a library like `opentype.js` or `three/examples/jsm/loaders/TTFLoader.js` to parse the uploaded `.ttf` file.
  * **Geometry Conversion**: Convert the parsed font into a `THREE.Font` object compatible with `@react-three/drei`'s `<Text3D>`.
  * **Performance Guardrails**: Add a complexity limit (e.g., max vertex count) or simplify the curve paths before generating the 3D geometry.
  * **Responsive Downscaling**: Automatically detect frame rate drops and dynamically decrease the ASCII density or text geometry resolution (`curveSegments`) if the FPS dips below a threshold, particularly for mobile devices.

## 3. Implementation Plan
**[Business Analyst]**
### Step 1: Font Upload UI
* Add a file input to the sidebar specifically accepting `.ttf` (and possibly `.woff` if supported by the loader).
* Include a drag-and-drop zone and error handling for invalid files.

### Step 2: Font Parsing Logic
* Implement the `TTFLoader` or `opentype.js` logic in a utility function.
* On successful load, parse the font and pass the resulting `THREE.Font` object to the Zustand store.

### Step 3: Scene Integration
* Update the `<Text3D>` component in the scene to reactively accept the `font` object from the store.
* Ensure proper fallback to the default font if parsing fails.

### Step 4: Responsive & Performance System
* Implement a `useFrame` hook to monitor average FPS.
* If FPS < 30 for 2 seconds:
  - Reduce `curveSegments` on `<Text3D>`.
  - Decrease the ASCII density uniform in the shader.
  - Show a small toast notification to the user: "Performance optimized for your device."

# ASCII-3D Generator // V2.0

A React application built with Vite, React Three Fiber, and Zustand for generating dynamic 3D ASCII art text effects. It features a brutalist UI, custom `.ttf` font support, live camera/lighting controls, and client-side `.webm` and `.gif` exports.

## Features

- **3D Text Rendering**: Dynamic text generation with customizable fonts, bevels, and animations (spin, wave, pulse).
- **Post-processing ASCII Effect**: A high-performance WebGL shader pass that maps screen luminance to an ASCII character ramp.
- **Media Capture**: Client-side recording using `@ffmpeg/wasm`.
- **Dynamic Performance Scaling**: Automatically adjusts curve segments and density if the frame rate drops.

## Recent Fixes & Improvements

- **WebGL 1 Compatibility Fix**: Addressed an issue in Three.js r163+ where explicitly requesting a WebGL 1 context would crash the `<Canvas>`. The renderer now correctly defaults to WebGL 2.
- **Performance Monitor Recovery**: Added an `onIncline` handler to the `@react-three/drei` `<PerformanceMonitor>`, ensuring that the "LOWERED PERF" warning and degraded quality recover gracefully once the frame rate stabilizes.
- **Default Resolution Density**: Fixed a bug where the default `density` setting was `0.15` (meaning each character consumed 15% of the screen width). It is now appropriately defaulted to `0.02` for clear readability.
- **Console Noise Suppression**: Silenced harmless but annoying console errors, including the `THREE.Clock` deprecation warning (emitted internally by R3F) and common Chrome extension connection errors (`Could not establish connection. Receiving end does not exist.`).

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

# imgascii - Project Context & Architecture

This document provides technical context and architectural decisions for the `imgascii` project.

## Overview

`imgascii` is a single-feature web application designed to convert uploaded images into ASCII art entirely on the client side. The project emphasizes speed, privacy, and a distinctive brutalist aesthetic.

## Tech Stack

- **Framework**: React (via Vite)
- **State Management**: Zustand
- **Styling**: Tailwind CSS (Vite plugin)
- **Image Processing**: Native HTML5 Canvas 2D API (`CanvasRenderingContext2D`)

## Architectural Decisions

### 1. Canvas 2D over WebGL
Initially, the project used Three.js and WebGL shaders for real-time 3D text generation and ASCII post-processing. When pivoting to a static image-to-ASCII converter, we decided to drop the WebGL stack.
- **Why?** Extracting a raw text file (`.txt`) from a WebGL fragment shader buffer is mathematically complex and less precise. By drawing the uploaded image to an off-screen standard 2D `<canvas>` and reading the pixel data via `getImageData()`, we can easily calculate luminance and map it to a character array. This also drastically reduced the bundle size.

### 2. Client-Side Only Processing
All image processing happens directly in the user's browser.
- **Why?** It ensures user privacy (no images are uploaded to a server) and eliminates the need for a backend service, keeping hosting costs to zero and operation instantaneous.

### 3. Brutalist Design System
The UI adheres strictly to a brutalist design language.
- **Characteristics**: High-contrast colors (black/white/neon), thick borders, sharp corners (no border-radius), uppercase text, and system monospace fonts.
- **Why?** It matches the retro, terminal-like vibe of ASCII art and sets the tool apart from generic modern web interfaces.

### 4. FFMpeg Removal
Previous iterations used FFMpeg for `.webm` video exports of 3D animations. This was removed.
- **Why?** Since the tool now processes static images, exporting can be handled natively using a Blob for `.txt` downloads and `canvas.toDataURL()` for `.png` exports, removing the heavy WASM overhead.

### 5. Deterministic Testing Strategy
The testing infrastructure utilizes `vitest`, `jsdom`, and `React Testing Library`. To keep tests fast and deterministic without complex Canvas API mocks, the core pixel-to-ASCII luminance math (`mapPixelToAscii`) was extracted into a pure function.
- **Why?** This adheres to the AAA (Arrange-Act-Assert) pattern and ensures core business logic is heavily tested (100% coverage on math and state) while keeping the test suite runtime under 2 seconds.

## Core Modules

- `src/AsciiConverter.js`: The heart of the application. Contains the pure function `mapPixelToAscii` for calculating luminance and mapping characters, and the asynchronous `imageToAscii` utility that handles drawing an image to a canvas, reading its pixel data, and outputting an ASCII string.
- `src/components/Sidebar.jsx`: Contains the UI controls (upload, resolution, contrast, colors, and export buttons).
- `src/App.jsx`: The layout wrapper and the `AsciiPreview` component, which renders the resulting ASCII string inside a scalable `<pre>` tag.
- `src/useStore.js`: The Zustand store maintaining the global state (uploaded image URL, settings, colors, and the generated ASCII text).

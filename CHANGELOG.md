# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-04

### Added
- **Image-to-ASCII Conversion**: A completely new 2D Canvas-based engine that processes uploaded images and converts them to ASCII art based on pixel luminance.
- **Controls Panel**: Added real-time sliders for Resolution (character width) and Contrast.
- **Invert Colors Toggle**: Added the ability to invert the ASCII character mapping.
- **Export to `.txt`**: Added functionality to download the raw text string exactly as shown in the preview.
- **Export to `.png`**: Added functionality to download the ASCII art rendered to an image file.
- **Drag-and-Drop Image Upload**: A simple, brutalist-styled file upload area.

### Changed
- **Project Name**: Renamed the project from `ascii-tool` to `imgascii`.
- **Architectural Pivot**: Transitioned from a 3D WebGL text generator to a 2D image processing tool.
- **UI Aesthetic**: Retained and refined the brutalist UI design (high-contrast, thick borders, monospace fonts) to fit the new layout.

### Removed
- **WebGL & Three.js Dependencies**: Removed `three`, `@react-three/fiber`, `@react-three/drei`, and `@react-three/postprocessing` as they are no longer needed for static 2D image conversion.
- **FFMpeg Dependencies**: Removed `@ffmpeg/core`, `@ffmpeg/ffmpeg`, and `@ffmpeg/util`. Client-side rendering is now handled entirely through the native Canvas API.

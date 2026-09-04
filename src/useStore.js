import { create } from 'zustand'

export const useStore = create((set) => ({
  text: "CYBER",
  ramp: " .:-=+*#%@",
  density: 0.02,
  foregroundColor: "#00ff00",
  backgroundColor: "#000000",
  animationType: "spin", // 'spin', 'wave', 'pulse', 'none'
  exportDuration: 5,
  exportFormat: 'webm', // 'webm' or 'gif'
  exportFps: 30,
  exportProgress: 0,
  exportPhase: 'idle', // 'idle', 'capturing', 'encoding'
  isExporting: false,
  
  lightDirection: [10, 10, 10],
  cameraFov: 50,
  bgImage: null,

  customFontData: null,
  customFontName: '',
  perfMode: false,
  textCurveSegments: 12,

  setText: (text) => set({ text }),
  setRamp: (ramp) => set({ ramp }),
  setDensity: (density) => set({ density }),
  setForegroundColor: (foregroundColor) => set({ foregroundColor }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setAnimationType: (animationType) => set({ animationType }),
  setExportDuration: (exportDuration) => set({ exportDuration }),
  setExportFormat: (exportFormat) => set({ exportFormat }),
  setExportFps: (exportFps) => set({ exportFps }),
  setExportProgress: (exportProgress) => set({ exportProgress }),
  setExportPhase: (exportPhase) => set({ exportPhase }),
  setIsExporting: (isExporting) => set({ isExporting }),
  setLightDirection: (lightDirection) => set({ lightDirection }),
  setCameraFov: (cameraFov) => set({ cameraFov }),
  setBgImage: (bgImage) => set({ bgImage }),
  setCustomFont: (customFontData, customFontName) => set({ customFontData, customFontName }),
  setPerfMode: (perfMode) => set({ perfMode }),
  setTextCurveSegments: (textCurveSegments) => set({ textCurveSegments }),
}))

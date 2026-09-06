import { create } from 'zustand'

export const useStore = create((set) => ({
  imageUrl: null,
  ramp: " .:-=+*#%@",
  resolution: 100, // width in characters
  invertColors: false,
  contrast: 1, // multiplier
  foregroundColor: "#00ff00",
  backgroundColor: "#000000",
  asciiText: "",

  setImageUrl: (imageUrl) => set({ imageUrl }),
  setRamp: (ramp) => set({ ramp }),
  setResolution: (resolution) => set({ resolution }),
  setInvertColors: (invertColors) => set({ invertColors }),
  setContrast: (contrast) => set({ contrast }),
  setForegroundColor: (foregroundColor) => set({ foregroundColor }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setAsciiText: (asciiText) => set({ asciiText }),
}))

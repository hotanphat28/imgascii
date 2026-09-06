import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../useStore';

describe('useStore', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useStore.setState({
      imageUrl: null,
      ramp: " .:-=+*#%@",
      resolution: 100,
      invertColors: false,
      contrast: 1,
      foregroundColor: "#00ff00",
      backgroundColor: "#000000",
      asciiText: "",
    });
  });

  it('should initialize with correct default values', () => {
    const state = useStore.getState();
    expect(state.imageUrl).toBeNull();
    expect(state.ramp).toBe(" .:-=+*#%@");
    expect(state.resolution).toBe(100);
    expect(state.invertColors).toBe(false);
    expect(state.contrast).toBe(1);
    expect(state.foregroundColor).toBe("#00ff00");
    expect(state.backgroundColor).toBe("#000000");
    expect(state.asciiText).toBe("");
  });

  it('setImageUrl updates the imageUrl state', () => {
    useStore.getState().setImageUrl('test-image.jpg');
    expect(useStore.getState().imageUrl).toBe('test-image.jpg');
  });

  it('setRamp updates the ramp state', () => {
    useStore.getState().setRamp('█▓▒░ ');
    expect(useStore.getState().ramp).toBe('█▓▒░ ');
  });

  it('setResolution updates the resolution state', () => {
    useStore.getState().setResolution(200);
    expect(useStore.getState().resolution).toBe(200);
  });

  it('setInvertColors updates the invertColors state', () => {
    useStore.getState().setInvertColors(true);
    expect(useStore.getState().invertColors).toBe(true);
  });

  it('setContrast updates the contrast state', () => {
    useStore.getState().setContrast(1.5);
    expect(useStore.getState().contrast).toBe(1.5);
  });

  it('setForegroundColor updates the foregroundColor state', () => {
    useStore.getState().setForegroundColor('#ff0000');
    expect(useStore.getState().foregroundColor).toBe('#ff0000');
  });

  it('setBackgroundColor updates the backgroundColor state', () => {
    useStore.getState().setBackgroundColor('#ffffff');
    expect(useStore.getState().backgroundColor).toBe('#ffffff');
  });

  it('setAsciiText updates the asciiText state', () => {
    useStore.getState().setAsciiText('HELLO ASCII');
    expect(useStore.getState().asciiText).toBe('HELLO ASCII');
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../useStore';

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
      text: 'HELLO',
      ramp: ' .:-=+*#%@',
      density: 0.05,
      foregroundColor: '#ffffff',
      backgroundColor: '#000000',
      animationType: 'none',
      exportDuration: 3,
      exportFormat: 'webm',
      exportFps: 30,
      exportProgress: 0,
      exportPhase: 'idle',
      isExporting: false,
      lightDirection: [10, 10, 10],
      cameraFov: 50,
      bgImage: null,
      customFontData: null,
      customFontName: '',
      perfMode: false,
      textCurveSegments: 12,
    });
  });

  it('should initialize with correct default values', () => {
    const state = useStore.getState();
    expect(state.text).toBe('HELLO');
    expect(state.ramp).toBe(' .:-=+*#%@');
    expect(state.density).toBe(0.05);
    expect(state.isExporting).toBe(false);
  });

  it('setText should update the text state', () => {
    useStore.getState().setText('TESTING');
    expect(useStore.getState().text).toBe('TESTING');
  });

  it('setCustomFont should update font data and name', () => {
    useStore.getState().setCustomFont({ glyphs: {} }, 'MyFont.ttf');
    expect(useStore.getState().customFontData).toEqual({ glyphs: {} });
    expect(useStore.getState().customFontName).toBe('MyFont.ttf');
  });

  it('setPerfMode should update perfMode', () => {
    useStore.getState().setPerfMode(true);
    expect(useStore.getState().perfMode).toBe(true);
  });
});

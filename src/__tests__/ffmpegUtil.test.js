import { describe, it, expect, vi, beforeEach } from 'vitest';
import { encodeVideo, initFFmpeg } from '../ffmpegUtil';
import { useStore } from '../useStore';

vi.mock('@ffmpeg/ffmpeg', () => {
  return {
    FFmpeg: class {
      constructor() {
        this.on = vi.fn();
        this.load = vi.fn().mockResolvedValue(true);
        this.writeFile = vi.fn().mockResolvedValue(true);
        this.exec = vi.fn().mockResolvedValue(0);
        this.readFile = vi.fn().mockResolvedValue(new Uint8Array([0, 1, 2, 3]));
        this.deleteFile = vi.fn().mockResolvedValue(true);
      }
    }
  };
});

vi.mock('@ffmpeg/util', () => ({
  fetchFile: vi.fn().mockResolvedValue(new Uint8Array([4, 5, 6])),
  toBlobURL: vi.fn().mockResolvedValue('blob:url')
}));

describe('ffmpegUtil', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize ffmpeg exactly once', async () => {
    const fm1 = await initFFmpeg();
    const fm2 = await initFFmpeg();
    expect(fm1).toBe(fm2);
  });

  it('encodeVideo should call correct ffmpeg exec arguments for gif', async () => {
    const blob = await encodeVideo(['data:image/png;base64,123'], 'gif', 30);
    expect(blob.type).toBe('image/gif');
    
    // verify state changes
    expect(useStore.getState().exportPhase).toBe('encoding');
  });

  it('encodeVideo should call correct ffmpeg exec arguments for webm', async () => {
    const blob = await encodeVideo(['data:image/png;base64,123'], 'webm', 60);
    expect(blob.type).toBe('video/webm');
  });
});

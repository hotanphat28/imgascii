import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useStore } from './useStore';

let ffmpeg = null;

export const initFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  
  ffmpeg = new FFmpeg();
  
  ffmpeg.on('progress', ({ progress, time }) => {
    // progress is a ratio 0 to 1
    useStore.getState().setExportProgress(progress * 100);
  });

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
};

export const encodeVideo = async (frames, format, fps) => {
  const fm = await initFFmpeg();
  
  useStore.getState().setExportPhase('encoding');
  useStore.getState().setExportProgress(0);

  // Write all frames to FFmpeg virtual FS
  for (let i = 0; i < frames.length; i++) {
    const num = i.toString().padStart(4, '0');
    // frames[i] is a data URL: data:image/png;base64,...
    await fm.writeFile(`frame${num}.png`, await fetchFile(frames[i]));
  }

  const outputName = `output.${format}`;
  
  // Run FFmpeg command
  // Input: frame0000.png, frame0001.png, etc.
  if (format === 'gif') {
    await fm.exec([
      '-framerate', `${fps}`,
      '-i', 'frame%04d.png',
      // For high quality gif, we should generate a palette, but let's keep it simple for now
      '-vf', 'split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
      '-loop', '0',
      outputName
    ]);
  } else {
    // WebM
    await fm.exec([
      '-framerate', `${fps}`,
      '-i', 'frame%04d.png',
      '-c:v', 'libvpx-vp9',
      '-pix_fmt', 'yuv420p',
      outputName
    ]);
  }

  const data = await fm.readFile(outputName);
  
  // Clean up frames
  for (let i = 0; i < frames.length; i++) {
    const num = i.toString().padStart(4, '0');
    await fm.deleteFile(`frame${num}.png`);
  }
  await fm.deleteFile(outputName);

  return new Blob([data.buffer], { type: format === 'gif' ? 'image/gif' : 'video/webm' });
};

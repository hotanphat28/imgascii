import { describe, it, expect } from 'vitest';
import { mapPixelToAscii } from '../AsciiConverter';

describe('AsciiConverter', () => {
  describe('mapPixelToAscii', () => {
    const rampArray = " .:-=+*#%@".split('');

    it('returns a space for fully transparent pixels', () => {
      expect(mapPixelToAscii(0, 0, 0, 0, rampArray, 1, false)).toBe(" ");
      expect(mapPixelToAscii(255, 255, 255, 0, rampArray, 1, false)).toBe(" ");
    });

    it('maps black to the first character of the ramp', () => {
      expect(mapPixelToAscii(0, 0, 0, 255, rampArray, 1, false)).toBe(" ");
    });

    it('maps white to the last character of the ramp', () => {
      expect(mapPixelToAscii(255, 255, 255, 255, rampArray, 1, false)).toBe("@");
    });

    it('inverts the mapping when invertColors is true', () => {
      expect(mapPixelToAscii(0, 0, 0, 255, rampArray, 1, true)).toBe("@");
      expect(mapPixelToAscii(255, 255, 255, 255, rampArray, 1, true)).toBe(" ");
    });

    it('applies contrast modifications', () => {
      // Middle gray
      const midChar = mapPixelToAscii(128, 128, 128, 255, rampArray, 1, false);
      const midCharHighContrast = mapPixelToAscii(128, 128, 128, 255, rampArray, 2, false);
      expect(midChar).toBe(midCharHighContrast);

      // Darker gray (luminance ~0.25)
      const darkerGrayNormal = mapPixelToAscii(64, 64, 64, 255, rampArray, 1, false);
      const darkerGrayHigh = mapPixelToAscii(64, 64, 64, 255, rampArray, 2, false);
      
      expect(rampArray.indexOf(darkerGrayHigh)).toBeLessThan(rampArray.indexOf(darkerGrayNormal));
      expect(darkerGrayHigh).toBe(" "); // clamped to 0
    });
  });
});

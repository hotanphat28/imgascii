import { Uniform, DataTexture, RGBAFormat, FloatType, NearestFilter } from 'three'
import { Effect } from 'postprocessing'
import * as THREE from 'three'

const fragmentShader = `
uniform sampler2D uCharacters;
uniform float uCharactersCount;
uniform float uDensity;
uniform vec3 uColor;
uniform sampler2D uBgImage;
uniform bool uHasBgImage;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // 1. Calculate cell sizes
    float aspect = resolution.x / resolution.y;
    vec2 cellSize = vec2(uDensity, uDensity * aspect);
    vec2 cellUv = floor(uv / cellSize) * cellSize;
    
    // 2. Sample original color at cell center
    vec4 sceneColor = texture2D(inputBuffer, cellUv + cellSize * 0.5);
    
    // 3. Compute luminance (brightness)
    float luma = dot(sceneColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // 4. Map luminance to a character index
    float charIndex = floor(luma * (uCharactersCount - 1.0));
    
    // 5. Calculate UVs for the character texture atlas
    vec2 charUv = fract(uv / cellSize); // 0 to 1 inside the cell
    charUv.x = (charUv.x + charIndex) / uCharactersCount;
    
    // Sample the character texture
    vec4 charSample = texture2D(uCharacters, charUv);
    
    // Final color: Apply the character mask
    float mask = charSample.r;
    
    if (mask > 0.5) {
        outputColor = vec4(uColor, 1.0);
    } else {
        if (uHasBgImage) {
            outputColor = texture2D(uBgImage, uv);
        } else {
            outputColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
    }
}
`

export class AsciiEffectImpl extends Effect {
  constructor({ ramp, density, color, bgTexture }) {
    super('AsciiEffect', fragmentShader, {
      uniforms: new Map([
        ['uCharacters', new Uniform(null)],
        ['uCharactersCount', new Uniform(ramp.length)],
        ['uDensity', new Uniform(density)],
        ['uColor', new Uniform(new THREE.Color(color))],
        ['uBgImage', new Uniform(bgTexture || null)],
        ['uHasBgImage', new Uniform(!!bgTexture)]
      ])
    })
    
    this.updateRamp(ramp)
  }

  updateRamp(ramp) {
    if (!ramp || ramp.length === 0) ramp = " ";
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    const charWidth = 64
    const charHeight = 64
    canvas.width = ramp.length * charWidth
    canvas.height = charHeight
    
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    for (let i = 0; i < ramp.length; i++) {
      ctx.fillText(ramp[i], i * charWidth + charWidth / 2, charHeight / 2)
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = NearestFilter
    texture.magFilter = NearestFilter
    
    this.uniforms.get('uCharacters').value = texture
    this.uniforms.get('uCharactersCount').value = ramp.length
  }

  updateDensity(density) {
    this.uniforms.get('uDensity').value = density
  }

  updateColor(color) {
    this.uniforms.get('uColor').value.set(color)
  }

  updateBgTexture(texture) {
    this.uniforms.get('uBgImage').value = texture
    this.uniforms.get('uHasBgImage').value = !!texture
  }
}

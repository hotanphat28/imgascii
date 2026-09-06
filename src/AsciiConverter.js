export function imageToAscii(imageUrl, options) {
  return new Promise((resolve, reject) => {
    const {
      ramp = " .:-=+*#%@",
      resolution = 100,
      invertColors = false,
      contrast = 1
    } = options

    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d", { willReadFrequently: true })

      // Calculate new dimensions
      // A typical monospace font has an aspect ratio of roughly 0.5 (width to height).
      // We adjust the height calculation to account for this so the image isn't squished.
      const fontAspect = 0.5
      const width = resolution
      const height = Math.floor((img.height / img.width) * width * fontAspect)

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)
      
      const imgData = ctx.getImageData(0, 0, width, height)
      const data = imgData.data

      let asciiStr = ""
      const rampArray = ramp.split('')
      const rampLength = rampArray.length

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const offset = (y * width + x) * 4
          const r = data[offset]
          const g = data[offset + 1]
          const b = data[offset + 2]
          const a = data[offset + 3]

          if (a === 0) {
            asciiStr += " "
            continue
          }

          // Calculate luminance
          let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

          // Apply contrast
          luminance = (luminance - 0.5) * contrast + 0.5
          luminance = Math.max(0, Math.min(1, luminance)) // Clamp to 0-1

          if (invertColors) {
            luminance = 1 - luminance
          }

          // Map to ramp
          const rampIndex = Math.floor(luminance * (rampLength - 1))
          asciiStr += rampArray[rampIndex]
        }
        asciiStr += "\n"
      }

      resolve(asciiStr)
    }
    img.onerror = reject
    img.src = imageUrl
  })
}

import React from 'react'
import { useStore } from '../useStore'

export function BrutalistInput({ label, type = "text", ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1 mb-1">{label}</label>
      <input 
        type={type} 
        className="bg-white border-2 border-black p-2 font-mono text-sm text-black focus:outline-none focus:bg-yellow-100 transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] disabled:opacity-50"
        {...props}
      />
    </div>
  )
}

export function Sidebar() {
  const { 
    imageUrl, setImageUrl,
    ramp, setRamp, 
    resolution, setResolution,
    invertColors, setInvertColors,
    contrast, setContrast,
    foregroundColor, setForegroundColor,
    backgroundColor, setBackgroundColor,
    asciiText
  } = useStore()

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImageUrl(url)
  }

  const handleExportTxt = () => {
    if (!asciiText) return
    const blob = new Blob([asciiText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "imgascii.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPng = () => {
    if (!asciiText) return
    
    // Create a canvas to draw the text
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // We need to measure the text to set canvas size
    const lines = asciiText.split('\n')
    // Remove the last empty line if it exists
    if (lines[lines.length - 1] === "") lines.pop()

    // Setup font
    const fontSize = 12
    const font = `${fontSize}px monospace`
    ctx.font = font
    
    // Measure width of one character (monospace)
    const charWidth = ctx.measureText('M').width
    const width = lines[0].length * charWidth
    // Approximate line height for monospace
    const lineHeight = fontSize * 1.2
    const height = lines.length * lineHeight

    // Add some padding
    const padding = 20
    canvas.width = width + padding * 2
    canvas.height = height + padding * 2

    // Fill background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw text
    ctx.font = font
    ctx.textBaseline = "top"
    ctx.fillStyle = foregroundColor
    
    lines.forEach((line, i) => {
      ctx.fillText(line, padding, padding + i * lineHeight)
    })

    const url = canvas.toDataURL("image/png")
    const a = document.createElement("a")
    a.href = url
    a.download = "imgascii.png"
    a.click()
  }

  return (
    <div className="w-96 bg-[#f4f4f0] border-r-4 border-black p-6 flex flex-col gap-8 overflow-y-auto z-10 text-black font-mono shadow-[8px_0_0_0_rgba(0,0,0,1)]">
      <div className="bg-black text-white p-4 -mx-6 -mt-6 mb-2 border-b-4 border-black">
        <h1 className="text-4xl font-black tracking-tighter uppercase">imgascii</h1>
        <p className="text-xs text-green-400 font-bold tracking-widest mt-1">IMAGE TO ASCII // V1.0</p>
      </div>
      
      {/* INPUT */}
      <div className="space-y-4">
        <h2 className="text-xl font-black uppercase bg-yellow-300 inline-block px-2 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] -rotate-1 mb-2">Input</h2>
        
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1 mb-1">Image Upload</label>
          <label className="cursor-pointer bg-white border-4 border-black border-dashed p-6 text-center font-bold hover:bg-yellow-100 transition-colors flex flex-col items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            {imageUrl ? "CHANGE IMAGE" : "CHOOSE IMAGE"}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="space-y-4">
        <h2 className="text-xl font-black uppercase bg-pink-300 inline-block px-2 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] rotate-1 mb-2">Controls</h2>
        
        <BrutalistInput 
          label="ASCII Character Ramp" 
          value={ramp} 
          onChange={(e) => setRamp(e.target.value || " ")} 
        />
        
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-black">Resolution ({resolution}ch)</label>
          </div>
          <input 
            type="range" 
            min="20" 
            max="300" 
            step="1" 
            value={resolution}
            onChange={(e) => setResolution(parseInt(e.target.value))}
            className="w-full h-4 bg-white border-2 border-black appearance-none cursor-pointer mt-1"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-black">Contrast ({contrast.toFixed(1)}x)</label>
          </div>
          <input 
            type="range" 
            min="0.1" 
            max="3" 
            step="0.1" 
            value={contrast}
            onChange={(e) => setContrast(parseFloat(e.target.value))}
            className="w-full h-4 bg-white border-2 border-black appearance-none cursor-pointer mt-1"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer font-bold uppercase text-sm mt-4 select-none">
          <input 
            type="checkbox" 
            checked={invertColors} 
            onChange={(e) => setInvertColors(e.target.checked)}
            className="w-5 h-5 border-2 border-black appearance-none checked:bg-black checked:after:content-['X'] checked:after:text-white checked:after:flex checked:after:justify-center checked:after:text-xs"
          />
          Invert Colors
        </label>
      </div>

      {/* AESTHETICS */}
      <div className="space-y-4">
        <h2 className="text-xl font-black uppercase bg-cyan-300 inline-block px-2 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] -rotate-1 mb-2">Aesthetics</h2>
        <div className="flex gap-4">
          <BrutalistInput 
            label="FG Color" 
            type="color" 
            value={foregroundColor} 
            onChange={(e) => setForegroundColor(e.target.value)} 
          />
          <BrutalistInput 
            label="BG Color" 
            type="color" 
            value={backgroundColor} 
            onChange={(e) => setBackgroundColor(e.target.value)} 
          />
        </div>
      </div>

      {/* EXPORT */}
      <div className="mt-auto pt-6">
        <div className="border-4 border-black p-4 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] space-y-4">
          <h2 className="text-lg font-black uppercase border-b-4 border-black pb-2">Export</h2>
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleExportPng}
              disabled={!asciiText}
              className="w-full bg-blue-400 hover:bg-blue-300 text-black font-black py-3 px-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
            >
              DOWNLOAD .PNG
            </button>
            <button 
              onClick={handleExportTxt}
              disabled={!asciiText}
              className="w-full bg-green-400 hover:bg-green-300 text-black font-black py-3 px-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
            >
              DOWNLOAD .TXT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

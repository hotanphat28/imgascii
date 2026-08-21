import React from 'react'
import { useStore } from '../useStore'
import { TTFLoader } from 'three-stdlib'

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

export function BrutalistSelect({ label, options, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1 mb-1">{label}</label>
      <select 
        className="bg-white border-2 border-black p-2 font-mono text-sm text-black focus:outline-none focus:bg-yellow-100 transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] disabled:opacity-50 appearance-none rounded-none cursor-pointer"
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

export function Sidebar() {
  const { 
    text, setText, 
    ramp, setRamp, 
    density, setDensity,
    foregroundColor, setForegroundColor,
    backgroundColor, setBackgroundColor,
    animationType, setAnimationType,
    exportFormat, setExportFormat,
    exportFps, setExportFps,
    exportDuration, setExportDuration,
    isExporting, setIsExporting,
    exportPhase, exportProgress,
    lightDirection, setLightDirection,
    cameraFov, setCameraFov,
    bgImage, setBgImage,
    customFontName,
    perfMode
  } = useStore()

  const handleExport = () => {
    setIsExporting(true)
  }

  const handleFontUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target.result
        const loader = new TTFLoader()
        const fontJson = loader.parse(arrayBuffer)
        useStore.getState().setCustomFont(fontJson, file.name)
      } catch (err) {
        console.error("Failed to parse font", err)
        alert("Failed to parse font file. Ensure it is a valid .ttf")
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="w-96 bg-[#f4f4f0] border-r-4 border-black p-6 flex flex-col gap-8 overflow-y-auto z-10 text-black font-mono shadow-[8px_0_0_0_rgba(0,0,0,1)]">
      <div className="bg-black text-white p-4 -mx-6 -mt-6 mb-2 border-b-4 border-black">
        <h1 className="text-3xl font-bold tracking-tighter uppercase">ASCII-3D</h1>
        <p className="text-xs text-green-400 font-bold tracking-widest">GENERATOR // V2.0</p>
      </div>
      
      {/* TYPOGRAPHY */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-black uppercase bg-yellow-300 inline-block px-2 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] -rotate-1">Typography</h2>
          {perfMode && <span className="text-[10px] bg-red-500 text-white px-1 border border-black font-bold animate-pulse" data-testid="perf-badge">LOWERED PERF</span>}
        </div>
        
        <BrutalistInput 
          label="Text Content" 
          value={text} 
          onChange={(e) => setText(e.target.value.substring(0, 50))} 
        />

        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1 mb-1">Custom Font (.ttf)</label>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-black text-white px-3 py-2 font-mono text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1">
              Upload TTF
              <input type="file" accept=".ttf" onChange={handleFontUpload} className="hidden" data-testid="font-upload" />
            </label>
            <span className="text-xs truncate font-bold ml-2 max-w-[150px]" title={customFontName || 'None'}>
              {customFontName || 'Default Font'}
            </span>
          </div>
        </div>

        <BrutalistInput 
          label="ASCII Character Ramp" 
          value={ramp} 
          onChange={(e) => setRamp(e.target.value || " ")} 
        />
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1 mb-1">Resolution Density</label>
          <input 
            type="range" 
            min="0.01" 
            max="0.1" 
            step="0.005" 
            value={density}
            onChange={(e) => setDensity(parseFloat(e.target.value))}
            className="w-full h-4 bg-white border-2 border-black appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* AESTHETICS */}
      <div className="space-y-4">
        <h2 className="text-xl font-black uppercase bg-pink-300 inline-block px-2 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] rotate-1 mb-2">Aesthetics</h2>
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
        <BrutalistInput 
          label="Custom Background Image URL" 
          value={bgImage || ""} 
          onChange={(e) => setBgImage(e.target.value)}
          placeholder="https://..." 
        />
      </div>

      {/* SCENE */}
      <div className="space-y-4">
        <h2 className="text-xl font-black uppercase bg-cyan-300 inline-block px-2 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] -rotate-1 mb-2">Scene & Motion</h2>
        <BrutalistSelect 
          label="Animation Type" 
          value={animationType}
          onChange={(e) => setAnimationType(e.target.value)}
          options={[
            {value: "none", label: "STATIC"},
            {value: "spin", label: "SPIN_Y"},
            {value: "wave", label: "WAVE_SINE"},
            {value: "pulse", label: "PULSE_SCALE"}
          ]}
        />
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1 mb-1">Camera FOV ({cameraFov})</label>
          <input 
            type="range" 
            min="10" 
            max="120" 
            step="1" 
            value={cameraFov}
            onChange={(e) => setCameraFov(parseInt(e.target.value))}
            className="w-full h-4 bg-white border-2 border-black appearance-none cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1 mb-1">Light X Direction ({lightDirection[0]})</label>
          <input 
            type="range" 
            min="-20" 
            max="20" 
            step="1" 
            value={lightDirection[0]}
            onChange={(e) => setLightDirection([parseInt(e.target.value), lightDirection[1], lightDirection[2]])}
            className="w-full h-4 bg-white border-2 border-black appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* EXPORT */}
      <div className="mt-auto pt-6">
        <div className="border-4 border-black p-4 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] space-y-4">
          <h2 className="text-lg font-black uppercase border-b-4 border-black pb-2">Export</h2>
          <div className="flex gap-2">
            <BrutalistSelect 
              label="Format" 
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              disabled={isExporting}
              options={[{value:"webm", label:".WEBM"}, {value:"gif", label:".GIF"}]}
            />
            <BrutalistSelect 
              label="FPS" 
              value={exportFps}
              onChange={(e) => setExportFps(parseInt(e.target.value))}
              disabled={isExporting}
              options={[{value:"30", label:"30FPS"}, {value:"60", label:"60FPS"}]}
            />
            <BrutalistSelect 
              label="Duration" 
              value={exportDuration}
              onChange={(e) => setExportDuration(parseInt(e.target.value))}
              disabled={isExporting}
              options={[{value:"3", label:"3s"}, {value:"5", label:"5s"}, {value:"10", label:"10s"}]}
            />
          </div>

          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-blue-500 hover:bg-blue-400 text-black font-black text-xl py-4 px-4 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 flex flex-col items-center justify-center relative overflow-hidden"
          >
            {isExporting && (
              <div 
                className="absolute left-0 top-0 bottom-0 bg-yellow-400 transition-all duration-200 ease-out border-r-4 border-black"
                style={{ width: `${exportProgress}%` }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 mix-blend-difference text-white">
              {isExporting 
                ? `${exportPhase === 'capturing' ? 'CAPTURING...' : 'ENCODING...'} ${Math.round(exportProgress)}%` 
                : `RENDER ${exportFormat.toUpperCase()}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

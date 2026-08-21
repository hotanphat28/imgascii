import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useStore } from './useStore'
import { encodeVideo } from './ffmpegUtil'

export function ExportSystem() {
  const { gl } = useThree()
  const framesRef = useRef([])
  const frameCountRef = useRef(0)
  const isCapturingRef = useRef(false)
  
  const { 
    isExporting, 
    exportDuration, 
    exportFps, 
    exportFormat,
    setExportPhase, 
    setExportProgress,
    setIsExporting
  } = useStore()

  useEffect(() => {
    if (isExporting) {
      framesRef.current = []
      frameCountRef.current = 0
      isCapturingRef.current = true
      setExportPhase('capturing')
      setExportProgress(0)
    } else {
      isCapturingRef.current = false
    }
  }, [isExporting, setExportPhase, setExportProgress])

  // Priority 2 ensures this runs AFTER the EffectComposer (priority 1) has rendered the scene
  useFrame((state) => {
    if (!isCapturingRef.current) return

    const totalFrames = exportDuration * exportFps
    const timeStep = 1 / exportFps

    // Force the clock to our exact deterministic time
    state.clock.elapsedTime = frameCountRef.current * timeStep
    
    try {
        // Because this runs immediately after the render loop (before buffer swap),
        // we can grab the canvas data without preserveDrawingBuffer: true
        const dataUrl = gl.domElement.toDataURL('image/png')
        framesRef.current.push(dataUrl)
        
        frameCountRef.current += 1
        const progress = (frameCountRef.current / totalFrames) * 100
        setExportProgress(progress)

        if (frameCountRef.current >= totalFrames) {
            isCapturingRef.current = false
            processEncoding(framesRef.current, exportFormat, exportFps)
        }
    } catch (e) {
        console.error("Failed to capture frame", e);
        isCapturingRef.current = false;
        setIsExporting(false);
        setExportPhase('idle');
    }
  }, 2)

  const processEncoding = async (frames, format, fps) => {
    try {
      const blob = await encodeVideo(frames, format, fps)
      
      // Trigger download
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ascii-art.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
    } catch (err) {
      console.error("Encoding failed", err)
      alert("Encoding failed: " + err.message)
    } finally {
      setIsExporting(false)
      setExportPhase('idle')
      setExportProgress(0)
    }
  }

  return null
}

import React, { useEffect, useRef } from 'react'
import { Sidebar } from './components/Sidebar.jsx'
import { useStore } from './useStore'
import { imageToAscii } from './AsciiConverter'

function AsciiPreview() {
  const { 
    imageUrl, ramp, resolution, invertColors, contrast, 
    foregroundColor,
    asciiText, setAsciiText
  } = useStore()
  
  const containerRef = useRef(null)

  useEffect(() => {
    if (!imageUrl) {
      setAsciiText("")
      return
    }

    let isMounted = true

    imageToAscii(imageUrl, { ramp, resolution, invertColors, contrast })
      .then(text => {
        if (isMounted) setAsciiText(text)
      })
      .catch(err => {
        console.error("Failed to convert image to ASCII", err)
      })

    return () => {
      isMounted = false
    }
  }, [imageUrl, ramp, resolution, invertColors, contrast, setAsciiText])

  if (!imageUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center opacity-50 p-8 text-center" style={{ color: foregroundColor }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="mb-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <h2 className="text-2xl font-black uppercase">No Image Uploaded</h2>
        <p className="mt-2 font-bold max-w-md">Use the sidebar to select an image from your computer to begin the conversion process.</p>
      </div>
    )
  }

  // Calculate font size dynamically based on container width and resolution
  // We use a CSS variable to pass it to the PRE element.

  // We want the text to fit within the container. 
  // We will let CSS handle scaling or just use a fixed font size and let it scroll.
  // Given brutalist style, scrolling or tiny text is fine, but scaling to fit is better.
  
  return (
    <div 
      className="w-full h-full overflow-auto p-4 flex items-center justify-center relative" 
      ref={containerRef}
    >
      {/* We use a flex container that can scroll. If the text is huge, it overflows. 
          If it's small, it centers. */}
      <pre 
        className="font-mono leading-none m-0 p-4 border-4 border-transparent hover:border-white/20 transition-colors"
        style={{ 
          color: foregroundColor,
          fontSize: '10px', // base size, can be made dynamic or controllable if needed
          lineHeight: '1.2', // slightly taller for better readability in 2D
          letterSpacing: '0em',
        }}
      >
        {asciiText}
      </pre>
    </div>
  )
}

function App() {
  const { backgroundColor } = useStore()

  return (
    <div className="flex h-screen w-screen overflow-hidden font-mono bg-black">
      <Sidebar />
      <div className="flex-1 relative border-l-4 border-black overflow-hidden" style={{ backgroundColor }}>
        <AsciiPreview />
      </div>
    </div>
  )
}

export default App

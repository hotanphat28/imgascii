import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text3D, Center, PerspectiveCamera, PerformanceMonitor } from '@react-three/drei'
import { EffectComposer } from '@react-three/postprocessing'
import { AsciiEffect } from './AsciiEffect.jsx'
import { useStore } from './useStore'
import { ExportSystem } from './ExportSystem.jsx'
import * as THREE from 'three'
import { Sidebar } from './components/Sidebar.jsx'

const FONT_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json'

function AnimatedText() {
  const { text, animationType, customFontData, textCurveSegments } = useStore()
  const ref = useRef()

  useFrame((state, delta) => {
    if (!ref.current) return
    if (animationType === 'spin') {
      ref.current.rotation.y += delta * 0.5
    } else if (animationType === 'wave') {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.5
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2
    } else if (animationType === 'pulse') {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1
      ref.current.scale.set(scale, scale, scale)
    } else {
      ref.current.rotation.set(0, 0, 0)
      ref.current.position.set(0, 0, 0)
      ref.current.scale.set(1, 1, 1)
    }
  })

  return (
    <Center>
      <group ref={ref}>
        <Text3D
          font={customFontData || FONT_URL}
          size={2}
          height={0.5}
          curveSegments={textCurveSegments}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          {text || " "}
          <meshStandardMaterial color="#ffffff" />
        </Text3D>
      </group>
    </Center>
  )
}

function TextureLoaderHelper({ url, onLoaded }) {
  useEffect(() => {
    if (!url) {
      onLoaded(null)
      return
    }
    const loader = new THREE.TextureLoader()
    loader.load(
      url, 
      (tex) => onLoaded(tex),
      undefined,
      (err) => {
        console.error("Error loading background image:", err)
        onLoaded(null)
      }
    )
  }, [url, onLoaded])
  return null
}

function Scene() {
  const { 
    ramp, density, foregroundColor, 
    lightDirection, cameraFov, bgImage 
  } = useStore()
  
  const [bgTexture, setBgTexture] = useState(null)

  return (
    <>
      <PerspectiveCamera makeDefault fov={cameraFov} position={[0, 0, 10]} />
      <TextureLoaderHelper url={bgImage} onLoaded={setBgTexture} />

      <ambientLight intensity={0.5} />
      <directionalLight position={lightDirection} intensity={1} />
      <directionalLight position={[-10, -10, -10]} intensity={0.2} />
      
      <AnimatedText />
      
      <EffectComposer disableNormalPass multisampling={0}>
        <AsciiEffect ramp={ramp} density={density} color={foregroundColor} bgTexture={bgTexture} />
      </EffectComposer>
      
      <OrbitControls />
      <PerformanceMonitor 
        onDecline={() => {
          if (!useStore.getState().perfMode) {
            useStore.getState().setPerfMode(true)
            useStore.getState().setTextCurveSegments(4)
            const currentDensity = useStore.getState().density
            useStore.getState().setDensity(Math.max(0.01, currentDensity - 0.02))
          }
        }}
        onIncline={() => {
          if (useStore.getState().perfMode) {
            useStore.getState().setPerfMode(false)
            // Optionally restore some quality here if desired, 
            // but keeping it simple for now to avoid rapid oscillation.
          }
        }}
      />
    </>
  )
}

// Sidebar component extracted to src/components/Sidebar.jsx

function App() {
  const { backgroundColor } = useStore()

  return (
    <div className="flex h-screen w-screen overflow-hidden font-mono bg-black">
      <Sidebar />
      <div className="flex-1 relative border-l-4 border-black" style={{ backgroundColor }}>
        <Canvas gl={{ antialias: false, alpha: false }}>
          <Scene />
          <ExportSystem />
        </Canvas>
      </div>
    </div>
  )
}

export default App

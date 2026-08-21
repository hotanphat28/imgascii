import React, { forwardRef, useMemo, useEffect } from 'react'
import { AsciiEffectImpl } from './AsciiEffect.js'

export const AsciiEffect = forwardRef(({ ramp, density, color, bgTexture }, ref) => {
  const effect = useMemo(() => new AsciiEffectImpl({ ramp, density, color, bgTexture }), [])

  useEffect(() => {
    effect.updateRamp(ramp)
  }, [ramp, effect])

  useEffect(() => {
    effect.updateDensity(density)
  }, [density, effect])

  useEffect(() => {
    effect.updateColor(color)
  }, [color, effect])

  useEffect(() => {
    effect.updateBgTexture(bgTexture)
  }, [bgTexture, effect])

  return <primitive ref={ref} object={effect} dispose={null} />
})

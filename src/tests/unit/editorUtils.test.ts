import { describe, it, expect } from 'vitest'
import { getFilterString, createManifest } from '@/utils/editorUtils'
import type { EditModel } from '@/types/editor'

describe('Editor Utilities', () => {
  const mockEdits: EditModel = {
    brightness: 120,
    contrast: 90,
    saturation: 100,
    grayscale: 50,
    sepia: 0,
    crop: null,
  }

  it('should generate correct CSS filter string', () => {
    const expected = 'brightness(120%) contrast(90%) saturate(100%) grayscale(50%) sepia(0%)'
    expect(getFilterString(mockEdits)).toBe(expected)
  })

  it('should create a valid JSON manifest structure', () => {
    const fileName = 'test-image.jpg'
    const manifest = createManifest(fileName, mockEdits)

    expect(manifest.source).toBe(fileName)
    expect(manifest.operations.brightness).toBe(120)
    expect(manifest.version).toBe('1.0')
    expect(manifest).toHaveProperty('exportedAt')
  })

  it('should handle default values correctly', () => {
    const defaultEdits: EditModel = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      grayscale: 0,
      sepia: 0,
      crop: null,
    }
    const expected = 'brightness(100%) contrast(100%) saturate(100%) grayscale(0%) sepia(0%)'
    expect(getFilterString(defaultEdits)).toBe(expected)
  })
})

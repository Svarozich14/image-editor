import type { EditModel } from '@/types/editor'

// Pure function for filter string generation
export const getFilterString = (edits: EditModel): string => {
  return (
    `brightness(${edits.brightness}%) contrast(${edits.contrast}%) ` +
    `saturate(${edits.saturation}%) grayscale(${edits.grayscale}%) sepia(${edits.sepia}%)`
  )
}

// Pure function for JSON manifest creation
export const createManifest = (fileName: string, edits: EditModel) => {
  return {
    source: fileName,
    operations: { ...edits },
    exportedAt: new Date().toISOString(),
    version: '1.0',
  }
}

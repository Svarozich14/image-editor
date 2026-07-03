import { useImageEditorStore } from '@/stores/imageEditor'

/**
 * Composable for handling image and metadata export.
 * Implements non-destructive rendering pipeline using HTML5 Canvas.
 */
export function useImageExporter() {
  const store = useImageEditorStore()

  /**
   * Triggers a browser download for a given Blob.
   * Ensures memory safety by revoking the object URL after use.
   */
  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  /**
   * Main export function. 
   * Derives the result from the original image based on the store's edit model.
   */
  const exportImage = async (): Promise<void> => {
    if (!store.originalImage) return

    const img = new Image()
    img.src = store.originalImage
    
    // Robust loading with error handling to prevent UI hanging
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = () => reject(new Error('Failed to load original image for export'))
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Determine target dimensions: use crop data or fallback to natural size
    const crop = store.edits.crop || {
      x: 0, 
      y: 0, 
      width: img.naturalWidth, 
      height: img.naturalHeight
    }

    canvas.width = crop.width
    canvas.height = crop.height

    // Apply the non-destructive filter model directly to the Canvas context
    ctx.filter = store.filterStyle

    // Draw the specific source rectangle to the destination canvas
    ctx.drawImage(
      img,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, crop.width, crop.height
    )

    // Export as high-quality JPEG
    canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `edited-${store.fileName}`)
      }
    }, 'image/jpeg', 0.95)
  }

  /**
   * Bonus: Exports the operation manifest as a JSON file.
   * This "recipe" allows for replaying edits on the original source.
   */
  const exportOperationsJson = () => {
    // Clean fileName by removing the existing extension to avoid double extensions like .jpeg.json
    const baseName = store.fileName.replace(/\.[^/.]+$/, "")

    const manifest = {
      version: "1.0",
      description: "Non-destructive edit operations manifest",
      sourceFile: store.fileName,
      operations: store.edits,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `recipe-${baseName}.json`)
  }

  return { exportImage, exportOperationsJson }
}
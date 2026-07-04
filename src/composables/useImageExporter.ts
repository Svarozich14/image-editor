import { useImageEditorStore } from '@/stores/imageEditor'

export function useImageExporter() {
  const store = useImageEditorStore()

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportImage = async () => {
    try {
      const img = await store.loadImage()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const crop = store.edits.crop || {
        x: 0,
        y: 0,
        width: img.naturalWidth,
        height: img.naturalHeight,
      }
      canvas.width = crop.width
      canvas.height = crop.height
      if (ctx) {
        ctx.filter = store.filterStyle
        ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
      }
      canvas.toBlob((b) => b && downloadBlob(b, `edited-${store.fileName}`), 'image/jpeg', 0.95)
    } catch (err) {
      console.error('Export failed:', err)
    }
  }

  const exportOperationsJson = () => {
    const baseName = store.fileName.replace(/\.[^/.]+$/, '')
    const manifest = { source: store.fileName, operations: store.edits }
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `recipe-${baseName}.json`)
  }

  return { exportImage, exportOperationsJson }
}

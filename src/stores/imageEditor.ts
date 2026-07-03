import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface CropData {
  x: number
  y: number
  width: number
  height: number
}

interface Edits {
  brightness: number
  contrast: number
  saturation: number
  grayscale: number // Bonus
  sepia: number     // Bonus
  crop: CropData | null
}

export const useImageEditorStore = defineStore('imageEditor', () => {
  const originalImage = ref<string | null>(null)
  const fileName = ref<string>('image.jpg')

  const defaultEdits: Edits = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: 0,
    sepia: 0,
    crop: null
  }

  const edits = ref<Edits>({ ...defaultEdits })

  // Computed property for real-time CSS preview and Canvas rendering
  const filterStyle = computed(() => {
    return `brightness(${edits.value.brightness}%) ` +
           `contrast(${edits.value.contrast}%) ` +
           `saturate(${edits.value.saturation}%) ` +
           `grayscale(${edits.value.grayscale}%) ` +
           `sepia(${edits.value.sepia}%)`
  })

  function setImage(url: string, name: string) {
    originalImage.value = url
    fileName.value = name
    resetEdits()
  }

  function resetEdits() {
    edits.value = { ...defaultEdits }
  }

  return {
    originalImage,
    edits,
    filterStyle,
    fileName,
    setImage,
    resetEdits
  }
})
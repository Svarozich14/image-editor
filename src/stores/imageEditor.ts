import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import type { EditModel } from '@/types/editor'
import { getFilterString } from '@/utils/editorUtils'

export const useImageEditorStore = defineStore('imageEditor', () => {
  const originalFile = ref<File | null>(null)
  const previewUrl = ref<string | null>(null)
  const fileName = ref<string>('')
  const cachedImage = shallowRef<HTMLImageElement | null>(null)
  const loadingGeneration = ref(0)

  const edits = ref<EditModel>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: 0,
    sepia: 0,
    crop: null,
  })

  const filterStyle = computed(() => getFilterString(edits.value))

  async function loadImage(): Promise<HTMLImageElement> {
    if (cachedImage.value && cachedImage.value.src === previewUrl.value) return cachedImage.value
    const currentGen = ++loadingGeneration.value
    return new Promise((resolve, reject) => {
      if (!previewUrl.value) return reject('No URL')
      const img = new Image()
      img.src = previewUrl.value
      img.onload = () => {
        if (currentGen === loadingGeneration.value) {
          cachedImage.value = img
          resolve(img)
        }
      }
      img.onerror = () => reject('Load error')
    })
  }

  function setImage(file: File) {
    clearImage()
    originalFile.value = file
    fileName.value = file.name
    previewUrl.value = URL.createObjectURL(file)
  }

  function clearImage() {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    originalFile.value = null
    previewUrl.value = null
    cachedImage.value = null
    fileName.value = ''
    resetEditor()
  }

  function resetEditor() {
    edits.value = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      grayscale: 0,
      sepia: 0,
      crop: null,
    }
  }

  return {
    originalFile,
    previewUrl,
    edits,
    filterStyle,
    fileName,
    loadImage,
    setImage,
    clearImage,
    resetEditor,
  }
})

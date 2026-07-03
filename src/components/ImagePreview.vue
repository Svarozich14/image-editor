<template>
  <div class="preview-container">
    <!-- Active Cropping Mode (shows full image + cropper UI) [2] -->
    <img 
      v-show="isCropping"
      ref="imageElement"
      :src="store.originalImage || ''" 
      alt="To be cropped"
      class="editor-image"
    />

    <!-- Applied Result Mode (shows only the cropped area with filters) [1] -->
    <canvas 
      v-show="!isCropping"
      ref="previewCanvas"
      class="result-canvas"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { useImageEditorStore } from '@/stores/imageEditor'

const props = defineProps<{
  isCropping: boolean
}>()

const store = useImageEditorStore()
const imageElement = ref<HTMLImageElement | null>(null)
const previewCanvas = ref<HTMLCanvasElement | null>(null)
let cropper: Cropper | null = null

/**
 * Initializes CropperJS for the selective area [2]
 * Updates the model (Pinia) in real-time [1]
 */
const initCropper = () => {
  if (!imageElement.value) return
  
  cropper = new Cropper(imageElement.value, {
    viewMode: 1,
    autoCropArea: 1,
    checkOrientation: false,
    crop(event) {
      // Non-destructive: we only store coordinates [1]
      store.edits.crop = {
        x: Math.round(event.detail.x),
        y: Math.round(event.detail.y),
        width: Math.round(event.detail.width),
        height: Math.round(event.detail.height)
      }
    }
  })
}

/**
 * Logic for deriving the preview from the original source [1]
 */
const updatePreviewCanvas = async () => {
  if (props.isCropping || !previewCanvas.value || !store.originalImage) return

  const canvas = previewCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const img = new Image()
  img.src = store.originalImage
  
  // Handling both success and failure for robust UI
  img.onload = () => {
    const crop = store.edits.crop || {
      x: 0, y: 0, 
      width: img.naturalWidth, 
      height: img.naturalHeight 
    }

    canvas.width = crop.width
    canvas.height = crop.height

    // Applying filters from the Pinia model to the context [1]
    ctx.filter = store.filterStyle
    
    ctx.drawImage(
      img,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, crop.width, crop.height
    )
  }

  img.onerror = () => {
    console.error('Failed to update preview canvas: Image load error.')
  }
}

// Watchers for mode switching and real-time filter updates [1]
watch(() => props.isCropping, async (newVal) => {
  if (newVal) {
    if (cropper) cropper.destroy()
    await nextTick() // Ensure DOM is updated before initializing Cropper
    initCropper()
  } else {
    if (cropper) {
      cropper.destroy()
      cropper = null
    }
    updatePreviewCanvas()
  }
})

// Deep watch on edits object to ensure real-time response to sliders [1]
watch(() => store.edits, () => {
  if (!props.isCropping) updatePreviewCanvas()
}, { deep: true })

onMounted(() => {
  if (props.isCropping) initCropper()
  else updatePreviewCanvas()
})

onUnmounted(() => {
  if (cropper) {
    cropper.destroy()
  }
})
</script>

<style scoped>
.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  max-height: 80vh;
  overflow: hidden;
}

.editor-image {
  max-width: 100%;
  display: block;
}

.result-canvas {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}
</style>
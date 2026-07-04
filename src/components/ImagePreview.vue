<template>
  <div class="preview-container">
    <img
      v-show="isCropping"
      ref="imageElement"
      :src="store.previewUrl || ''"
      class="editor-image"
    />
    <canvas v-show="!isCropping" ref="previewCanvas" class="result-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick, onMounted } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { useImageEditorStore } from '@/stores/imageEditor'
import type { CropData } from '@/types/editor'

const props = defineProps<{ isCropping: boolean }>()
const store = useImageEditorStore()

const imageElement = ref<HTMLImageElement | null>(null)
const previewCanvas = ref<HTMLCanvasElement | null>(null)
const localCropDraft = ref<CropData | null>(null) // "Crop Draft" logic
let cropper: Cropper | null = null
let rafId: number | null = null

const renderCanvas = (img: HTMLImageElement) => {
  const ctx = previewCanvas.value?.getContext('2d')
  if (!ctx || !previewCanvas.value) return
  const crop = store.edits.crop || {
    x: 0,
    y: 0,
    width: img.naturalWidth,
    height: img.naturalHeight,
  }
  previewCanvas.value.width = crop.width
  previewCanvas.value.height = crop.height
  ctx.filter = store.filterStyle
  ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
}

const updatePreview = async () => {
  if (props.isCropping || !store.previewUrl) return
  try {
    const img = await store.loadImage()
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => renderCanvas(img))
  } catch (err) {
    console.error(err)
  }
}

// Method to commit the draft to the Store
const applyCrop = () => {
  if (localCropDraft.value) {
    store.edits.crop = { ...localCropDraft.value }
  }
}

// Expose the apply method to the parent (App.vue)
defineExpose({ applyCrop })

watch(
  () => props.isCropping,
  async (active) => {
    if (active) {
      cropper?.destroy()
      await nextTick()
      cropper = new Cropper(imageElement.value!, {
        viewMode: 1,
        data: store.edits.crop || undefined,
        crop: (e) => {
          // Save to draft, NOT to store
          localCropDraft.value = {
            x: Math.round(e.detail.x),
            y: Math.round(e.detail.y),
            width: Math.max(1, Math.round(e.detail.width)),
            height: Math.max(1, Math.round(e.detail.height)),
          }
        },
      })
    } else {
      cropper?.destroy()
      cropper = null
      updatePreview()
    }
  },
)

watch(
  [
    () => store.edits.brightness,
    () => store.edits.contrast,
    () => store.edits.saturation,
    () => store.edits.grayscale,
    () => store.edits.sepia,
    () => store.edits.crop,
    () => store.previewUrl,
  ],
  updatePreview,
)

onMounted(() => {
  if (store.previewUrl) updatePreview()
})
onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  cropper?.destroy()
})
</script>

<style scoped>
.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.editor-image {
  max-width: 100%;
  display: block;
}
.result-canvas {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>

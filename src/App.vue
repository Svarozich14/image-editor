<template>
  <v-app>
    <v-navigation-drawer width="360" permanent elevation="3">
      <v-container>
        <ImageUploader class="mb-4" />

        <div v-if="store.previewUrl" class="editor-controls">
          <div v-if="!isCropping">
            <v-btn block color="primary" @click="isCropping = true" class="mb-4">Edit Crop</v-btn>
          </div>
          <div v-else class="d-flex gap-2 mb-4">
            <v-btn color="success" class="flex-grow-1" @click="handleApplyCrop">Apply</v-btn>
            <v-btn color="grey-lighten-1" class="flex-grow-1" @click="isCropping = false"
              >Cancel</v-btn
            >
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Sliders with aligned labels -->
          <div class="sliders-container">
            <v-slider
              v-model="store.edits.brightness"
              label="Brightness"
              min="0"
              max="200"
              :disabled="isCropping"
              density="compact"
              hide-details
            ></v-slider>
            <v-slider
              v-model="store.edits.contrast"
              label="Contrast"
              min="0"
              max="200"
              :disabled="isCropping"
              density="compact"
              hide-details
            ></v-slider>
            <v-slider
              v-model="store.edits.saturation"
              label="Saturation"
              min="0"
              max="200"
              :disabled="isCropping"
              density="compact"
              hide-details
            ></v-slider>

            <v-divider class="my-4"></v-divider>

            <v-slider
              v-model="store.edits.grayscale"
              label="Grayscale"
              min="0"
              max="100"
              :disabled="isCropping"
              density="compact"
              hide-details
            ></v-slider>
            <v-slider
              v-model="store.edits.sepia"
              label="Sepia"
              min="0"
              max="100"
              :disabled="isCropping"
              density="compact"
              hide-details
            ></v-slider>
          </div>

          <v-btn block color="error" variant="outlined" @click="handleReset" class="mt-6 mb-2"
            >Reset All</v-btn
          >
          <v-btn block color="primary" @click="exportImage" class="mb-2">Download Image</v-btn>
          <v-btn block color="info" variant="tonal" @click="exportOperationsJson"
            >Download JSON</v-btn
          >
        </div>
      </v-container>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="fill-height d-flex justify-center align-center">
        <ImagePreview ref="previewRef" v-if="store.previewUrl" :is-cropping="isCropping" />
        <div v-else class="text-grey text-h6">Please upload an image to start editing</div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useImageEditorStore } from '@/stores/imageEditor'
import { useImageExporter } from '@/composables/useImageExporter'
import ImageUploader from '@/components/ImageUploader.vue'
import ImagePreview from '@/components/ImagePreview.vue'

const store = useImageEditorStore()
const isCropping = ref(false)
const previewRef = ref<InstanceType<typeof ImagePreview> | null>(null)
const { exportImage, exportOperationsJson } = useImageExporter()

const handleApplyCrop = () => {
  previewRef.value?.applyCrop()
  isCropping.value = false
}

const handleReset = () => {
  isCropping.value = false
  store.resetEditor()
}
</script>

<style scoped>
/* Align slider labels to a fixed width for a clean UI */
.sliders-container :deep(.v-label) {
  min-width: 90px;
  flex: none;
  font-size: 0.875rem;
}

.v-slider {
  margin-bottom: 12px;
}

.gap-2 {
  gap: 8px;
}
</style>

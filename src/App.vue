<template>
  <v-app>
    <!-- Navigation Sidebar -->
    <v-navigation-drawer width="350" permanent>
      <v-container>
        <h2 class="text-h6 mb-4">Image Settings</h2>
        
        <!-- Upload Component -->
        <ImageUploader class="mb-6" />

        <div v-if="store.originalImage">
          <!-- Crop Toggle Button -->
          <div class="mb-4">
            <v-btn 
              :color="isCropping ? 'success' : 'secondary'" 
              block 
              variant="elevated"
              @click="isCropping = !isCropping"
            >
              {{ isCropping ? 'Apply Crop Area' : 'Edit Crop' }}
            </v-btn>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Standard Filter Sliders -->
          <v-slider
            v-model="store.edits.brightness"
            label="Brightness"
            min="0" max="200" step="1" thumb-label
            :disabled="isCropping"
          ></v-slider>

          <v-slider
            v-model="store.edits.contrast"
            label="Contrast"
            min="0" max="200" step="1" thumb-label
            :disabled="isCropping"
          ></v-slider>

          <v-slider
            v-model="store.edits.saturation"
            label="Saturation"
            min="0" max="200" step="1" thumb-label
            :disabled="isCropping"
          ></v-slider>

          <!-- Bonus: Additional Filter Sliders [1] -->
          <v-slider
            v-model="store.edits.grayscale"
            label="Grayscale"
            min="0" max="100" step="1" thumb-label
            :disabled="isCropping"
          ></v-slider>

          <v-slider
            v-model="store.edits.sepia"
            label="Sepia"
            min="0" max="100" step="1" thumb-label
            :disabled="isCropping"
          ></v-slider>

          <v-divider class="my-4"></v-divider>

          <!-- Control Buttons -->
          <v-btn color="error" variant="outlined" block @click="resetAll" class="mb-2">
            Reset All
          </v-btn>
          
          <v-btn color="primary" block @click="downloadImage" class="mb-2">
            Download Result
          </v-btn>

          <!-- Bonus: Export Operations as JSON [1] -->
          <v-btn color="info" variant="tonal" block @click="exportOperationsJson">
            Download JSON Recipe
          </v-btn>
        </div>
      </v-container>
    </v-navigation-drawer>

    <!-- Main Viewport -->
    <v-main class="bg-grey-lighten-3">
      <v-container fluid class="fill-height d-flex justify-center align-center">
        <div v-if="store.originalImage" class="editor-viewport">
          <ImagePreview :is-cropping="isCropping" />
        </div>
        <div v-else class="text-grey">
          Please upload an image to start editing
        </div>
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

// Store and state initialization
const store = useImageEditorStore()
// Destructuring both main and bonus export functions [1]
const { exportImage, exportOperationsJson } = useImageExporter()
const isCropping = ref(false)

// Logic to reset all changes and exit crop mode [1]
const resetAll = () => {
  isCropping.value = false
  store.resetEdits()
}

// Logic to trigger the export process via Canvas
const downloadImage = async () => {
  try {
    await exportImage()
  } catch (error) {
    console.error('Export failed:', error)
  }
}
</script>

<style>
.editor-viewport {
  background: white;
  padding: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
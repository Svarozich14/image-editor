This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.editorconfig
.gitattributes
.gitignore
.oxlintrc.json
.prettierrc.json
env.d.ts
eslint.config.ts
index.html
package.json
public/favicon.ico
README.md
src/App.vue
src/components/ImagePreview.vue
src/components/ImageUploader.vue
src/composables/useImageExporter.ts
src/main.ts
src/stores/imageEditor.ts
src/tests/unit/editorUtils.test.ts
src/types/editor.ts
src/utils/editorUtils.ts
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: src/tests/unit/editorUtils.test.ts
````typescript
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
````

## File: src/types/editor.ts
````typescript
export interface CropData {
  x: number
  y: number
  width: number
  height: number
}

export interface EditModel {
  brightness: number
  contrast: number
  saturation: number
  grayscale: number
  sepia: number
  crop: CropData | null
}
````

## File: src/utils/editorUtils.ts
````typescript
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
````

## File: .editorconfig
````
[*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,vue,css,scss,sass,less,styl}]
charset = utf-8
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true
end_of_line = lf
max_line_length = 100
````

## File: .gitattributes
````
* text=auto eol=lf
````

## File: .gitignore
````
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
.DS_Store
dist
dist-ssr
coverage
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

*.tsbuildinfo

.eslintcache

# Cypress
/cypress/videos/
/cypress/screenshots/

# Vitest
__screenshots__/

# Vite
*.timestamp-*-*.mjs
````

## File: .oxlintrc.json
````json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["eslint", "typescript", "unicorn", "oxc", "vue"],
  "env": {
    "browser": true
  },
  "categories": {
    "correctness": "error"
  }
}
````

## File: .prettierrc.json
````json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "singleQuote": true,
  "printWidth": 100
}
````

## File: env.d.ts
````typescript
/// <reference types="vite/client" />
````

## File: eslint.config.ts
````typescript
import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
)
````

## File: index.html
````html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
````

## File: package.json
````json
{
  "name": "image-editor",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "preview": "vite preview",
    "build-only": "vite build",
    "type-check": "vue-tsc --build",
    "lint": "run-s \"lint:*\"",
    "lint:oxlint": "oxlint . --fix",
    "lint:eslint": "eslint . --fix --cache",
    "format": "prettier --write --experimental-cli src/",
    "test": "vitest"
  },
  "dependencies": {
    "@mdi/font": "^7.4.47",
    "cropperjs": "^1.6.2",
    "mdi": "^2.2.43",
    "pinia": "^3.0.4",
    "vue": "^3.5.38",
    "vuetify": "^3.12.9"
  },
  "devDependencies": {
    "@tsconfig/node24": "^24.0.4",
    "@types/node": "^24.13.2",
    "@vitejs/plugin-vue": "^6.0.7",
    "@vue/eslint-config-typescript": "^14.8.0",
    "@vue/tsconfig": "^0.9.1",
    "eslint": "^10.5.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-oxlint": "~1.69.0",
    "eslint-plugin-vue": "~10.9.2",
    "jiti": "^2.7.0",
    "npm-run-all2": "^9.0.2",
    "oxlint": "~1.69.0",
    "prettier": "3.8.4",
    "typescript": "~6.0.0",
    "vite": "^8.0.16",
    "vite-plugin-vue-devtools": "^8.1.2",
    "vitest": "^4.1.9",
    "vue-eslint-parser": "^10.4.1",
    "vue-tsc": "^3.3.5"
  },
  "engines": {
    "node": "^22.18.0 || >=24.12.0"
  }
}
````

## File: README.md
````markdown
# Vue 3 Non-Destructive Image Editor

A professional-grade, browser-based image editor designed for the printing industry context. This application implements a strict non-destructive workflow, where the original image data is preserved as a "Source of Truth," and all edits are derived in real-time through a mathematical operation model.

## 🚀 Stack & Setup

- **Framework:** Vue 3 (Composition API)
- **State Management:** Pinia (Centralized Edit Model)
- **UI Library:** Vuetify 3 (Material Design)
- **Language:** TypeScript (Isolated Domain Types)
- **Testing:** Vitest (Unit testing for pure logic)
- **Core Dependencies:** CropperJS (v1.6.x) & HTML5 Canvas API

### Installation

```bash
npm install
Development
npm run dev
Testing
# Runs Vitest for unit testing pure utility functions
npm run test
🌟 Key Features
Core Requirements
High-Res Upload: Local file selection with centralized memory management.
Interactive Cropping: Powered by CropperJS with a professional "Crop Draft" state.
Live Adjustments: Real-time processing for Brightness, Contrast, and Saturation.
Non-Destructive Reset: Instant reversion to the original state without reloading the source file.
High-Quality Export: Downloads processed results as JPEGs via an off-screen Canvas pipeline.
★ Bonus Tasks Implemented
Additional Filters: Built-in support for Grayscale and Sepia processing.
JSON Operation Manifest: Exports a "Recipe" file (.json) describing the exact operations applied, allowing for identical reproduction of the result on the original source.
🧠 Architectural Decisions & Engineering
1. Unified Image Pipeline
To prevent the common "Preview ≠ Export" bug, this app uses a single source of truth for image loading. Both the UI preview and the export utility share the same loadImage method in the Pinia store, ensuring 100% rendering consistency across the entire application.
2. Race Condition Protection
Handling high-res image uploads in a rapid UI can lead to stale data. We implemented a Generation Counter (loadingGeneration) within the store. If a new image is uploaded before the previous one finishes decoding, the stale request is automatically discarded, preventing UI glitches.
3. Memory Safety (ObjectURL Lifecycle)
To prevent memory leaks, the store manages a centralized ObjectURL lifecycle. It automatically calls URL.revokeObjectURL() whenever an image is replaced or cleared, ensuring the browser's memory remains lean.
4. UI/Business Logic Separation (Crop Draft)
The editor uses a Crop Draft logic. While the user is manipulating the crop box, changes are stored in a local component state. The Pinia store is only updated when the user explicitly clicks "Apply", keeping the global state clean and avoiding unnecessary reactive updates during box movement.
5. Pure Function Testing
Following industry best practices, we extracted the core business logic (filter string generation, manifest creation) into Pure Functions. These are covered by a Vitest suite, ensuring the "math" behind the editor remains reliable regardless of UI changes.
6. Canvas vs. CSS Filters
While CSS filters are cheaper for previews, we chose a Canvas-based preview pipeline. This trade-off ensures that what the user sees on their screen is 100% identical to the final exported file—a critical requirement for printing industry standards.
📁 Project Structure
/src/types: Isolated domain types (editor.ts) for better scalability.
/src/utils: Pure, testable utility functions.
/src/tests: Unit tests for core operations.
/src/stores: Centralized state with the unified loading pipeline.
```
````

## File: src/App.vue
````vue
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
````

## File: src/components/ImagePreview.vue
````vue
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
````

## File: src/components/ImageUploader.vue
````vue
// Simple file upload component using Vuetify
<script setup lang="ts">
import { useImageEditorStore } from '@/stores/imageEditor'

const store = useImageEditorStore()

const onFileChange = (file: File | File[] | null) => {
  const selectedFile = Array.isArray(file) ? file : file
  if (selectedFile instanceof File) {
    store.setImage(selectedFile)
  } else {
    store.clearImage()
  }
}
</script>

<template>
  <v-file-input
    label="Upload Image"
    accept="image/*"
    prepend-icon="mdi-camera"
    variant="filled"
    @update:model-value="onFileChange"
  ></v-file-input>
</template>
````

## File: src/composables/useImageExporter.ts
````typescript
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
````

## File: src/main.ts
````typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)

app.mount('#app')
````

## File: src/stores/imageEditor.ts
````typescript
import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import type { EditModel, CropData } from '@/types/editor'
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
````

## File: tsconfig.app.json
````json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    // Extra safety for array and object lookups, but may have false positives.
    "noUncheckedIndexedAccess": true,

    // Path mapping for cleaner imports.
    "paths": {
      "@/*": ["./src/*"]
    },

    // `vue-tsc --build` produces a .tsbuildinfo file for incremental type-checking.
    // Specified here to keep it out of the root directory.
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo"
  }
}
````

## File: tsconfig.json
````json
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.node.json"
    },
    {
      "path": "./tsconfig.app.json"
    }
  ]
}
````

## File: tsconfig.node.json
````json
// TSConfig for modules that run in Node.js environment via either transpilation or type-stripping.
{
  "extends": "@tsconfig/node24/tsconfig.json",
  "include": [
    "vite.config.*",
    "vitest.config.*",
    "cypress.config.*",
    "playwright.config.*",
    "eslint.config.*"
  ],
  "compilerOptions": {
    // Most tools use transpilation instead of Node.js's native type-stripping.
    // Bundler mode provides a smoother developer experience.
    "module": "preserve",
    "moduleResolution": "bundler",

    // Include Node.js types and avoid accidentally including other `@types/*` packages.
    "types": ["node"],

    // Disable emitting output during `vue-tsc --build`, which is used for type-checking only.
    "noEmit": true,

    // `vue-tsc --build` produces a .tsbuildinfo file for incremental type-checking.
    // Specified here to keep it out of the root directory.
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo"
  }
}
````

## File: vite.config.ts
````typescript
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
````

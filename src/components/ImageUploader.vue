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

<template>
  <v-file-input
    label="Select Image"
    accept="image/*"
    prepend-icon="mdi-camera"
    variant="filled"
    @update:model-value="onFileChange"
    @click:clear="store.originalImage = null"
  ></v-file-input>
</template>

<script setup lang="ts">
import { useImageEditorStore } from '@/stores/imageEditor'

const store = useImageEditorStore()

const onFileChange = (file: File | File[] | null) => {
  const selectedFile = Array.isArray(file) ? file : file

  if (selectedFile) {
    const imageUrl = URL.createObjectURL(selectedFile)
    store.setImage(imageUrl, selectedFile.name)
  }
}
</script>
# Vue 3 Non-Destructive Image Editor

This project is a browser-based image editor developed for the printing industry context. The primary focus is on the **modeling of edits** rather than direct pixel manipulation, ensuring a completely non-destructive workflow.

## 🚀 Stack & Setup

- **Framework:** Vue 3 (Composition API)
- **State Management:** Pinia
- **UI Framework:** Vuetify 3
- **Language:** TypeScript
- **Image Processing:** CropperJS (v1.6.x) & HTML5 Canvas API

### Installation
```bash
npm i
npm run dev
```

## ✨ Features

### Basic Requirements
- **Image Upload:** Load any local image via file input.
- **Cropping:** Interactive cropping tool to select the target area.
- **Real-time Filters:** Live sliders for **Brightness**, **Contrast**, and **Saturation**.
- **Non-Destructive Workflow:** Original source remains untouched; the preview is derived from the edit model.
- **Reset:** Ability to revert all changes and view the original image instantly.
- **Export:** High-quality JPEG download of the final result.

### ★ Bonus Features
- **Additional Filters:** Implemented **Grayscale** and **Sepia** sliders.
- **JSON Manifest Export:** Downloads a "recipe" file alongside the image. This JSON describes all applied operations, allowing for exact reproduction of the results on the original source.

## 🧠 Key Decisions & Trade-offs

### 1. Non-Destructive Operation Model
The core of the application is a **State-Driven Model**. Instead of modifying image pixels directly, every user action (slider movement, crop selection) updates a central "recipe" object in the Pinia store. 
- **Benefit:** This allows for an instant "Reset" functionality and ensures the original file quality is never degraded by intermediate edits.
- **Implementation:** The preview is "derived" by applying CSS filters and Canvas clipping on the fly, keeping the source `Blob` intact.

### 2. Hybrid Rendering Pipeline
I implemented a two-tier rendering strategy:
- **UI Feedback:** Uses CSS `filter` properties for instant, hardware-accelerated feedback on sliders.
- **Final Export:** Uses the **HTML5 Canvas API**. During export, the app draws the original image to an off-screen canvas, applies the `ctx.filter` string (matching the CSS values), and clips it according to the stored crop coordinates. This ensures the output resolution matches the source, not the screen preview.

### 3. Choice of Libraries (CropperJS)
I chose **CropperJS v1.6.x** over the newer v2.x (beta).
- **Reasoning:** Version 1.x is highly stable, has extensive documentation, and integrates seamlessly with Vue 3's `ref` system without the overhead of the experimental Web Components found in v2.x.
- **Robustness:** The integration includes `cropper.destroy()` calls in the `onUnmounted` lifecycle hook to prevent memory leaks in a single-page application context.

### 4. Operation Manifest (The JSON Recipe)
The bonus JSON export follows a flat schema representing the `edits` state:
```json
{
  "sourceFile": "image.jpg",
  "operations": {
    "brightness": 120,
    "contrast": 110,
    "crop": { "x": 10, "y": 20, "width": 500, "height": 500 }
  }
}
```
This design is intentional: it is human-readable, serializable, and can be used by any backend or automated process to "replay" the exact same transformations on the high-resolution original.

### 5. Technical Robustness
- **Memory Safety:** The application uses `URL.revokeObjectURL()` after every download to free up browser memory, which is critical when handling large print-ready images.
- **Error Handling:** Image loading within the export pipeline is wrapped in native Promises with explicit `onerror` rejection, preventing the UI from hanging if an image fails to load.
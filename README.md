# Vue 3 Non-Destructive Image Editor

A professional-grade, browser-based image editor designed for the printing industry context. This application implements a strict non-destructive workflow, where the original image data is preserved as a "Source of Truth," and all edits are derived in real-time through a mathematical operation model.

## 🚀 Stack & Setup

- **Framework:** Vue 3 (Composition API)
- **State Management:** Pinia (Centralized Edit Model)
- **UI Library:** Vuetify 3 (Material Design)
- **Language:** TypeScript (Isolated Domain Types)
- **Testing:** Vitest (Unit testing for pure logic)
- **Core Dependencies:** CropperJS (v1.6.x) & HTML5 Canvas API

## 📦 Installation

```bash
npm install
```

## ▶️ Development

```bash
npm run dev
```

## 🧪 Testing

```bash
# Runs Vitest for unit testing pure utility functions
npm run test
```

## 🌟 Key Features

### Core Requirements

- **High-Res Upload:** Local file selection with centralized memory management.
- **Interactive Cropping:** Powered by CropperJS with a professional "Crop Draft" state.
- **Live Adjustments:** Real-time processing for Brightness, Contrast, and Saturation.
- **Non-Destructive Reset:** Instant reversion to the original state without reloading the source file.
- **High-Quality Export:** Downloads processed results as JPEGs via an off-screen Canvas pipeline.

### ★ Bonus Tasks Implemented

- **Additional Filters:** Built-in support for Grayscale and Sepia processing.
- **JSON Operation Manifest:** Exports a "Recipe" file (`.json`) describing the exact operations applied, allowing for identical reproduction of the result on the original source.

## 🧠 Architectural Decisions & Engineering

### 1. Unified Image Pipeline

To prevent the common **"Preview ≠ Export"** bug, this app uses a single source of truth for image loading. Both the UI preview and the export utility share the same `loadImage` method in the Pinia store, ensuring 100% rendering consistency across the entire application.

### 2. UI / Business Logic Separation (Crop Draft)

To optimize performance and user experience, the application implements a **Crop Draft** workflow. While the user manipulates the crop box, changes are accumulated locally within the component. The global Pinia store remains untouched until the user explicitly clicks **Apply**. This prevents unnecessary reactive updates and manifest recalculations during active resizing or dragging.

### 3. Race Condition Protection

Handling high-resolution image uploads in a reactive UI can lead to stale asynchronous requests. The application uses a **Generation Counter (`loadingGeneration`)** inside the store. If a new image is uploaded before the previous one finishes decoding, the stale request is discarded automatically, preventing inconsistent UI state.

### 4. Memory Safety (ObjectURL Lifecycle)

To prevent memory leaks, the store manages the complete ObjectURL lifecycle. It automatically calls `URL.revokeObjectURL()` whenever an image is replaced or cleared, ensuring proper browser memory management.

### 5. Pure Function Testing

Following industry best practices, the core business logic (filter string generation and manifest creation) is implemented as **pure functions**. These are covered by **Vitest** unit tests, ensuring that the editor's processing logic remains reliable regardless of UI changes.

### 6. Canvas vs. CSS Filters

While CSS filters are generally cheaper for previews, this project intentionally uses a **Canvas-based preview pipeline**. This trade-off guarantees that the preview shown to the user is pixel-identical to the exported image, which is a critical requirement in printing workflows.

## 📁 Project Structure

```text
src/
├── types/     # Isolated domain types (editor.ts)
├── utils/     # Pure, testable utility functions
├── tests/     # Unit tests
├── stores/    # Centralized state and unified loading pipeline
├── composables/
├── components/
└── assets/
```

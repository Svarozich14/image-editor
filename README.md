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
2. UI/Business Logic Separation (Crop Draft)
To optimize performance and user experience, we implemented a Crop Draft logic. While the user is manipulating the crop box, changes are accumulated locally within the component. The global Pinia store remains untouched until the user explicitly clicks "Apply". This prevents unnecessary heavy reactive updates and manifest re-calculations during active resizing or dragging.
3. Race Condition Protection
Handling high-res image uploads in a rapid UI can lead to stale data. We implemented a Generation Counter (loadingGeneration) within the store. If a new image is uploaded before the previous one finishes decoding, the stale request is automatically discarded, preventing UI glitches.
4. Memory Safety (ObjectURL Lifecycle)
To prevent memory leaks, the store manages a centralized ObjectURL lifecycle. It automatically calls URL.revokeObjectURL() whenever an image is replaced or cleared, ensuring the browser's memory remains lean.
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

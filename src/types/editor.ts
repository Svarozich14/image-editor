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

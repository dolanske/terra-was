import type { Photo } from './photo.types'

export interface Uploader {
  index: number
  rawFile: File
  file: Photo | null
  loading: boolean
}

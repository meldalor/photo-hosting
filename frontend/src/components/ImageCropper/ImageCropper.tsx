import { useRef } from 'react'

import { Button } from '@photo-gallery/ui-library'
import 'cropperjs/dist/cropper.css'
import Cropper, { ReactCropperElement } from 'react-cropper'

import styles from './ImageCropper.module.css'

interface ImageCropperProps {
  image: string
  mimeType?: string
  onCropComplete: (croppedImageBlob: Blob) => void
  onCancel: () => void
}

export const ImageCropper = ({ image, mimeType = 'image/jpeg', onCropComplete, onCancel }: ImageCropperProps) => {
  const cropperRef = useRef<ReactCropperElement>(null)

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper

    if (!cropper) {
      return
    }

    const canvas = cropper.getCroppedCanvas()

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob)
      }
    }, mimeType, 0.95)
  }

  return (
    <div className={styles.cropperContainer}>
      <div className={styles.cropperWrapper}>
        <Cropper
          src={image}
          style={{ height: 400, width: '100%' }}
          initialAspectRatio={16 / 9}
          guides={true}
          ref={cropperRef}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
        />
      </div>
      <div className={styles.controls}>
        <Button onClick={handleCrop}>Обрезать</Button>
        <Button onClick={onCancel} variant="text">Отмена</Button>
      </div>
    </div>
  )
}

import { useState } from 'react'

export default function ImageUpload({ currentUrl, onChange }) {
  const [preview, setPreview] = useState(currentUrl || null)

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    onChange(file)
  }

  return (
    <div className="image-upload">
      {preview && (
        <img src={preview} alt="preview" className="image-upload-preview" />
      )}
      <label className="image-upload-btn">
        {preview ? 'Change image' : 'Upload image'}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  )
}

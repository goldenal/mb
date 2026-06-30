import { useState, useEffect } from 'react'
import { getBeds, createBed, updateBed, deleteBed, reorderBeds } from '../../api/beds.js'
import ImageUpload from '../components/ImageUpload.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { ShimmerList } from '../components/Shimmer.jsx'

const EMPTY = { name: '', sub: '', thickness: '', feel: '', price: '', desc: '' }

export default function BedsManager() {
  const [beds, setBeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imgFile, setImgFile] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    try {
      const { beds } = await getBeds()
      setBeds(beds)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function startAdd() {
    setEditing(null)
    setForm(EMPTY)
    setImgFile(null)
    setError(null)
  }

  function startEdit(bed) {
    setEditing(bed)
    setForm({ name: bed.name, sub: bed.sub, thickness: bed.thickness, feel: bed.feel, price: bed.price, desc: bed.desc })
    setImgFile(null)
    setError(null)
  }

  function setField(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (imgFile) fd.append('img', imgFile)
      if (editing) {
        await updateBed(editing.id, fd)
      } else {
        await createBed(fd)
      }
      await load()
      startAdd()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await deleteBed(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError(err.message)
      setDeleteTarget(null)
    }
  }

  async function move(idx, dir) {
    const next = [...beds]
    const swap = idx + dir
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setBeds(next)
    try {
      await reorderBeds(next.map((b) => b.id))
    } catch (err) {
      setError(err.message)
      await load()
    }
  }

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Beds</h2>
        <button type="button" className="btn-primary" onClick={startAdd}> Add bed</button>
      </div>

      {error && <p className="office-error">{error}</p>}

      {loading ? (
        <ShimmerList count={3} hasThumb />
      ) : (
        <div className="item-list">
          {beds.map((bed, idx) => (
            <div key={bed.id} className="item-row">
              {bed.img && <img src={bed.img} alt={bed.name} className="item-thumb" />}
              <div className="item-info">
                <div className="item-name">{bed.name}</div>
                <div className="item-meta">{bed.feel} · {bed.price}</div>
              </div>
              <div className="item-actions">
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0} aria-label="Move up">↑</button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === beds.length - 1} aria-label="Move down">↓</button>
                <button type="button" className="btn-edit" onClick={() => startEdit(bed)}>Edit</button>
                <button type="button" className="btn-danger" onClick={() => setDeleteTarget(bed)}>Delete</button>
              </div>
            </div>
          ))}
          {beds.length === 0 && <p className="muted">No beds yet. Add one below.</p>}
        </div>
      )}

      <div className="manager-form-wrap">
        <h3>{editing ? `Editing: ${editing.name}` : 'Add new bed'}</h3>
        <form onSubmit={handleSubmit} className="manager-form">
          {[
            { key: 'name', label: 'Name', placeholder: 'e.g. Aurora Luxury Bed' },
            { key: 'sub', label: 'Subtitle', placeholder: 'e.g. Upholstered frame, king-size' },
            { key: 'thickness', label: 'Thickness', placeholder: 'e.g. 14"' },
            { key: 'feel', label: 'Feel', placeholder: 'e.g. Medium-firm' },
            { key: 'price', label: 'Price', placeholder: 'e.g. $1,290' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="field">
              <label htmlFor={`bed-${key}`}>{label}</label>
              <input
                id={`bed-${key}`}
                type="text"
                value={form[key]}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={placeholder}
                required
              />
            </div>
          ))}
          <div className="field field-full">
            <label htmlFor="bed-desc">Description</label>
            <textarea
              id="bed-desc"
              value={form.desc}
              onChange={(e) => setField('desc', e.target.value)}
              rows={3}
              placeholder="Short description shown on the carousel"
              required
            />
          </div>
          <div className="field field-full">
            <label>Image</label>
            <ImageUpload currentUrl={editing?.img} onChange={setImgFile} />
          </div>
          {error && <p className="office-error">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create bed'}
            </button>
            {editing && (
              <button type="button" className="btn-secondary" onClick={startAdd}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${deleteTarget.name}"? This also removes the image from Cloudinary.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

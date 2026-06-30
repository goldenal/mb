import { useState, useEffect } from 'react'
import { getDuvets, createDuvet, updateDuvet, deleteDuvet, reorderDuvets } from '../../api/duvets.js'
import ImageUpload from '../components/ImageUpload.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { ShimmerList } from '../components/Shimmer.jsx'

const CATEGORIES = ['duvet', 'bedcover', 'pillowcase', 'other']
const EMPTY = { name: '', desc: '', price: '', category: 'duvet', isFeatured: false }

export default function DuvetsManager() {
  const [duvets, setDuvets] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imgFile, setImgFile] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    try {
      const { duvets } = await getDuvets()
      setDuvets(duvets)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function startAdd() { setEditing(null); setForm(EMPTY); setImgFile(null); setError(null) }

  function startEdit(d) {
    setEditing(d)
    setForm({ name: d.name, desc: d.desc, price: d.price, category: d.category || 'duvet', isFeatured: d.is_featured || false })
    setImgFile(null)
    setError(null)
  }

  function setField(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('desc', form.desc)
      fd.append('price', form.price)
      fd.append('category', form.category)
      fd.append('isFeatured', String(form.isFeatured))
      if (imgFile) fd.append('img', imgFile)
      if (editing) await updateDuvet(editing.id, fd)
      else await createDuvet(fd)
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
      await deleteDuvet(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError(err.message)
      setDeleteTarget(null)
    }
  }

  async function move(idx, dir) {
    const next = [...duvets]
    const swap = idx + dir
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setDuvets(next)
    try {
      await reorderDuvets(next.map((d) => d.id))
    } catch (err) {
      setError(err.message)
      await load()
    }
  }

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Duvets &amp; Bedcovers</h2>
        <button type="button" className="btn-primary" onClick={startAdd}>Add item</button>
      </div>

      {error && <p className="office-error">{error}</p>}

      {loading ? (
        <ShimmerList count={4} hasThumb />
      ) : (
        <div className="item-list">
          {duvets.map((d, idx) => (
            <div key={d.id} className="item-row">
              {d.img && <img src={d.img} alt={d.name} className="item-thumb" />}
              <div className="item-info">
                <div className="item-name">{d.name}</div>
                <div className="item-meta">{d.category} · {d.price}{d.is_featured ? ' · ★ featured' : ''}</div>
              </div>
              <div className="item-actions">
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === duvets.length - 1}>↓</button>
                <button type="button" className="btn-edit" onClick={() => startEdit(d)}>Edit</button>
                <button type="button" className="btn-danger" onClick={() => setDeleteTarget(d)}>Delete</button>
              </div>
            </div>
          ))}
          {duvets.length === 0 && <p className="muted">No duvets yet.</p>}
        </div>
      )}

      <div className="manager-form-wrap">
        <h3>{editing ? `Editing: ${editing.name}` : 'Add new item'}</h3>
        <form onSubmit={handleSubmit} className="manager-form">
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="e.g. Cloudweave Duvet Set" required />
          </div>
          <div className="field">
            <label>Price</label>
            <input value={form.price} onChange={(e) => setField('price', e.target.value)} placeholder="e.g. $130" required />
          </div>
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setField('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field field-full">
            <label>Description</label>
            <textarea value={form.desc} onChange={(e) => setField('desc', e.target.value)} rows={3} placeholder="Short description" required />
          </div>
          <div className="field">
            <label>
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setField('isFeatured', e.target.checked)} style={{ marginRight: 6 }} />
              Featured (shown as the large card on landing page)
            </label>
          </div>
          <div className="field field-full">
            <label>Image</label>
            <ImageUpload currentUrl={editing?.img} onChange={setImgFile} />
          </div>
          {error && <p className="office-error">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create'}</button>
            {editing && <button type="button" className="btn-secondary" onClick={startAdd}>Cancel</button>}
          </div>
        </form>
      </div>

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

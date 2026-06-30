import { useState, useEffect } from 'react'
import { getMattresses, createMattress, updateMattress, deleteMattress, reorderMattresses } from '../../api/mattresses.js'
import ImageUpload from '../components/ImageUpload.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { ShimmerList } from '../components/Shimmer.jsx'

const EMPTY = { name: '', tag: '', dotColor: '#f97316', desc: '', price: '' }

export default function MattressesManager() {
  const [mattresses, setMattresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imgFile, setImgFile] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    try {
      const { mattresses } = await getMattresses()
      setMattresses(mattresses)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function startAdd() { setEditing(null); setForm(EMPTY); setImgFile(null); setError(null) }

  function startEdit(m) {
    setEditing(m)
    setForm({ name: m.name, tag: m.tag, dotColor: m.dotColor || '#f97316', desc: m.desc, price: m.price })
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
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (imgFile) fd.append('img', imgFile)
      if (editing) await updateMattress(editing.id, fd)
      else await createMattress(fd)
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
      await deleteMattress(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError(err.message)
      setDeleteTarget(null)
    }
  }

  async function move(idx, dir) {
    const next = [...mattresses]
    const swap = idx + dir
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setMattresses(next)
    try {
      await reorderMattresses(next.map((m) => m.id))
    } catch (err) {
      setError(err.message)
      await load()
    }
  }

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Mattresses</h2>
        <button type="button" className="btn-primary" onClick={startAdd}> Add mattress</button>
      </div>

      {error && <p className="office-error">{error}</p>}

      {loading ? (
        <ShimmerList count={3} hasThumb />
      ) : (
        <div className="item-list">
          {mattresses.map((m, idx) => (
            <div key={m.id} className="item-row">
              {m.img && <img src={m.img} alt={m.name} className="item-thumb" />}
              <div className="item-info">
                <span className="dot" style={{ background: m.dotColor, display: 'inline-block', width: 10, height: 10, borderRadius: '50%', marginRight: 6 }} />
                <div className="item-name">{m.name}</div>
                <div className="item-meta">{m.tag} · {m.price}</div>
              </div>
              <div className="item-actions">
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === mattresses.length - 1}>↓</button>
                <button type="button" className="btn-edit" onClick={() => startEdit(m)}>Edit</button>
                <button type="button" className="btn-danger" onClick={() => setDeleteTarget(m)}>Delete</button>
              </div>
            </div>
          ))}
          {mattresses.length === 0 && <p className="muted">No mattresses yet.</p>}
        </div>
      )}

      <div className="manager-form-wrap">
        <h3>{editing ? `Editing: ${editing.name}` : 'Add new mattress'}</h3>
        <form onSubmit={handleSubmit} className="manager-form">
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="e.g. Cloud Memory Foam" required />
          </div>
          <div className="field">
            <label>Tag (firmness + thickness)</label>
            <input value={form.tag} onChange={(e) => setField('tag', e.target.value)} placeholder='e.g. Soft · 11"' required />
          </div>
          <div className="field">
            <label>Dot colour</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="color" value={form.dotColor} onChange={(e) => setField('dotColor', e.target.value)} style={{ width: 40, height: 36, padding: 2 }} />
              <input value={form.dotColor} onChange={(e) => setField('dotColor', e.target.value)} placeholder="#f97316" style={{ flex: 1 }} />
            </div>
          </div>
          <div className="field">
            <label>Price</label>
            <input value={form.price} onChange={(e) => setField('price', e.target.value)} placeholder="e.g. $740" required />
          </div>
          <div className="field field-full">
            <label>Description</label>
            <textarea value={form.desc} onChange={(e) => setField('desc', e.target.value)} rows={3} placeholder="Short description of comfort feel" required />
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

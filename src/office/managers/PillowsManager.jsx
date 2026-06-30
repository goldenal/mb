import { useState, useEffect } from 'react'
import {
  getPillows,
  createPillow,
  updatePillow,
  deletePillow,
  reorderPillows,
  setFeaturedPillows,
} from '../../api/pillows.js'
import ImageUpload from '../components/ImageUpload.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

const EMPTY = { slug: '', name: '', desc: '', price: '', sizes: [], featured: false }

export default function PillowsManager() {
  const [pillows, setPillows] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imgFile, setImgFile] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('list')

  async function load() {
    try {
      const { pillows } = await getPillows()
      setPillows(pillows)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => { load() }, [])

  function startAdd() { setEditing(null); setForm(EMPTY); setImgFile(null); setError(null); setTab('form') }

  function startEdit(p) {
    setEditing(p)
    setForm({
      slug: p.slug,
      name: p.name,
      desc: p.desc || '',
      price: p.price || '',
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
      featured: p.featured || false,
    })
    setImgFile(null)
    setError(null)
    setTab('form')
  }

  function setField(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  function addSize() { setField('sizes', [...form.sizes, { label: '', price: '' }]) }
  function removeSize(i) { setField('sizes', form.sizes.filter((_, idx) => idx !== i)) }
  function updateSize(i, key, val) {
    setField('sizes', form.sizes.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('slug', form.slug)
      fd.append('name', form.name)
      if (form.desc) fd.append('desc', form.desc)
      if (form.price) fd.append('price', form.price)
      fd.append('sizes', JSON.stringify(form.sizes))
      fd.append('featured', String(form.featured))
      if (imgFile) fd.append('img', imgFile)
      if (editing) await updatePillow(editing.id, fd)
      else await createPillow(fd)
      await load()
      setEditing(null)
      setForm(EMPTY)
      setTab('list')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await deletePillow(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError(err.message)
      setDeleteTarget(null)
    }
  }

  async function move(idx, dir) {
    const next = [...pillows]
    const swap = idx + dir
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setPillows(next)
    try {
      await reorderPillows(next.map((p) => p.id))
    } catch (err) {
      setError(err.message)
      await load()
    }
  }

  const featured = pillows.filter((p) => p.featured).sort((a, b) => (a.featured_order ?? 0) - (b.featured_order ?? 0))

  async function moveFeatured(idx, dir) {
    const next = [...featured]
    const swap = idx + dir
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    try {
      await setFeaturedPillows(next.map((p) => p.slug))
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function toggleFeatured(pillow) {
    const fd = new FormData()
    fd.append('slug', pillow.slug)
    fd.append('name', pillow.name)
    fd.append('featured', String(!pillow.featured))
    if (pillow.desc) fd.append('desc', pillow.desc)
    if (pillow.price) fd.append('price', pillow.price)
    fd.append('sizes', JSON.stringify(pillow.sizes || []))
    try {
      await updatePillow(pillow.id, fd)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Pillows</h2>
        <button type="button" className="btn-primary" onClick={startAdd}>+ Add pillow</button>
      </div>

      {error && <p className="office-error">{error}</p>}

      <div className="manager-tabs">
        <button type="button" className={tab === 'list' ? 'tab active' : 'tab'} onClick={() => setTab('list')}>All pillows</button>
        <button type="button" className={tab === 'featured' ? 'tab active' : 'tab'} onClick={() => setTab('featured')}>Featured ({featured.length})</button>
        {(editing || tab === 'form') && (
          <button type="button" className={tab === 'form' ? 'tab active' : 'tab'} onClick={() => setTab('form')}>
            {editing ? 'Edit' : 'Add'}
          </button>
        )}
      </div>

      {tab === 'list' && (
        <div className="item-list">
          {pillows.map((p, idx) => (
            <div key={p.id} className="item-row">
              {p.img && <img src={p.img} alt={p.name} className="item-thumb" />}
              <div className="item-info">
                <div className="item-name">{p.name}</div>
                <div className="item-meta">{p.slug} {p.featured ? '· ⭐ featured' : ''}</div>
              </div>
              <div className="item-actions">
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === pillows.length - 1}>↓</button>
                <button type="button" onClick={() => toggleFeatured(p)}>{p.featured ? 'Unfeature' : 'Feature'}</button>
                <button type="button" className="btn-edit" onClick={() => startEdit(p)}>Edit</button>
                <button type="button" className="btn-danger" onClick={() => setDeleteTarget(p)}>Delete</button>
              </div>
            </div>
          ))}
          {pillows.length === 0 && <p className="muted">No pillows yet.</p>}
        </div>
      )}

      {tab === 'featured' && (
        <div>
          <p className="muted" style={{ marginBottom: 12 }}>
            Featured pillows appear on the landing page. Use ↑↓ to reorder. Toggle "Feature" in the All tab.
          </p>
          <div className="item-list">
            {featured.map((p, idx) => (
              <div key={p.id} className="item-row">
                {p.img && <img src={p.img} alt={p.name} className="item-thumb" />}
                <div className="item-info">
                  <div className="item-name">{p.name}</div>
                  <div className="item-meta">{p.slug}</div>
                </div>
                <div className="item-actions">
                  <button type="button" onClick={() => moveFeatured(idx, -1)} disabled={idx === 0}>↑</button>
                  <button type="button" onClick={() => moveFeatured(idx, 1)} disabled={idx === featured.length - 1}>↓</button>
                  <button type="button" onClick={() => toggleFeatured(p)}>Unfeature</button>
                </div>
              </div>
            ))}
            {featured.length === 0 && <p className="muted">No featured pillows. Toggle "Feature" in the All tab.</p>}
          </div>
        </div>
      )}

      {tab === 'form' && (
        <div className="manager-form-wrap">
          <h3>{editing ? `Editing: ${editing.name}` : 'Add new pillow'}</h3>
          <form onSubmit={handleSubmit} className="manager-form">
            <div className="field">
              <label>Slug <span className="muted">(URL-safe, e.g. vita-throw)</span></label>
              <input value={form.slug} onChange={(e) => setField('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="vita-throw" required />
            </div>
            <div className="field">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Vita Throw Pillow" required />
            </div>
            <div className="field field-full">
              <label>Description <span className="muted">(use * at start of a bullet, e.g. *Bullet one. *Bullet two.)</span></label>
              <textarea value={form.desc} onChange={(e) => setField('desc', e.target.value)} rows={4} placeholder="*Feature one. *Feature two." />
            </div>

            <div className="field field-full">
              <label>Sizes <span className="muted">(fill these OR the single price below)</span></label>
              {form.sizes.map((s, i) => (
                <div key={i} className="size-row">
                  <input value={s.label} onChange={(e) => updateSize(i, 'label', e.target.value)} placeholder="e.g. 15×15" />
                  <input value={s.price} onChange={(e) => updateSize(i, 'price', e.target.value)} placeholder="e.g. ₦4,000" />
                  <button type="button" className="btn-danger" onClick={() => removeSize(i)}>×</button>
                </div>
              ))}
              <button type="button" className="btn-secondary" style={{ marginTop: 6 }} onClick={addSize}>+ Add size</button>
            </div>

            <div className="field">
              <label>Single price <span className="muted">(leave blank if using sizes above)</span></label>
              <input value={form.price} onChange={(e) => setField('price', e.target.value)} placeholder="e.g. ₦6,000" />
            </div>

            <div className="field">
              <label>
                <input type="checkbox" checked={form.featured} onChange={(e) => setField('featured', e.target.checked)} style={{ marginRight: 6 }} />
                Featured on landing page
              </label>
            </div>

            <div className="field field-full">
              <label>Image</label>
              <ImageUpload currentUrl={editing?.img} onChange={setImgFile} />
            </div>

            {error && <p className="office-error">{error}</p>}
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create'}</button>
              <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setTab('list') }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

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

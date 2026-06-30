import { useState, useEffect } from 'react'
import { getStores, createStore, updateStore, deleteStore, reorderStores } from '../../api/stores.js'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

const EMPTY = { name: '', address: '', hours: '' }

export default function StoresManager() {
  const [stores, setStores] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    try {
      const { stores } = await getStores()
      setStores(stores)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => { load() }, [])

  function startAdd() { setEditing(null); setForm(EMPTY); setError(null) }

  function startEdit(s) {
    setEditing(s)
    setForm({ name: s.name, address: s.address, hours: s.hours })
    setError(null)
  }

  function setField(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editing) await updateStore(editing.id, form)
      else await createStore(form)
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
      await deleteStore(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError(err.message)
      setDeleteTarget(null)
    }
  }

  async function move(idx, dir) {
    const next = [...stores]
    const swap = idx + dir
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setStores(next)
    try {
      await reorderStores(next.map((s) => s.id))
    } catch (err) {
      setError(err.message)
      await load()
    }
  }

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Store Locations</h2>
        <button type="button" className="btn-primary" onClick={startAdd}>+ Add store</button>
      </div>

      {error && <p className="office-error">{error}</p>}

      <div className="item-list">
        {stores.map((s, idx) => (
          <div key={s.id} className="item-row">
            <div className="item-info">
              <div className="item-name">{s.name}</div>
              <div className="item-meta">{s.hours}</div>
            </div>
            <div className="item-actions">
              <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
              <button type="button" onClick={() => move(idx, 1)} disabled={idx === stores.length - 1}>↓</button>
              <button type="button" className="btn-edit" onClick={() => startEdit(s)}>Edit</button>
              <button type="button" className="btn-danger" onClick={() => setDeleteTarget(s)}>Delete</button>
            </div>
          </div>
        ))}
        {stores.length === 0 && <p className="muted">No stores yet.</p>}
      </div>

      <div className="manager-form-wrap">
        <h3>{editing ? `Editing: ${editing.name}` : 'Add new store'}</h3>
        <form onSubmit={handleSubmit} className="manager-form">
          <div className="field">
            <label>Store name</label>
            <input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="e.g. Mature Flagship" required />
          </div>
          <div className="field field-full">
            <label>Address <span className="muted">(use line breaks for multi-line)</span></label>
            <textarea value={form.address} onChange={(e) => setField('address', e.target.value)} rows={3} placeholder={'123 Comfort Avenue\nDowntown — City, 00000'} required />
          </div>
          <div className="field">
            <label>Opening hours</label>
            <input value={form.hours} onChange={(e) => setField('hours', e.target.value)} placeholder="e.g. Mon–Sat · 9am–7pm" required />
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

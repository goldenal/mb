import { useState, useEffect } from 'react'
import { getSettings, updateSettings } from '../../api/settings.js'
import { useSettings } from '../../context/SettingsContext.jsx'

const STAT_DEFAULTS = [
  { num: 'Affordable', sub: 'doorstep delivery' },
  { num: '24–48h', sub: 'city dispatch' },
  { num: 'Free', sub: 'in-room setup' },
]

const TILE_DEFAULTS = [
  { heading: 'Luxury\nComfort', body: 'Plush, hotel-grade beds that feel warm and personal.' },
  { heading: 'Orthopedic\nSupport', body: 'Firmer cores engineered for true spinal alignment.' },
  { heading: 'Tailored\nBedding', body: 'Unique sets and sizes that reflect your space and lifestyle.' },
  { heading: 'Elegant\nBedrooms', body: "Calm, considered rooms you'll love coming home to." },
]

export default function SettingsManager() {
  const { refresh } = useSettings()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getSettings()
      .then(({ settings }) => {
        setForm({
          siteName: settings.siteName || '',
          siteTagline: settings.siteTagline || '',
          heroLine0: (settings.heroLines || [])[0] || '',
          heroLine1: (settings.heroLines || [])[1] || '',
          heroLine2: (settings.heroLines || [])[2] || '',
          aboutEyebrow: settings.aboutEyebrow || '',
          aboutHeading: settings.aboutHeading || '',
          aboutBody: settings.aboutBody || '',
          aboutTiles: settings.aboutTiles || TILE_DEFAULTS,
          bedsHeading: settings.bedsHeading || '',
          mattressesEyebrow: settings.mattressesEyebrow || '',
          mattressesHeading: settings.mattressesHeading || '',
          mattressesSub: settings.mattressesSub || '',
          pillowsEyebrow: settings.pillowsEyebrow || '',
          pillowsHeading: settings.pillowsHeading || '',
          pillowsSub: settings.pillowsSub || '',
          duvetsEyebrow: settings.duvetsEyebrow || '',
          duvetsHeading: settings.duvetsHeading || '',
          duvetsSub: settings.duvetsSub || '',
          deliveryEyebrow: settings.deliveryEyebrow || '',
          deliveryHeading: settings.deliveryHeading || '',
          deliveryBody: settings.deliveryBody || '',
          deliveryStats: settings.deliveryStats || STAT_DEFAULTS,
          deliveryNote: settings.deliveryNote || '',
          contactHeading: settings.contactHeading || '',
          contactSub: settings.contactSub || '',
          whatsappNumber: settings.whatsappNumber || '',
          whatsappDisplay: settings.whatsappDisplay || '',
          whatsappSub: settings.whatsappSub || '',
          phone: settings.phone || '',
          phoneSub: settings.phoneSub || '',
          email: settings.email || '',
          emailSub: settings.emailSub || '',
          storesHeading: settings.storesHeading || '',
          footerCtaHeading: settings.footerCtaHeading || '',
          footerButtonText: settings.footerButtonText || '',
          footerCopyright: settings.footerCopyright || '',
        })
      })
      .catch((err) => setError(err.message))
  }, [])

  function setField(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  function setTile(i, key, val) {
    setForm((f) => ({
      ...f,
      aboutTiles: f.aboutTiles.map((t, idx) => (idx === i ? { ...t, [key]: val } : t)),
    }))
  }

  function setStat(i, key, val) {
    setForm((f) => ({
      ...f,
      deliveryStats: f.deliveryStats.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)),
    }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const payload = {
        ...form,
        heroLines: [form.heroLine0, form.heroLine1, form.heroLine2],
        aboutTiles: form.aboutTiles,
        deliveryStats: form.deliveryStats,
      }
      delete payload.heroLine0
      delete payload.heroLine1
      delete payload.heroLine2
      await updateSettings(payload)
      refresh()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!form) return <div className="manager"><p className="muted">Loading settings…</p></div>

  const Field = ({ label, fieldKey, textarea, rows = 3, hint }) => (
    <div className={`field${textarea ? ' field-full' : ''}`}>
      <label>
        {label}
        {hint && <span className="muted"> — {hint}</span>}
      </label>
      {textarea ? (
        <textarea value={form[fieldKey]} onChange={(e) => setField(fieldKey, e.target.value)} rows={rows} />
      ) : (
        <input value={form[fieldKey]} onChange={(e) => setField(fieldKey, e.target.value)} />
      )}
    </div>
  )

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Site Settings</h2>
      </div>

      {error && <p className="office-error">{error}</p>}
      {saved && <p className="office-success">Settings saved!</p>}

      <form onSubmit={handleSave}>

        <section className="settings-section">
          <h3>Site identity</h3>
          <div className="manager-form">
            <Field label="Site name" fieldKey="siteName" />
            <Field label="Site tagline" fieldKey="siteTagline" />
          </div>
        </section>

        <section className="settings-section">
          <h3>Hero section</h3>
          <p className="muted">Three lines of the hero heading.</p>
          <div className="manager-form">
            <Field label="Line 1" fieldKey="heroLine0" />
            <Field label="Line 2" fieldKey="heroLine1" />
            <Field label="Line 3" fieldKey="heroLine2" />
          </div>
        </section>

        <section className="settings-section">
          <h3>About section</h3>
          <div className="manager-form">
            <Field label="Eyebrow" fieldKey="aboutEyebrow" />
            <Field label="Heading" fieldKey="aboutHeading" hint="use \n for line break" />
            <Field label="Body" fieldKey="aboutBody" textarea rows={4} />
          </div>
          <div className="settings-tiles">
            {form.aboutTiles.map((tile, i) => (
              <div key={i} className="settings-tile">
                <div className="settings-tile-label">Tile {i + 1}</div>
                <div className="field">
                  <label>Heading</label>
                  <input value={tile.heading} onChange={(e) => setTile(i, 'heading', e.target.value)} />
                </div>
                <div className="field">
                  <label>Body</label>
                  <textarea value={tile.body} onChange={(e) => setTile(i, 'body', e.target.value)} rows={2} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <h3>Section headings</h3>
          <div className="manager-form">
            <Field label="Beds heading" fieldKey="bedsHeading" />
            <Field label="Mattresses eyebrow" fieldKey="mattressesEyebrow" />
            <Field label="Mattresses heading" fieldKey="mattressesHeading" />
            <Field label="Mattresses subtext" fieldKey="mattressesSub" />
            <Field label="Pillows eyebrow" fieldKey="pillowsEyebrow" />
            <Field label="Pillows heading" fieldKey="pillowsHeading" />
            <Field label="Pillows subtext" fieldKey="pillowsSub" />
            <Field label="Duvets eyebrow" fieldKey="duvetsEyebrow" />
            <Field label="Duvets heading" fieldKey="duvetsHeading" />
            <Field label="Duvets subtext" fieldKey="duvetsSub" />
          </div>
        </section>

        <section className="settings-section">
          <h3>Delivery section</h3>
          <div className="manager-form">
            <Field label="Eyebrow" fieldKey="deliveryEyebrow" />
            <Field label="Heading" fieldKey="deliveryHeading" />
            <Field label="Body" fieldKey="deliveryBody" textarea rows={4} />
            <Field label="Delivery note" fieldKey="deliveryNote" />
          </div>
          <div className="settings-tiles">
            {form.deliveryStats.map((stat, i) => (
              <div key={i} className="settings-tile">
                <div className="settings-tile-label">Stat {i + 1}</div>
                <div className="field">
                  <label>Number / value</label>
                  <input value={stat.num} onChange={(e) => setStat(i, 'num', e.target.value)} placeholder="e.g. 24–48h" />
                </div>
                <div className="field">
                  <label>Sub-label</label>
                  <input value={stat.sub} onChange={(e) => setStat(i, 'sub', e.target.value)} placeholder="e.g. city dispatch" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <h3>Contact &amp; stores</h3>
          <div className="manager-form">
            <Field label="Contact heading" fieldKey="contactHeading" />
            <Field label="Contact subtext" fieldKey="contactSub" />
            <Field label="WhatsApp number" fieldKey="whatsappNumber" hint="digits only" />
            <Field label="WhatsApp display" fieldKey="whatsappDisplay" hint="shown to visitors" />
            <Field label="WhatsApp sub" fieldKey="whatsappSub" />
            <Field label="Phone number" fieldKey="phone" />
            <Field label="Phone sub" fieldKey="phoneSub" />
            <Field label="Email address" fieldKey="email" />
            <Field label="Email sub" fieldKey="emailSub" />
            <Field label="Stores heading" fieldKey="storesHeading" />
          </div>
        </section>

        <section className="settings-section">
          <h3>Footer</h3>
          <div className="manager-form">
            <Field label="CTA heading" fieldKey="footerCtaHeading" />
            <Field label="Button text" fieldKey="footerButtonText" />
            <Field label="Copyright" fieldKey="footerCopyright" />
          </div>
        </section>

        {error && <p className="office-error">{error}</p>}
        {saved && <p className="office-success">Settings saved!</p>}

        <div style={{ padding: '0 0 40px' }}>
          <button type="submit" className="btn-primary btn-large" disabled={saving}>
            {saving ? 'Saving…' : 'Save all settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

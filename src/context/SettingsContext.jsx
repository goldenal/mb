import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getSettings } from '../api/settings.js'

const DEFAULTS = {
  siteName: 'Mature Beddings',
  siteTagline: 'Bedding that shapes how you rest',
  heroLines: ['Bedding that', 'shapes how', 'you rest'],
  aboutEyebrow: 'About Mature Beddings',
  aboutHeading: 'Comfort\nthat speaks',
  aboutBody: 'Our bedding is rooted in real rest — beds, mattresses, pillows and duvets crafted to support your body, calm your room, and last for years.',
  aboutTiles: [
    { heading: 'Luxury\nComfort', body: 'Plush, hotel-grade beds that feel warm and personal.' },
    { heading: 'Orthopedic\nSupport', body: 'Firmer cores engineered for true spinal alignment.' },
    { heading: 'Tailored\nBedding', body: 'Unique sets and sizes that reflect your space and lifestyle.' },
    { heading: 'Elegant\nBedrooms', body: "Calm, considered rooms you'll love coming home to." },
  ],
  bedsHeading: 'Selected Beds',
  mattressesEyebrow: 'Mattresses',
  mattressesHeading: 'Find your firmness',
  mattressesSub: 'Graded comfort layers so you can match support to the way you sleep.',
  pillowsEyebrow: 'Pillows',
  pillowsHeading: 'Soft, medium or firm',
  pillowsSub: 'Pick the loft that keeps your neck happy all night long.',
  duvetsEyebrow: 'Duvets & Bedcovers',
  duvetsHeading: 'The finishing layer',
  duvetsSub: 'Breathable covers and warm duvets in calm, easy-to-match tones.',
  deliveryEyebrow: 'Delivered to your comfort',
  deliveryHeading: 'We bring it home for you',
  deliveryBody: 'Every bed, mattress, pillow and duvet is delivered straight to your home and set up in your room — so all you have to do is rest. Prefer to collect? Visit any of our stores below.',
  deliveryStats: [
    { num: 'Affordable', sub: 'doorstep delivery' },
    { num: '24–48h', sub: 'city dispatch' },
    { num: 'Free', sub: 'in-room setup' },
  ],
  contactHeading: 'Reach us directly — no forms, just a quick message',
  contactSub: 'Message or call any time and our team will help you choose, price, and arrange delivery or pickup.',
  whatsappNumber: '10000000000',
  whatsappDisplay: '+1 (000) 000-0000',
  whatsappSub: 'Tap to chat instantly',
  phone: '+1 (000) 000-0000',
  phoneSub: 'Mon–Sat · 9am–7pm',
  email: 'hello@maturebeddings.com',
  emailSub: 'We reply within a day',
  storesHeading: 'Visit a store for pickup',
  deliveryNote: "Can't make it in? Everything is delivered to your home, free of charge.",
  footerCtaHeading: 'Ready for better sleep?',
  footerButtonText: 'Message us on WhatsApp',
  footerCopyright: '© 2026 Mature Beddings · Premium bedding, delivered to your comfort.',
}

const SettingsContext = createContext(DEFAULTS)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)

  const refresh = useCallback(() => {
    getSettings()
      .then(({ settings }) => setSettings(settings))
      .catch(console.error)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return (
    <SettingsContext.Provider value={{ settings, refresh }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)

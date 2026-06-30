import { useSettings } from '../context/SettingsContext'

export default function Footer() {
  const { settings } = useSettings()

  return (
    <section className="footer-section">
      <div className="footer-cta">
        <h2>{settings.footerCtaHeading}</h2>
        <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
          </svg>
          {settings.footerButtonText}
        </a>
      </div>
      <div className="footer-bottom">
        <div className="footer-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14202b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6"></path>
            <path d="M3 18h18"></path>
            <path d="M7 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span>{settings.siteName}</span>
        </div>
        <span className="footer-copy">{settings.footerCopyright}</span>
      </div>
    </section>
  )
}

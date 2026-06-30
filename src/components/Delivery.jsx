import { useSettings } from '../context/SettingsContext'

export default function Delivery() {
  const { settings } = useSettings()
  const stats = Array.isArray(settings.deliveryStats) ? settings.deliveryStats : []

  return (
    <section className="delivery-section">
      <div className="delivery-card">
        <div className="delivery-content">
          <div className="eyebrow">{settings.deliveryEyebrow}</div>
          <h2>{settings.deliveryHeading}</h2>
          <p>{settings.deliveryBody}</p>
          <div className="delivery-stats">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="stat-num">{stat.num}</div>
                <div className="stat-sub">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

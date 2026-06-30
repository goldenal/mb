import { useSettings } from '../context/SettingsContext'
import PillowCard from './PillowCard'

export default function Pillows({ featuredPillows = [], onOpenPillow, onOpenAllPillows }) {
  const { settings } = useSettings()

  return (
    <section id="pillows" className="block">
      <div className="row-head">
        <div>
          <div className="eyebrow">{settings.pillowsEyebrow}</div>
          <h2>{settings.pillowsHeading}</h2>
        </div>
        <div className="row-head-side">
          <p>{settings.pillowsSub}</p>
          <button type="button" className="see-all-link" onClick={onOpenAllPillows}>
            See all pillows →
          </button>
        </div>
      </div>
      <div className="grid-3">
        {featuredPillows.map((pillow) => (
          <PillowCard key={pillow.id} pillow={pillow} onOpen={onOpenPillow} />
        ))}
      </div>
    </section>
  )
}

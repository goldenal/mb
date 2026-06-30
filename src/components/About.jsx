import { useSettings } from '../context/SettingsContext'

function NLText({ text, Tag = 'h2' }) {
  const lines = (text || '').split('\n')
  return (
    <Tag>
      {lines.map((line, i) => (
        <span key={i}>{line}{i < lines.length - 1 ? <br /> : null}</span>
      ))}
    </Tag>
  )
}

export default function About() {
  const { settings } = useSettings()
  const tiles = Array.isArray(settings.aboutTiles) ? settings.aboutTiles : []

  return (
    <section className="about-wrap">
      <div className="about-card">

        <div className="about-row1">
          <div className="about-intro">
            <div className="eyebrow">{settings.aboutEyebrow}</div>
            <NLText text={settings.aboutHeading} Tag="h2" />
            <p>{settings.aboutBody}</p>
          </div>
          {tiles.length >= 2 && (
            <div className="about-pair">
              <div className="about-tile">
                <NLText text={tiles[0].heading} Tag="h3" />
                <p>{tiles[0].body}</p>
              </div>
              <div className="about-tile">
                <NLText text={tiles[1].heading} Tag="h3" />
                <p>{tiles[1].body}</p>
              </div>
            </div>
          )}
        </div>

        {tiles.length >= 4 && (
          <div className="about-row2">
            <div className="about-feature about-feature-tailored">
              <div className="feature-head">
                <NLText text={tiles[2].heading} Tag="h3" />
              </div>
              <p>{tiles[2].body}</p>
            </div>
            <div className="about-feature about-feature-elegant">
              <div className="feature-head">
                <NLText text={tiles[3].heading} Tag="h3" />
              </div>
              <p>{tiles[3].body}</p>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

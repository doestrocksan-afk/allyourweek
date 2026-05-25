import Link from 'next/link'
import { LANGS, LangCode, LANG_CODES } from '@/lib/i18n'

export default function Nav({ lang }: { lang: LangCode }) {
  return (
    <nav className="nav">
      <Link href={`/${lang}`} className="nav-logo">
        AllYourWeek.com
      </Link>
      <div className="nav-langs">
        {LANG_CODES.map(l => (
          <Link
            key={l}
            href={`/${l}`}
            className={`nav-lang ${l === lang ? 'active' : ''}`}
          >
            {LANGS[l].label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

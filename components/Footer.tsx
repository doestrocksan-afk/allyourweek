import Link from 'next/link'
import { LANGS, LangCode, LANG_CODES } from '@/lib/i18n'

export default function Footer({ lang, year }: { lang: LangCode; year: number }) {
  return (
    <footer className="footer">
      <div>© {year} AllYourWeek.com</div>
      <div className="footer-langs">
        {LANG_CODES.map(l => (
          <Link key={l} href={`/${l}`}>{LANGS[l].name}</Link>
        ))}
      </div>
      <div className="footer-links">
        <Link href={`/${lang}/privacy`}>Privacy</Link>
        <Link href={`/${lang}/about`}>About</Link>
      </div>
    </footer>
  )
}

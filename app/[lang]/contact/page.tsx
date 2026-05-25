import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ContactForm from './ContactForm'
import { LANGS, LangCode, LANG_CODES } from '@/lib/i18n'

type Props = { params: Promise<{ lang: string }> }

export async function generateStaticParams() {
  return LANG_CODES.map(lang => ({ lang }))
}

const TITLES: Record<LangCode, string> = {
  en: 'Contact us', es: 'Contacto', de: 'Kontakt', fr: 'Contact',
  it: 'Contattaci', pt: 'Contato', pl: 'Kontakt', nl: 'Contact',
  tr: 'İletişim', ro: 'Contact',
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params
  if (!LANG_CODES.includes(lang as LangCode)) notFound()
  const L = LANGS[lang as LangCode]
  const year = new Date().getFullYear()

  return (
    <>
      <Nav lang={lang as LangCode} />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 5vw, 42px)', color: 'var(--accent)', marginBottom: 32 }}>
          {TITLES[lang as LangCode]}
        </h1>
        <ContactForm lang={lang as LangCode} />
        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <Link href={`/${lang}/about`} className="quick-link">About</Link>
          <Link href={`/${lang}/privacy`} className="quick-link">Privacy</Link>
        </div>
      </main>
      <Footer lang={lang as LangCode} year={year} />
    </>
  )
}

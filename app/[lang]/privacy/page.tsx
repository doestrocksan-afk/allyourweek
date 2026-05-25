import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { LANGS, LangCode, LANG_CODES } from '@/lib/i18n'

type Props = { params: Promise<{ lang: string }> }

export async function generateStaticParams() {
  return LANG_CODES.map(lang => ({ lang }))
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params
  if (!LANG_CODES.includes(lang as LangCode)) notFound()
  const L = LANGS[lang as LangCode]
  const year = new Date().getFullYear()

  return (
    <>
      <Nav lang={lang as LangCode} />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 5vw, 42px)', color: 'var(--accent)', marginBottom: 24 }}>
          Privacy Policy
        </h1>

        <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p>Last updated: January 2025</p>

          <section>
            <h2 style={{ color: 'var(--text)', fontSize: 16, marginBottom: 8 }}>1. Information We Collect</h2>
            <p>AllYourWeek.com does not collect any personal information. We do not require registration or login. We do not store any user data on our servers.</p>
          </section>

          <section>
            <h2 style={{ color: 'var(--text)', fontSize: 16, marginBottom: 8 }}>2. Cookies and Analytics</h2>
            <p>We may use Google Analytics to understand aggregate traffic patterns. This data is anonymous and cannot be used to identify individual users. We also display advertisements through Google AdSense, which may use cookies to serve relevant ads.</p>
          </section>

          <section>
            <h2 style={{ color: 'var(--text)', fontSize: 16, marginBottom: 8 }}>3. Third-Party Services</h2>
            <p>Public holiday data is provided by Nager.Date (date.nager.at), a free and open-source API. No personal data is transmitted to this service.</p>
          </section>

          <section>
            <h2 style={{ color: 'var(--text)', fontSize: 16, marginBottom: 8 }}>4. Google AdSense</h2>
            <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
          </section>

          <section>
            <h2 style={{ color: 'var(--text)', fontSize: 16, marginBottom: 8 }}>5. Contact</h2>
            <p>For any privacy-related questions, please use our <Link href={`/${lang}/contact`} style={{ color: 'var(--accent)' }}>contact form</Link>.</p>
          </section>
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <Link href={`/${lang}/contact`} className="quick-link">Contact</Link>
          <Link href={`/${lang}/about`} className="quick-link">About</Link>
          <Link href={`/${lang}`} className="quick-link">← {L.t.currentWeek}</Link>
        </div>
      </main>
      <Footer lang={lang as LangCode} year={year} />
    </>
  )
}

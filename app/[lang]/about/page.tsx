import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { LANGS, LangCode, LANG_CODES } from '@/lib/i18n'

type Props = { params: Promise<{ lang: string }> }

export async function generateStaticParams() {
  return LANG_CODES.map(lang => ({ lang }))
}

const CONTENT: Record<LangCode, { title: string; body: string }> = {
  en: {
    title: 'About AllYourWeek.com',
    body: 'AllYourWeek.com is a free tool to find the current week number and browse any week of the year. We cover public holidays for over 30 countries in 10 languages. Our week numbers follow the ISO 8601 standard, where weeks start on Monday and the first week of the year is the one containing the first Thursday.',
  },
  es: {
    title: 'Sobre AllYourWeek.com',
    body: 'AllYourWeek.com es una herramienta gratuita para consultar el número de semana actual y navegar por cualquier semana del año. Cubrimos los festivos oficiales de más de 30 países en 10 idiomas. Los números de semana siguen el estándar ISO 8601, donde las semanas empiezan en lunes y la primera semana del año es la que contiene el primer jueves.',
  },
  de: {
    title: 'Über AllYourWeek.com',
    body: 'AllYourWeek.com ist ein kostenloses Tool, um die aktuelle Kalenderwoche zu finden und jede Woche des Jahres zu durchsuchen. Wir decken öffentliche Feiertage für über 30 Länder in 10 Sprachen ab. Unsere Kalenderwochen folgen dem ISO 8601-Standard.',
  },
  fr: {
    title: 'À propos de AllYourWeek.com',
    body: "AllYourWeek.com est un outil gratuit pour trouver le numéro de semaine actuel et parcourir n'importe quelle semaine de l'année. Nous couvrons les jours fériés officiels de plus de 30 pays en 10 langues, selon la norme ISO 8601.",
  },
  it: {
    title: 'Informazioni su AllYourWeek.com',
    body: 'AllYourWeek.com è uno strumento gratuito per trovare il numero della settimana corrente e sfogliare qualsiasi settimana dell\'anno. Copriamo le festività ufficiali di oltre 30 paesi in 10 lingue, seguendo lo standard ISO 8601.',
  },
  pt: {
    title: 'Sobre AllYourWeek.com',
    body: 'AllYourWeek.com é uma ferramenta gratuita para encontrar o número da semana atual e navegar por qualquer semana do ano. Cobrimos feriados oficiais de mais de 30 países em 10 idiomas, seguindo o padrão ISO 8601.',
  },
  pl: {
    title: 'O AllYourWeek.com',
    body: 'AllYourWeek.com to bezpłatne narzędzie do znajdowania numeru bieżącego tygodnia i przeglądania dowolnego tygodnia roku. Obejmujemy oficjalne święta ponad 30 krajów w 10 językach zgodnie ze standardem ISO 8601.',
  },
  nl: {
    title: 'Over AllYourWeek.com',
    body: 'AllYourWeek.com is een gratis tool om het huidige weeknummer te vinden en door elke week van het jaar te bladeren. We dekken officiële feestdagen voor meer dan 30 landen in 10 talen, volgens de ISO 8601-standaard.',
  },
  tr: {
    title: 'AllYourWeek.com Hakkında',
    body: "AllYourWeek.com, mevcut hafta numarasını bulmak ve yılın herhangi bir haftasına göz atmak için ücretsiz bir araçtır. ISO 8601 standardını takip ederek 10 dilde 30'dan fazla ülkenin resmi tatillerini kapsıyoruz.",
  },
  ro: {
    title: 'Despre AllYourWeek.com',
    body: 'AllYourWeek.com este un instrument gratuit pentru a găsi numărul săptămânii curente și a naviga prin orice săptămână a anului. Acoperim sărbătorile oficiale pentru peste 30 de țări în 10 limbi, urmând standardul ISO 8601.',
  },
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params
  if (!LANG_CODES.includes(lang as LangCode)) notFound()
  const L = LANGS[lang as LangCode]
  const c = CONTENT[lang as LangCode]
  const year = new Date().getFullYear()

  return (
    <>
      <Nav lang={lang as LangCode} />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 5vw, 42px)', color: 'var(--accent)', marginBottom: 24 }}>
          {c.title}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
          {c.body}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href={`/${lang}/contact`} className="quick-link">Contact</Link>
          <Link href={`/${lang}/privacy`} className="quick-link">Privacy</Link>
          <Link href={`/${lang}`} className="quick-link">← {L.t.currentWeek}</Link>
        </div>
      </main>
      <Footer lang={lang as LangCode} year={year} />
    </>
  )
}

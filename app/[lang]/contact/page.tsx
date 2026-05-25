'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { LANGS, LangCode, LANG_CODES } from '@/lib/i18n'

const LABELS: Record<LangCode, {
  title: string; name: string; email: string; message: string;
  send: string; sending: string; success: string; successMsg: string; back: string
}> = {
  en: { title: 'Contact us', name: 'Your name', email: 'Your email', message: 'Your message', send: 'Send message', sending: 'Sending...', success: 'Message sent!', successMsg: 'Thank you for contacting us. We will get back to you within 48 hours.', back: '← Back' },
  es: { title: 'Contacto', name: 'Tu nombre', email: 'Tu email', message: 'Tu mensaje', send: 'Enviar mensaje', sending: 'Enviando...', success: '¡Mensaje enviado!', successMsg: 'Gracias por contactarnos. Te responderemos en menos de 48 horas.', back: '← Volver' },
  de: { title: 'Kontakt', name: 'Ihr Name', email: 'Ihre E-Mail', message: 'Ihre Nachricht', send: 'Nachricht senden', sending: 'Senden...', success: 'Nachricht gesendet!', successMsg: 'Vielen Dank. Wir melden uns innerhalb von 48 Stunden.', back: '← Zurück' },
  fr: { title: 'Contact', name: 'Votre nom', email: 'Votre email', message: 'Votre message', send: 'Envoyer', sending: 'Envoi...', success: 'Message envoyé!', successMsg: 'Merci de nous avoir contactés. Nous vous répondrons dans les 48 heures.', back: '← Retour' },
  it: { title: 'Contattaci', name: 'Il tuo nome', email: 'La tua email', message: 'Il tuo messaggio', send: 'Invia messaggio', sending: 'Invio...', success: 'Messaggio inviato!', successMsg: 'Grazie per averci contattato. Ti risponderemo entro 48 ore.', back: '← Indietro' },
  pt: { title: 'Contato', name: 'Seu nome', email: 'Seu email', message: 'Sua mensagem', send: 'Enviar mensagem', sending: 'Enviando...', success: 'Mensagem enviada!', successMsg: 'Obrigado por entrar em contato. Responderemos em até 48 horas.', back: '← Voltar' },
  pl: { title: 'Kontakt', name: 'Twoje imię', email: 'Twój email', message: 'Twoja wiadomość', send: 'Wyślij wiadomość', sending: 'Wysyłanie...', success: 'Wiadomość wysłana!', successMsg: 'Dziękujemy za kontakt. Odpowiemy w ciągu 48 godzin.', back: '← Wróć' },
  nl: { title: 'Contact', name: 'Uw naam', email: 'Uw e-mail', message: 'Uw bericht', send: 'Bericht sturen', sending: 'Verzenden...', success: 'Bericht verzonden!', successMsg: 'Bedankt voor uw bericht. We reageren binnen 48 uur.', back: '← Terug' },
  tr: { title: 'İletişim', name: 'Adınız', email: 'E-postanız', message: 'Mesajınız', send: 'Mesaj gönder', sending: 'Gönderiliyor...', success: 'Mesaj gönderildi!', successMsg: 'Bize ulaştığınız için teşekkürler. 48 saat içinde yanıt vereceğiz.', back: '← Geri' },
  ro: { title: 'Contact', name: 'Numele dvs.', email: 'Email-ul dvs.', message: 'Mesajul dvs.', send: 'Trimite mesaj', sending: 'Se trimite...', success: 'Mesaj trimis!', successMsg: 'Vă mulțumim că ne-ați contactat. Vă vom răspunde în 48 de ore.', back: '← Înapoi' },
}

function ContactForm({ lang }: { lang: LangCode }) {
  const t = LABELS[lang]
  const L = LANGS[lang]
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) return
    setState('sending')
    // Simulate sending
    setTimeout(() => setState('sent'), 1500)
  }

  if (state === 'sent') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--accent)', marginBottom: 12 }}>{t.success}</h2>
        <p style={{ color: 'var(--muted)', fontSize: 15 }}>{t.successMsg}</p>
        <Link href={`/${lang}`} style={{ display: 'inline-block', marginTop: 24 }} className="quick-link">{t.back}</Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>
          {t.name.toUpperCase()}
        </label>
        <input
          required
          value={name}
          onChange={e => setName(e.target.value)}
          className="search-input"
          style={{ width: '100%' }}
          placeholder={t.name}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>
          {t.email.toUpperCase()}
        </label>
        <input
          required
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="search-input"
          style={{ width: '100%' }}
          placeholder={t.email}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>
          {t.message.toUpperCase()}
        </label>
        <textarea
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="search-input"
          rows={5}
          style={{ width: '100%', resize: 'vertical', fontFamily: 'var(--font-sans)' }}
          placeholder={t.message}
        />
      </div>
      <button
        type="submit"
        className="search-btn"
        disabled={state === 'sending'}
        style={{ alignSelf: 'flex-start', padding: '12px 28px', fontSize: 14 }}
      >
        {state === 'sending' ? t.sending : t.send}
      </button>
    </form>
  )
}

// Need a wrapper since page needs to be server component for generateStaticParams
// but form needs client interactivity
export default function ContactPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as LangCode
  if (!LANG_CODES.includes(lang)) return null
  const t = LABELS[lang]
  const year = new Date().getFullYear()

  return (
    <>
      <Nav lang={lang} />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 5vw, 42px)', color: 'var(--accent)', marginBottom: 32 }}>
          {t.title}
        </h1>
        <ContactForm lang={lang} />
        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <Link href={`/${lang}/about`} className="quick-link">About</Link>
          <Link href={`/${lang}/privacy`} className="quick-link">Privacy</Link>
        </div>
      </main>
      <Footer lang={lang} year={year} />
    </>
  )
}

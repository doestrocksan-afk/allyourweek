'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LangCode, LANGS } from '@/lib/i18n'
import { getISOWeek } from '@/lib/weeks'

const MONTH_PAIRS: [string, number][] = [
  ['january',1],['february',2],['march',3],['april',4],['may',5],['june',6],
  ['july',7],['august',8],['september',9],['october',10],['november',11],['december',12],
  ['jan',1],['feb',2],['mar',3],['apr',4],['jun',6],['jul',7],['aug',8],['sep',9],['oct',10],['nov',11],['dec',12],
  ['enero',1],['febrero',2],['marzo',3],['abril',4],['mayo',5],['junio',6],
  ['julio',7],['agosto',8],['septiembre',9],['octubre',10],['noviembre',11],['diciembre',12],
  ['ene',1],['abr',4],['ago',8],['dic',12],
  ['janvier',1],['février',2],['mars',3],['avril',4],['mai',5],['juin',6],
  ['juillet',7],['août',8],['octobre',10],['décembre',12],
  ['janv',1],['févr',2],['avr',4],['juil',7],
  ['januar',1],['februar',2],['märz',3],['juni',6],['juli',7],['oktober',10],['dezember',12],
  ['mär',3],['okt',10],['dez',12],
  ['gennaio',1],['febbraio',2],['aprile',4],['maggio',5],['giugno',6],
  ['luglio',7],['settembre',9],['ottobre',10],
  ['gen',1],['mag',5],['giu',6],['lug',7],['set',9],['ott',10],
  ['janeiro',1],['fevereiro',2],['março',3],['junho',6],['julho',7],
  ['januari',1],['februari',2],['maart',3],['mei',5],['augustus',8],
  ['styczeń',1],['luty',2],['marzec',3],['kwiecień',4],['czerwiec',6],
  ['lipiec',7],['sierpień',8],['wrzesień',9],['październik',10],['listopad',11],['grudzień',12],
  ['sty',1],['lut',2],['kwi',4],['cze',6],['lip',7],['sie',8],['wrz',9],['paź',10],['lis',11],['gru',12],
  ['ocak',1],['şubat',2],['mart',3],['nisan',4],['mayıs',5],['haziran',6],
  ['temmuz',7],['ağustos',8],['eylül',9],['ekim',10],['kasım',11],['aralık',12],
  ['oca',1],['şub',2],['nis',4],['haz',6],['tem',7],['ağu',8],['eyl',9],['eki',10],['kas',11],['ara',12],
  ['ianuarie',1],['februarie',2],['martie',3],['iunie',6],['iulie',7],
]
const MONTH_MAPS: Record<string, number> = {}
MONTH_PAIRS.forEach(([k, v]) => { if (!MONTH_MAPS[k]) MONTH_MAPS[k] = v })

function parseMultilingualDate(v: string): Date | null {
  const clean = v.toLowerCase().replace(/[.,]/g, ' ').replace(/\s+/g, ' ').trim()

  // Try native Date (ISO, en-US)
  const native = new Date(v)
  if (!isNaN(native.getTime()) && native.getFullYear() > 1970) return native

  // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmyMatch = v.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/)
  if (dmyMatch) {
    const yr = parseInt(dmyMatch[3]) < 100 ? 2000 + parseInt(dmyMatch[3]) : parseInt(dmyMatch[3])
    const d = new Date(yr, parseInt(dmyMatch[2]) - 1, parseInt(dmyMatch[1]))
    if (!isNaN(d.getTime())) return d
  }

  // "15 junio 2027", "15 de junio de 2027", "junio 15 2027"
  const parts = clean.replace(/ de /g, ' ').replace(/ del /g, ' ').split(/\s+/)
  let day: number | null = null
  let month: number | null = null
  let year: number | null = null

  for (const part of parts) {
    const num = parseInt(part)
    if (!isNaN(num) && part === String(num)) {
      if (num > 31) year = num
      else if (num >= 1 && num <= 31 && day === null) day = num
    } else {
      const m = MONTH_MAPS[part] ?? MONTH_MAPS[part.normalize('NFD').replace(/[\u0300-\u036f]/g, '')]
      if (m) month = m
    }
  }

  if (day && month) {
    // Use current year if not specified — but don't use new Date() for default year
    // Use the year from the parsed string, or fall back to a fixed reference
    const y = year ?? new Date().getFullYear()
    const d = new Date(y, month - 1, day)
    if (!isNaN(d.getTime())) return d
  }

  return null
}

type Props = {
  lang: LangCode
  currentYear: number  // passed from server to avoid hydration mismatch
}

export default function SearchBox({ lang, currentYear }: Props) {
  const [val, setVal] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const L = LANGS[lang]

  function handleSearch() {
    const v = val.trim()
    if (!v) return
    setError('')

    // Pure week number: "25"
    const num = parseInt(v)
    if (!isNaN(num) && num >= 1 && num <= 53 && v === String(num)) {
      router.push(`/${lang}/${currentYear}/${num}`)
      return
    }

    // "week 25", "semana 25", "KW 25" etc
    const weekWordMatch = v.match(/^(?:week|semana|kw|woche|semaine|settimana|tydzień|hafta|săptămâna)\s+(\d+)(?:\s+(\d{4}))?$/i)
    if (weekWordMatch) {
      const w = parseInt(weekWordMatch[1])
      const y = weekWordMatch[2] ? parseInt(weekWordMatch[2]) : currentYear
      router.push(`/${lang}/${y}/${w}`)
      return
    }

    // "25 2026" or "2026 25"
    const parts = v.split(/\s+/)
    if (parts.length === 2) {
      const a = parseInt(parts[0]), b = parseInt(parts[1])
      if (!isNaN(a) && !isNaN(b)) {
        if (b > 53 && a >= 1 && a <= 53) { router.push(`/${lang}/${b}/${a}`); return }
        if (a > 53 && b >= 1 && b <= 53) { router.push(`/${lang}/${a}/${b}`); return }
      }
    }

    // Multilingual date
    const date = parseMultilingualDate(v)
    if (date) {
      const { week, year } = getISOWeek(date)
      router.push(`/${lang}/${year}/${week}`)
      return
    }

    setError(L.t.searchHint)
  }

  return (
    <div className="search-wrap">
      <div className="search-row">
        <input
          className="search-input"
          placeholder={L.t.searchPlaceholder}
          value={val}
          onChange={e => { setVal(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          suppressHydrationWarning
        />
        <button className="search-btn" onClick={handleSearch}>→</button>
      </div>
      {error
        ? <p className="search-hint" style={{ color: '#e55' }}>{error}</p>
        : <p className="search-hint">{L.t.searchPlaceholder}</p>
      }
    </div>
  )
}

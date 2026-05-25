import { getEaster, getSpecialDates } from './weeks'
import { LangCode } from './i18n'

export type SpecialDate = {
  slug: string
  date: Date
  nameKey: string
}

// Slugs per language for each special date
export const SPECIAL_SLUGS: Record<string, Record<LangCode, string>> = {
  easter:     { en:'easter',      es:'pascua',      de:'ostern',      fr:'paques',       it:'pasqua',      pt:'pascoa',      pl:'wielkanoc',   nl:'pasen',       tr:'paskalya',    ro:'paste'        },
  carnival:   { en:'carnival',    es:'carnaval',    de:'karneval',    fr:'carnaval',     it:'carnevale',   pt:'carnaval',    pl:'karnawał',    nl:'carnaval',    tr:'karnaval',    ro:'carnaval'     },
  goodfriday: { en:'good-friday', es:'viernes-santo', de:'karfreitag', fr:'vendredi-saint', it:'venerdi-santo', pt:'sexta-feira-santa', pl:'wielki-piatek', nl:'goede-vrijdag', tr:'kutsal-cuma', ro:'vinerea-mare' },
  ascension:  { en:'ascension',   es:'ascension',   de:'himmelfahrt', fr:'ascension',    it:'ascensione',  pt:'ascensao',    pl:'wniebowstapienie', nl:'hemelvaartsdag', tr:'iса-göğe-çıkışı', ro:'inaltarea' },
  pentecost:  { en:'pentecost',   es:'pentecostes', de:'pfingsten',   fr:'pentecote',    it:'pentecoste',  pt:'pentecostes', pl:'zielone-swiatki', nl:'pinksteren', tr:'pentekost',  ro:'rusalii'      },
  christmas:  { en:'christmas',   es:'navidad',     de:'weihnachten', fr:'noel',         it:'natale',      pt:'natal',       pl:'boze-narodzenie', nl:'kerstmis',  tr:'noel',        ro:'craciun'      },
  newyear:    { en:'new-year',    es:'ano-nuevo',   de:'neujahr',     fr:'nouvel-an',    it:'capodanno',   pt:'ano-novo',    pl:'nowy-rok',    nl:'nieuwjaar',   tr:'yilbasi',     ro:'anul-nou'     },
}

export const SPECIAL_NAMES: Record<string, Record<LangCode, string>> = {
  easter:     { en:'Easter',           es:'Pascua',            de:'Ostern',           fr:'Pâques',          it:'Pasqua',           pt:'Páscoa',           pl:'Wielkanoc',        nl:'Pasen',            tr:'Paskalya',         ro:'Paște'         },
  carnival:   { en:'Carnival',         es:'Carnaval',          de:'Karneval',         fr:'Carnaval',        it:'Carnevale',        pt:'Carnaval',         pl:'Karnawał',         nl:'Carnaval',         tr:'Karnaval',         ro:'Carnaval'      },
  goodfriday: { en:'Good Friday',      es:'Viernes Santo',     de:'Karfreitag',       fr:'Vendredi Saint',  it:'Venerdì Santo',    pt:'Sexta-feira Santa', pl:'Wielki Piątek',   nl:'Goede Vrijdag',    tr:'Kutsal Cuma',      ro:'Vinerea Mare'  },
  ascension:  { en:'Ascension Day',    es:'Ascensión',         de:'Christi Himmelfahrt', fr:'Ascension',    it:'Ascensione',       pt:'Ascensão',         pl:'Wniebowstąpienie', nl:'Hemelvaartsdag',   tr:'İsa\'nın Göğe Çıkışı', ro:'Înălțarea' },
  pentecost:  { en:'Pentecost',        es:'Pentecostés',       de:'Pfingsten',        fr:'Pentecôte',       it:'Pentecoste',       pt:'Pentecostes',      pl:'Zielone Świątki',  nl:'Pinksteren',       tr:'Pentekost',        ro:'Rusalii'       },
  christmas:  { en:'Christmas',        es:'Navidad',           de:'Weihnachten',      fr:'Noël',            it:'Natale',           pt:'Natal',            pl:'Boże Narodzenie',  nl:'Kerstmis',         tr:'Noel',             ro:'Crăciun'       },
  newyear:    { en:'New Year\'s Day',  es:'Año Nuevo',         de:'Neujahr',          fr:'Nouvel An',       it:'Capodanno',        pt:'Ano Novo',         pl:'Nowy Rok',         nl:'Nieuwjaarsdag',    tr:'Yılbaşı',          ro:'Anul Nou'      },
}

export const SPECIAL_DESC: Record<string, Record<LangCode, string>> = {
  easter:     { en:'Easter Sunday — the most important Christian celebration', es:'Domingo de Pascua — la festividad cristiana más importante del año', de:'Ostersonntag — das wichtigste christliche Fest', fr:'Dimanche de Pâques — la fête chrétienne la plus importante', it:'Domenica di Pasqua — la più importante festa cristiana', pt:'Domingo de Páscoa — a mais importante celebração cristã', pl:'Niedziela Wielkanocna — najważniejsze święto chrześcijańskie', nl:'Eerste Paasdag — het belangrijkste christelijke feest', tr:'Paskalya Pazarı — en önemli Hristiyan bayramı', ro:'Duminica Paștelui — cea mai importantă sărbătoare creștină' },
  carnival:   { en:'Carnival — 47 days before Easter, the start of festive season', es:'Carnaval — 47 días antes de Pascua, inicio de la temporada festiva', de:'Karneval — 47 Tage vor Ostern, Beginn der Faschingssaison', fr:'Carnaval — 47 jours avant Pâques, début de la saison festive', it:'Carnevale — 47 giorni prima di Pasqua', pt:'Carnaval — 47 dias antes da Páscoa', pl:'Karnawał — 47 dni przed Wielkanocą', nl:'Carnaval — 47 dagen voor Pasen', tr:'Karnaval — Paskalyadan 47 gün önce', ro:'Carnaval — 47 de zile înainte de Paște' },
  goodfriday: { en:'Good Friday — 2 days before Easter, commemorating the crucifixion', es:'Viernes Santo — 2 días antes de Pascua, conmemoración de la crucifixión', de:'Karfreitag — 2 Tage vor Ostern', fr:'Vendredi Saint — 2 jours avant Pâques', it:'Venerdì Santo — 2 giorni prima di Pasqua', pt:'Sexta-feira Santa — 2 dias antes da Páscoa', pl:'Wielki Piątek — 2 dni przed Wielkanocą', nl:'Goede Vrijdag — 2 dagen voor Pasen', tr:'Kutsal Cuma — Paskalyadan 2 gün önce', ro:'Vinerea Mare — 2 zile înainte de Paște' },
  ascension:  { en:'Ascension Day — 39 days after Easter', es:'Ascensión — 39 días después de Pascua', de:'Christi Himmelfahrt — 39 Tage nach Ostern', fr:'Ascension — 39 jours après Pâques', it:'Ascensione — 39 giorni dopo Pasqua', pt:'Ascensão — 39 dias após a Páscoa', pl:'Wniebowstąpienie — 39 dni po Wielkanocy', nl:'Hemelvaartsdag — 39 dagen na Pasen', tr:'Göğe Çıkış — Paskalyadan 39 gün sonra', ro:'Înălțarea — 39 de zile după Paște' },
  pentecost:  { en:'Pentecost — 49 days after Easter (Whit Sunday)', es:'Pentecostés — 49 días después de Pascua', de:'Pfingsten — 49 Tage nach Ostern', fr:'Pentecôte — 49 jours après Pâques', it:'Pentecoste — 49 giorni dopo Pasqua', pt:'Pentecostes — 49 dias após a Páscoa', pl:'Zielone Świątki — 49 dni po Wielkanocy', nl:'Pinksteren — 49 dagen na Pasen', tr:'Pentekost — Paskalyadan 49 gün sonra', ro:'Rusalii — 49 de zile după Paște' },
  christmas:  { en:'Christmas Day — 25 December', es:'Navidad — 25 de diciembre', de:'Erster Weihnachtstag — 25. Dezember', fr:'Noël — 25 décembre', it:'Natale — 25 dicembre', pt:'Natal — 25 de dezembro', pl:'Boże Narodzenie — 25 grudnia', nl:'Eerste Kerstdag — 25 december', tr:'Noel — 25 Aralık', ro:'Crăciun — 25 decembrie' },
  newyear:    { en:'New Year\'s Day — 1 January', es:'Año Nuevo — 1 de enero', de:'Neujahr — 1. Januar', fr:'Jour de l\'An — 1er janvier', it:'Capodanno — 1 gennaio', pt:'Ano Novo — 1 de janeiro', pl:'Nowy Rok — 1 stycznia', nl:'Nieuwjaarsdag — 1 januari', tr:'Yılbaşı — 1 Ocak', ro:'Anul Nou — 1 ianuarie' },
}

export function getSpecialDateForYear(key: string, year: number): Date {
  const { easter, carnival, goodFriday, ascension, pentecost } = getSpecialDates(year)
  switch (key) {
    case 'easter':     return easter
    case 'carnival':   return carnival
    case 'goodfriday': return goodFriday
    case 'ascension':  return ascension
    case 'pentecost':  return pentecost
    case 'christmas':  return new Date(year, 11, 25)
    case 'newyear':    return new Date(year, 0, 1)
    default:           return new Date(year, 0, 1)
  }
}

// Given a slug and lang, find the special key
export function findSpecialKey(slug: string, lang: LangCode): string | null {
  for (const [key, slugs] of Object.entries(SPECIAL_SLUGS)) {
    if (slugs[lang] === slug) return key
  }
  return null
}

export const SPECIAL_KEYS = Object.keys(SPECIAL_SLUGS)

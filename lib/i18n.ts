export type LangCode = 'en' | 'es' | 'de' | 'fr' | 'it' | 'pt' | 'pl' | 'nl' | 'tr' | 'ro'

export type CountryConfig = {
  code: string
  name: string
  slug: string
}

export type LangConfig = {
  label: string
  name: string
  hreflang: string
  countries: CountryConfig[]
  months: string[]
  monthsShort: string[]
  days: string[]
  daysShort: string[]
  t: {
    currentWeek: string
    week: string
    weekOf: string
    calendar: string
    holidays: string
    holidaysThisWeek: string
    noHolidays: string
    browseWeeks: string
    weekAtAGlance: string
    weekOf52: string
    yearDone: string
    dayOfYear: string
    daysRemaining: string
    searchPlaceholder: string
    searchHint: string
    calendarYear: string
    holidaysIn: string
    metaWeek: (week: number, year: number, start: string, end: string) => string
    metaHome: string
  }
}

export const LANGS: Record<LangCode, LangConfig> = {
  en: {
    label: 'EN', name: 'English', hreflang: 'en',
    countries: [
      { code: 'GB', name: 'United Kingdom', slug: 'united-kingdom' },
      { code: 'US', name: 'United States', slug: 'united-states' },
      { code: 'IE', name: 'Ireland', slug: 'ireland' },
      { code: 'AU', name: 'Australia', slug: 'australia' },
      { code: 'NZ', name: 'New Zealand', slug: 'new-zealand' },
      { code: 'CA', name: 'Canada', slug: 'canada' },
      { code: 'SG', name: 'Singapore', slug: 'singapore' },
      { code: 'IN', name: 'India', slug: 'india' },
    ],
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    daysShort: ['Mo','Tu','We','Th','Fr','Sa','Su'],
    t: {
      currentWeek: 'Current week',
      week: 'Week',
      weekOf: 'Week of',
      calendar: 'Calendar',
      holidays: 'Public holidays',
      holidaysThisWeek: 'Public holidays this week',
      noHolidays: 'No public holidays this week',
      browseWeeks: 'Browse weeks',
      weekAtAGlance: 'Week at a glance',
      weekOf52: 'of 52 weeks',
      yearDone: 'of year done',
      dayOfYear: 'day of the year',
      daysRemaining: 'days remaining',
      searchPlaceholder: 'e.g. 25 2026, June 15...',
      searchHint: 'Enter a week number or date',
      calendarYear: 'Calendar',
      holidaysIn: 'Public holidays in',
      metaWeek: (w, y, s, e) => `Week ${w}, ${y} starts on ${s} and ends on ${e}.`,
      metaHome: 'What week is it? Find out the current week number and browse any week of the year.',
    }
  },
  es: {
    label: 'ES', name: 'Español', hreflang: 'es',
    countries: [
      { code: 'ES', name: 'España', slug: 'espana' },
      { code: 'MX', name: 'México', slug: 'mexico' },
      { code: 'AR', name: 'Argentina', slug: 'argentina' },
      { code: 'CO', name: 'Colombia', slug: 'colombia' },
      { code: 'CL', name: 'Chile', slug: 'chile' },
      { code: 'PE', name: 'Perú', slug: 'peru' },
      { code: 'VE', name: 'Venezuela', slug: 'venezuela' },
      { code: 'UY', name: 'Uruguay', slug: 'uruguay' },
      { code: 'EC', name: 'Ecuador', slug: 'ecuador' },
      { code: 'BO', name: 'Bolivia', slug: 'bolivia' },
      { code: 'PY', name: 'Paraguay', slug: 'paraguay' },
    ],
    months: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
    monthsShort: ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],
    days: ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'],
    daysShort: ['Lu','Ma','Mi','Ju','Vi','Sa','Do'],
    t: {
      currentWeek: 'Semana actual',
      week: 'Semana',
      weekOf: 'Semana del',
      calendar: 'Calendario',
      holidays: 'Festivos',
      holidaysThisWeek: 'Festivos esta semana',
      noHolidays: 'No hay festivos esta semana',
      browseWeeks: 'Ver semanas',
      weekAtAGlance: 'Esta semana',
      weekOf52: 'de 52 semanas',
      yearDone: 'del año completado',
      dayOfYear: 'día del año',
      daysRemaining: 'días restantes',
      searchPlaceholder: 'Ej: 25 2026, 15 junio...',
      searchHint: 'Introduce un número de semana o fecha',
      calendarYear: 'Calendario',
      holidaysIn: 'Festivos en',
      metaWeek: (w, y, s, e) => `La semana ${w} de ${y} empieza el ${s} y termina el ${e}.`,
      metaHome: '¿Qué semana es? Consulta el número de semana actual y navega por cualquier semana del año.',
    }
  },
  de: {
    label: 'DE', name: 'Deutsch', hreflang: 'de',
    countries: [
      { code: 'DE', name: 'Deutschland', slug: 'deutschland' },
      { code: 'AT', name: 'Österreich', slug: 'oesterreich' },
      { code: 'CH', name: 'Schweiz', slug: 'schweiz' },
      { code: 'LI', name: 'Liechtenstein', slug: 'liechtenstein' },
    ],
    months: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
    monthsShort: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
    days: ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'],
    daysShort: ['Mo','Di','Mi','Do','Fr','Sa','So'],
    t: {
      currentWeek: 'Aktuelle Kalenderwoche',
      week: 'KW',
      weekOf: 'Woche vom',
      calendar: 'Kalender',
      holidays: 'Feiertage',
      holidaysThisWeek: 'Feiertage diese Woche',
      noHolidays: 'Keine Feiertage diese Woche',
      browseWeeks: 'Wochen durchsuchen',
      weekAtAGlance: 'Diese Woche',
      weekOf52: 'von 52 Wochen',
      yearDone: 'des Jahres vergangen',
      dayOfYear: 'Tag des Jahres',
      daysRemaining: 'verbleibende Tage',
      searchPlaceholder: 'z.B. KW 25, 15. Juni...',
      searchHint: 'Kalenderwoche oder Datum eingeben',
      calendarYear: 'Kalender',
      holidaysIn: 'Feiertage in',
      metaWeek: (w, y, s, e) => `Kalenderwoche ${w} ${y} beginnt am ${s} und endet am ${e}.`,
      metaHome: 'Welche Kalenderwoche ist heute? Finde die aktuelle KW und durchsuche alle Wochen des Jahres.',
    }
  },
  fr: {
    label: 'FR', name: 'Français', hreflang: 'fr',
    countries: [
      { code: 'FR', name: 'France', slug: 'france' },
      { code: 'BE', name: 'Belgique', slug: 'belgique' },
      { code: 'CH', name: 'Suisse', slug: 'suisse' },
      { code: 'LU', name: 'Luxembourg', slug: 'luxembourg' },
      { code: 'MC', name: 'Monaco', slug: 'monaco' },
      { code: 'CA', name: 'Canada (Québec)', slug: 'canada-fr' },
    ],
    months: ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
    monthsShort: ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'],
    days: ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'],
    daysShort: ['Lu','Ma','Me','Je','Ve','Sa','Di'],
    t: {
      currentWeek: 'Semaine actuelle',
      week: 'Semaine',
      weekOf: 'Semaine du',
      calendar: 'Calendrier',
      holidays: 'Jours fériés',
      holidaysThisWeek: 'Jours fériés cette semaine',
      noHolidays: 'Aucun jour férié cette semaine',
      browseWeeks: 'Parcourir les semaines',
      weekAtAGlance: 'Cette semaine',
      weekOf52: 'sur 52 semaines',
      yearDone: "de l'année écoulée",
      dayOfYear: "jour de l'année",
      daysRemaining: 'jours restants',
      searchPlaceholder: 'Ex: semaine 25, 15 juin...',
      searchHint: 'Entrez un numéro de semaine ou une date',
      calendarYear: 'Calendrier',
      holidaysIn: 'Jours fériés en',
      metaWeek: (w, y, s, e) => `La semaine ${w} de ${y} commence le ${s} et se termine le ${e}.`,
      metaHome: 'Quel numéro de semaine sommes-nous ? Trouvez la semaine actuelle et naviguez dans toutes les semaines de l\'année.',
    }
  },
  it: {
    label: 'IT', name: 'Italiano', hreflang: 'it',
    countries: [
      { code: 'IT', name: 'Italia', slug: 'italia' },
      { code: 'CH', name: 'Svizzera', slug: 'svizzera' },
    ],
    months: ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'],
    monthsShort: ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'],
    days: ['lunedì','martedì','mercoledì','giovedì','venerdì','sabato','domenica'],
    daysShort: ['Lu','Ma','Me','Gi','Ve','Sa','Do'],
    t: {
      currentWeek: 'Settimana attuale',
      week: 'Settimana',
      weekOf: 'Settimana del',
      calendar: 'Calendario',
      holidays: 'Festività',
      holidaysThisWeek: 'Festività questa settimana',
      noHolidays: 'Nessuna festività questa settimana',
      browseWeeks: 'Sfoglia settimane',
      weekAtAGlance: 'Questa settimana',
      weekOf52: 'di 52 settimane',
      yearDone: "dell'anno trascorso",
      dayOfYear: "giorno dell'anno",
      daysRemaining: 'giorni rimanenti',
      searchPlaceholder: 'Es: settimana 25, 15 giugno...',
      searchHint: 'Inserisci un numero di settimana o una data',
      calendarYear: 'Calendario',
      holidaysIn: 'Festività in',
      metaWeek: (w, y, s, e) => `La settimana ${w} del ${y} inizia il ${s} e termina il ${e}.`,
      metaHome: 'Che settimana è? Scopri il numero della settimana corrente e naviga in qualsiasi settimana dell\'anno.',
    }
  },
  pt: {
    label: 'PT', name: 'Português', hreflang: 'pt',
    countries: [
      { code: 'PT', name: 'Portugal', slug: 'portugal' },
      { code: 'BR', name: 'Brasil', slug: 'brasil' },
      { code: 'AO', name: 'Angola', slug: 'angola' },
      { code: 'MZ', name: 'Moçambique', slug: 'mocambique' },
    ],
    months: ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],
    monthsShort: ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'],
    days: ['segunda','terça','quarta','quinta','sexta','sábado','domingo'],
    daysShort: ['Se','Te','Qu','Qu','Se','Sá','Do'],
    t: {
      currentWeek: 'Semana atual',
      week: 'Semana',
      weekOf: 'Semana de',
      calendar: 'Calendário',
      holidays: 'Feriados',
      holidaysThisWeek: 'Feriados esta semana',
      noHolidays: 'Sem feriados esta semana',
      browseWeeks: 'Ver semanas',
      weekAtAGlance: 'Esta semana',
      weekOf52: 'de 52 semanas',
      yearDone: 'do ano concluído',
      dayOfYear: 'dia do ano',
      daysRemaining: 'dias restantes',
      searchPlaceholder: 'Ex: semana 25, 15 junho...',
      searchHint: 'Insira um número de semana ou data',
      calendarYear: 'Calendário',
      holidaysIn: 'Feriados em',
      metaWeek: (w, y, s, e) => `A semana ${w} de ${y} começa em ${s} e termina em ${e}.`,
      metaHome: 'Que semana é hoje? Veja o número da semana atual e navegue por qualquer semana do ano.',
    }
  },
  pl: {
    label: 'PL', name: 'Polski', hreflang: 'pl',
    countries: [{ code: 'PL', name: 'Polska', slug: 'polska' }],
    months: ['styczeń','luty','marzec','kwiecień','maj','czerwiec','lipiec','sierpień','wrzesień','październik','listopad','grudzień'],
    monthsShort: ['sty','lut','mar','kwi','maj','cze','lip','sie','wrz','paź','lis','gru'],
    days: ['poniedziałek','wtorek','środa','czwartek','piątek','sobota','niedziela'],
    daysShort: ['Pn','Wt','Śr','Cz','Pt','So','Nd'],
    t: {
      currentWeek: 'Bieżący tydzień',
      week: 'Tydzień',
      weekOf: 'Tydzień',
      calendar: 'Kalendarz',
      holidays: 'Święta',
      holidaysThisWeek: 'Święta w tym tygodniu',
      noHolidays: 'Brak świąt w tym tygodniu',
      browseWeeks: 'Przeglądaj tygodnie',
      weekAtAGlance: 'Ten tydzień',
      weekOf52: 'z 52 tygodni',
      yearDone: 'roku minęło',
      dayOfYear: 'dzień roku',
      daysRemaining: 'dni pozostało',
      searchPlaceholder: 'Np. tydzień 25, 15 czerwca...',
      searchHint: 'Wpisz numer tygodnia lub datę',
      calendarYear: 'Kalendarz',
      holidaysIn: 'Święta w',
      metaWeek: (w, y, s, e) => `Tydzień ${w} roku ${y} zaczyna się ${s} i kończy ${e}.`,
      metaHome: 'Który tydzień jest teraz? Sprawdź numer bieżącego tygodnia i przeglądaj każdy tydzień roku.',
    }
  },
  nl: {
    label: 'NL', name: 'Nederlands', hreflang: 'nl',
    countries: [
      { code: 'NL', name: 'Nederland', slug: 'nederland' },
      { code: 'BE', name: 'België', slug: 'belgie' },
    ],
    months: ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'],
    monthsShort: ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'],
    days: ['maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag','zondag'],
    daysShort: ['Ma','Di','Wo','Do','Vr','Za','Zo'],
    t: {
      currentWeek: 'Huidige week',
      week: 'Week',
      weekOf: 'Week van',
      calendar: 'Kalender',
      holidays: 'Feestdagen',
      holidaysThisWeek: 'Feestdagen deze week',
      noHolidays: 'Geen feestdagen deze week',
      browseWeeks: 'Weken bekijken',
      weekAtAGlance: 'Deze week',
      weekOf52: 'van 52 weken',
      yearDone: 'van het jaar voorbij',
      dayOfYear: 'dag van het jaar',
      daysRemaining: 'dagen resterend',
      searchPlaceholder: 'Bijv. week 25, 15 juni...',
      searchHint: 'Voer een weeknummer of datum in',
      calendarYear: 'Kalender',
      holidaysIn: 'Feestdagen in',
      metaWeek: (w, y, s, e) => `Week ${w} van ${y} begint op ${s} en eindigt op ${e}.`,
      metaHome: 'Welke week is het? Bekijk het huidige weeknummer en blader door elke week van het jaar.',
    }
  },
  tr: {
    label: 'TR', name: 'Türkçe', hreflang: 'tr',
    countries: [{ code: 'TR', name: 'Türkiye', slug: 'turkiye' }],
    months: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
    monthsShort: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
    days: ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'],
    daysShort: ['Pt','Sa','Ça','Pe','Cu','Ct','Pz'],
    t: {
      currentWeek: 'Mevcut hafta',
      week: 'Hafta',
      weekOf: 'Hafta',
      calendar: 'Takvim',
      holidays: 'Resmi tatiller',
      holidaysThisWeek: 'Bu haftaki resmi tatiller',
      noHolidays: 'Bu hafta resmi tatil yok',
      browseWeeks: 'Haftalara göz at',
      weekAtAGlance: 'Bu hafta',
      weekOf52: '52 haftanın',
      yearDone: 'yıl tamamlandı',
      dayOfYear: 'yılın günü',
      daysRemaining: 'kalan gün',
      searchPlaceholder: 'Örn: hafta 25, 15 haziran...',
      searchHint: 'Hafta numarası veya tarih girin',
      calendarYear: 'Takvim',
      holidaysIn: 'Resmi tatiller:',
      metaWeek: (w, y, s, e) => `${y} yılının ${w}. haftası ${s} tarihinde başlar ve ${e} tarihinde sona erer.`,
      metaHome: 'Kaçıncı haftadayız? Mevcut hafta numarasını öğrenin ve yılın herhangi bir haftasına göz atın.',
    }
  },
  ro: {
    label: 'RO', name: 'Română', hreflang: 'ro',
    countries: [{ code: 'RO', name: 'România', slug: 'romania' }],
    months: ['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie'],
    monthsShort: ['ian','feb','mar','apr','mai','iun','iul','aug','sep','oct','nov','dec'],
    days: ['luni','marți','miercuri','joi','vineri','sâmbătă','duminică'],
    daysShort: ['Lu','Ma','Mi','Jo','Vi','Sâ','Du'],
    t: {
      currentWeek: 'Săptămâna curentă',
      week: 'Săptămâna',
      weekOf: 'Săptămâna',
      calendar: 'Calendar',
      holidays: 'Sărbători legale',
      holidaysThisWeek: 'Sărbători legale săptămâna aceasta',
      noHolidays: 'Nicio sărbătoare legală săptămâna aceasta',
      browseWeeks: 'Răsfoiți săptămânile',
      weekAtAGlance: 'Săptămâna aceasta',
      weekOf52: 'din 52 săptămâni',
      yearDone: 'din an parcurs',
      dayOfYear: 'zi din an',
      daysRemaining: 'zile rămase',
      searchPlaceholder: 'Ex: săptămâna 25, 15 iunie...',
      searchHint: 'Introduceți un număr de săptămână sau o dată',
      calendarYear: 'Calendar',
      holidaysIn: 'Sărbători în',
      metaWeek: (w, y, s, e) => `Săptămâna ${w} din ${y} începe pe ${s} și se termină pe ${e}.`,
      metaHome: 'Ce săptămână este? Aflați numărul săptămânii curente și navigați prin orice săptămână a anului.',
    }
  },
}

export const LANG_CODES = Object.keys(LANGS) as LangCode[]

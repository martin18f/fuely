import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import AdSenseUnit, { AD_SLOTS } from './components/AdSenseUnit';

const SITE_URL = 'https://fuely.martinsulak.dev';

export const SEO_LANDING_PAGES = {
  'cena-cesty-autom': {
    path: '/cena-cesty-autom',
    language: 'sk',
    title: 'Cena cesty autom - výpočet paliva, trasy a poplatkov | Fuely',
    description:
      'Vypočítajte cenu cesty autom podľa vzdialenosti, spotreby, ceny benzínu alebo nafty, zastávok, mýta a meny.',
    h1: 'Cena cesty autom',
    lead:
      'Najrýchlejší spôsob, ako zistiť rozpočet na trasu, je spojiť vzdialenosť, reálnu spotrebu auta a aktuálnu cenu paliva. Fuely k tomu pridáva zastávky, viac mien a možnosť zohľadniť mýto.',
    cta: 'Otvoriť kalkulačku ceny cesty',
    adLabel: 'Reklama',
    sections: [
      {
        heading: 'Ako sa počíta cena cesty',
        paragraphs: [
          'Pri aute so spotrebou v litroch na 100 km platí jednoduchý základ: vzdialenosť vydelíte stovkou, vynásobíte spotrebou a výsledné litre vynásobíte cenou paliva. Fuely tento výpočet robí priebežne pri každej zmene vstupov.',
          'Ak cestujete cez viac krajín, výsledok môžete prepnúť do inej meny. Pri dlhšej trase odporúčame pridať aj diaľničné poplatky alebo mýto, aby bol odhad bližšie realite.',
        ],
      },
      {
        heading: 'Prečo nestačí poznať len kilometre',
        paragraphs: [
          'Dve rovnako dlhé trasy nemusia stáť rovnako. Rozdiel robí spotreba pri diaľničnej rýchlosti, profil trasy, zápchy, zaťaženie auta, cena paliva a poplatky. Preto je praktickejšie rátať s rozsahom, nie s jediným centovo presným číslom.',
          'Fuely ukazuje presný matematický výpočet aj odhadovaný rozsah. Presný výpočet je dobrý na porovnanie možností, rozsah lepšie pripomína, že jazda v reálnom svete sa mení.',
        ],
      },
      {
        heading: 'Kedy sa kalkulačka hodí najviac',
        paragraphs: [
          'Najväčší zmysel má pri dovolenkách, pracovných cestách, rozpočítaní nákladov medzi posádkou a pri porovnaní benzínu, nafty alebo elektromobilu. Pri opakovanej trase si môžete odhadnúť aj mesačný alebo ročný rozpočet.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Ako vypočítam cenu cesty autom?',
        answer:
          'Zadajte vzdialenosť alebo vyberte štart a cieľ, doplňte spotrebu vozidla, cenu paliva a prípadné poplatky. Fuely vypočíta spotrebované palivo a odhad nákladov.',
      },
      {
        question: 'Mám použiť katalógovú alebo reálnu spotrebu?',
        answer:
          'Pre presnejší výsledok použite reálnu spotrebu z bežnej jazdy. Katalógová hodnota môže byť pri diaľnici, zime alebo naloženom aute príliš optimistická.',
      },
    ],
  },
  'vypocet-spotreby-paliva': {
    path: '/vypocet-spotreby-paliva',
    language: 'sk',
    title: 'Výpočet spotreby paliva - litre, cena a náklady | Fuely',
    description:
      'Praktický výpočet spotreby paliva v litroch, l/100 km, MPG a celkových nákladov na benzín alebo naftu.',
    h1: 'Výpočet spotreby paliva',
    lead:
      'Spotreba paliva rozhoduje o tom, koľko vás bude stáť každodenné jazdenie aj dlhá cesta. Fuely pomáha prepočítať litre, cenu paliva a vzdialenosť do jedného zrozumiteľného výsledku.',
    cta: 'Vypočítať spotrebu a náklady',
    adLabel: 'Reklama',
    sections: [
      {
        heading: 'Základný vzorec pre litre na 100 km',
        paragraphs: [
          'Ak poznáte spotrebu v l/100 km, spotrebované litre vypočítate ako vzdialenosť krát spotreba delené 100. Napríklad 350 km pri spotrebe 6,2 l/100 km znamená približne 21,7 litra paliva.',
          'Celkové náklady potom získate vynásobením spotrebovaných litrov cenou za liter. Fuely tento výpočet dopĺňa o menu, mýto a možnosť zadať trasu cez mapu.',
        ],
      },
      {
        heading: 'MPG a imperiálne jednotky',
        paragraphs: [
          'Ak používate míle a galóny, prepnutie jednotiek umožní počítať cez MPG. To je praktické pri autách zo zahraničia, amerických údajoch o spotrebe alebo pri cestovaní mimo Európy.',
          'Pri zmene jednotiek Fuely prepočítava spotrebu aj cenu paliva tak, aby výsledok ostal porovnateľný.',
        ],
      },
      {
        heading: 'Ako zlepšiť presnosť výpočtu',
        paragraphs: [
          'Najlepšie je použiť priemernú spotrebu z palubného počítača alebo z vlastného tankovania. Pri diaľnici, strešnom boxe, zime alebo plne naloženom aute pridajte rezervu.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Ako vypočítam spotrebované palivo?',
        answer:
          'Pri l/100 km vynásobte vzdialenosť spotrebou a výsledok vydeľte 100. Pri MPG vydelte počet míľ hodnotou MPG.',
      },
      {
        question: 'Vie Fuely počítať aj cenu za kilometer?',
        answer:
          'Fuely zobrazuje celkový odhad nákladov a údaje potrebné na odvodenie ceny za kilometer podľa vzdialenosti a výslednej ceny cesty.',
      },
    ],
  },
  'naklady-na-cestu-elektromobilom': {
    path: '/naklady-na-cestu-elektromobilom',
    language: 'sk',
    title: 'Náklady na cestu elektromobilom - výpočet kWh a ceny | Fuely',
    description:
      'Vypočítajte orientačné náklady na cestu elektromobilom podľa spotreby v kWh, ceny elektriny, trasy a meny.',
    h1: 'Náklady na cestu elektromobilom',
    lead:
      'Pri elektromobile nerozhodujú litre, ale spotreba v kWh a cena nabíjania. Fuely umožňuje prepnúť vozidlo na elektrické a počítať náklady na trasu podobne jednoducho ako pri benzíne alebo nafte.',
    cta: 'Vypočítať cenu jazdy elektromobilom',
    adLabel: 'Reklama',
    sections: [
      {
        heading: 'Ako sa počíta cena jazdy EV',
        paragraphs: [
          'Základ je rovnaký ako pri palive: vzdialenosť vydelená stovkou, vynásobená spotrebou v kWh/100 km a cenou za kWh. Výsledkom je orientačná cena elektriny na trasu.',
          'Pri zahraničnej ceste sa oplatí rátať s rozdielnou cenou domáceho, verejného AC a rýchleho DC nabíjania. Ak očakávate drahšie nabíjanie na diaľnici, použite vyššiu cenu za kWh.',
        ],
      },
      {
        heading: 'Prečo sa spotreba elektromobilu mení',
        paragraphs: [
          'Spotrebu EV výrazne ovplyvňuje rýchlosť, teplota, vietor, kúrenie, klimatizácia a výškový profil. Diaľnica môže stáť výrazne viac energie než mesto alebo okresné cesty.',
          'Pre plánovanie je preto užitočné počítať s rezervou a nebrať výsledok ako garantovanú cenu nabíjania.',
        ],
      },
      {
        heading: 'Porovnanie so spaľovacím autom',
        paragraphs: [
          'V tej istej kalkulačke môžete prepnúť medzi spaľovacím a elektrickým vozidlom. To pomáha pri rozhodovaní, či je pre konkrétnu trasu výhodnejší benzín, nafta alebo elektrina.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Ako vypočítam náklady na cestu elektromobilom?',
        answer:
          'Zadajte vzdialenosť, spotrebu v kWh/100 km alebo kWh/100 mi a cenu elektriny za kWh. Fuely vypočíta spotrebovanú energiu a cenu cesty.',
      },
      {
        question: 'Mám zadať domácu alebo verejnú cenu nabíjania?',
        answer:
          'Zadajte cenu, za ktorú budete naozaj nabíjať na danej trase. Pri kombinácii domáceho a verejného nabíjania použite odhadovaný priemer.',
      },
    ],
  },
  'fuel-cost-calculator': {
    path: '/fuel-cost-calculator',
    language: 'en',
    title: 'Fuel Cost Calculator with route, stops and EV costs | Fuely',
    description:
      'Estimate trip fuel cost from route distance, consumption, fuel price, tolls, stops, currency and electric vehicle energy use.',
    h1: 'Fuel cost calculator',
    lead:
      'Fuely estimates trip costs from distance, vehicle consumption and fuel or electricity price. It is built for route planning, stops, tolls, currency conversion and quick petrol, diesel or EV comparisons.',
    cta: 'Open the fuel cost calculator',
    adLabel: 'Advertisement',
    sections: [
      {
        heading: 'How the trip cost estimate works',
        paragraphs: [
          'For metric fuel consumption, the calculator multiplies distance by liters per 100 km and fuel price. For imperial units, it works with miles, gallons and MPG. Electric vehicles use kWh consumption and electricity price.',
          'The result is shown as an exact calculation and a practical estimated range, because real trips change with traffic, weather, route profile, speed and vehicle load.',
        ],
      },
      {
        heading: 'Route distance, stops and tolls',
        paragraphs: [
          'You can enter distance manually or select a start and destination with Google Maps. Optional stops update the total distance and travel time, which makes the estimate more useful for real trips than a simple distance-only calculator.',
          'Tolls and highway fees can be added to the calculation, and the result can be shown in multiple currencies including EUR and USD.',
        ],
      },
      {
        heading: 'Petrol, diesel and electric vehicles',
        paragraphs: [
          'Fuely supports combustion vehicles and EVs in the same interface, so you can compare fuel and charging costs before choosing a route or vehicle.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I calculate fuel cost for a trip?',
        answer:
          'Enter distance, vehicle consumption and fuel price. Fuely multiplies the energy used by the price and adds optional tolls or highway fees.',
      },
      {
        question: 'Can I estimate electric vehicle trip costs?',
        answer:
          'Yes. Switch to electric vehicle mode, enter kWh consumption and electricity price, and Fuely estimates the energy used and trip cost.',
      },
    ],
  },
};

export const SEO_LANDING_LINKS = Object.values(SEO_LANDING_PAGES).map(
  ({ path, h1, description, language }) => ({
    path,
    title: h1,
    description,
    language,
  })
);

function getAbsoluteUrl(path) {
  return `${SITE_URL}${path}`;
}

function SeoLandingPage({ pageKey }) {
  const page = SEO_LANDING_PAGES[pageKey];

  if (!page) return null;

  const pageUrl = getAbsoluteUrl(page.path);
  const relatedPages = SEO_LANDING_LINKS.filter(
    (link) => link.path !== page.path
  );
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.h1,
      description: page.description,
      inLanguage: page.language,
      mainEntityOfPage: pageUrl,
      author: {
        '@type': 'Organization',
        name: 'Fuely',
        url: SITE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Fuely',
        logo: {
          '@type': 'ImageObject',
          url: getAbsoluteUrl('/logo512.png'),
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Fuely',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.h1,
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <article className="contentPage seoContentPage">
      <Helmet>
        <html lang={page.language} />
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Fuely" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <h1>{page.h1}</h1>
      <p className="contentLead">{page.lead}</p>

      <p>
        <Link to="/" className="inlineCtaLink">
          {page.cta}
        </Link>
      </p>

      {page.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}

      <section>
        <h2>{page.language === 'sk' ? 'Časté otázky' : 'Frequently asked questions'}</h2>
        {page.faqs.map((faq) => (
          <React.Fragment key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </React.Fragment>
        ))}
      </section>

      <AdSenseUnit
        slot={AD_SLOTS.article}
        className="adSenseUnitArticle"
        label={page.adLabel}
      />

      <section className="relatedGuides">
        <h2>{page.language === 'sk' ? 'Súvisiace návody' : 'Related guides'}</h2>
        <div className="relatedGuideGrid">
          {relatedPages.map((link) => (
            <Link to={link.path} className="relatedGuideLink" key={link.path}>
              <span>{link.title}</span>
              <small>{link.description}</small>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}

export default SeoLandingPage;

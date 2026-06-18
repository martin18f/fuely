import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import AdSenseUnit, { AD_SLOTS } from './components/AdSenseUnit';
import { SEO_LANDING_LINKS } from './SeoLandingPage';

const PAGE_URL = 'https://fuely.martinsulak.dev/palivova-kalkulacka';

function PalivovaKalkulacka() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Palivová kalkulačka - ako vypočítať náklady na cestu',
      description:
        'Praktický návod, ako používať Fuely na výpočet nákladov na palivo, elektrinu a plánovanie trasy.',
      author: {
        '@type': 'Organization',
        name: 'Fuely',
      },
      mainEntityOfPage: PAGE_URL,
      inLanguage: 'sk',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Ako vypočítam cenu cesty autom?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Zadajte trasu, spotrebu vozidla a cenu paliva alebo elektriny. Fuely z toho vypočíta orientačný rozsah aj presný odhad nákladov.',
          },
        },
        {
          '@type': 'Question',
          name: 'Môžem pridať zastávky na trase?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Áno, medzi štart a cieľ môžete pridať viacero zastávok a Fuely prepočíta celú trasu automaticky.',
          },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Fuely',
          item: 'https://fuely.martinsulak.dev/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Palivová kalkulačka',
          item: PAGE_URL,
        },
      ],
    },
  ];

  return (
    <article className="contentPage seoContentPage">
      <Helmet>
        <title>Palivová kalkulačka - výpočet nákladov na cestu | Fuely</title>
        <meta
          name="description"
          content="Zistite, ako vypočítať cenu cesty autom alebo elektromobilom. Fuely pracuje s trasou, spotrebou, cenou paliva, zastávkami, menami a jednotkami."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content="Palivová kalkulačka - Fuely" />
        <meta
          property="og:description"
          content="Praktický návod na výpočet nákladov na cestu autom, vrátane paliva, elektriny, zastávok a trasy."
        />
        <meta property="og:url" content={PAGE_URL} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <h1>Palivová kalkulačka - výpočet nákladov na cestu</h1>
      <p>
        Fuely je jednoduchá palivová kalkulačka pre vodičov, ktorí chcú pred
        cestou vedieť, koľko ich bude stáť benzín, nafta alebo nabíjanie
        elektromobilu. Stačí zadať štart, cieľ, prípadné zastávky, spotrebu a
        cenu energie.
      </p>

      <h2>Čo Fuely počíta?</h2>
      <p>
        Aplikácia kombinuje vzdialenosť trasy z Google Maps, spotrebu vozidla,
        cenu paliva alebo elektriny, mýto a vybranú menu. Výsledkom je živý
        odhad nákladov, ktorý sa mení hneď po úprave vstupov.
      </p>
      <h3>Výpočet nákladov na benzín, naftu a elektrinu</h3>
      <p>
        Pri spaľovacom aute Fuely pracuje so spotrebou v litroch na 100 km alebo
        MPG. Pri elektromobile používa spotrebu v kWh a cenu elektriny. Vďaka
        tomu môžete porovnať, koľko stojí rovnaká vzdialenosť pri rôznych typoch
        vozidiel.
      </p>

      <h2>Kedy sa palivová kalkulačka hodí?</h2>
      <p>
        Najviac pomáha pri dovolenkách, pracovných cestách, zdieľaní nákladov
        medzi posádkou alebo porovnávaní trás. Pri ceste do zahraničia môžete
        prepnúť menu a jednotky, takže odhad zostane zrozumiteľný aj mimo
        Slovenska.
      </p>
      <h3>Štart, cieľ a zastávky na trase</h3>
      <p>
        Ak cesta nevedie priamo z bodu A do bodu B, môžete pridať medzizastávky.
        Palivová kalkulačka potom aktualizuje vzdialenosť, čas jazdy, spotrebu
        paliva alebo energie a výslednú cenu cesty.
      </p>

      <h2>Ako dosiahnuť presnejší výsledok?</h2>
      <p>
        Použite reálnu spotrebu svojho auta, vyberte aktuálnu cenu paliva a
        doplňte poplatky, ktoré na trase očakávate. Fuely stále poskytuje
        orientačný odhad, pretože premávka, počasie a štýl jazdy vedia výsledok
        zmeniť.
      </p>
      <h3>Praktické odporúčania pred cestou</h3>
      <p>
        Pri dlhšej trase si overte aktuálnu cenu paliva v krajinách, cez ktoré
        pôjdete, a pripočítajte diaľničné známky alebo mýto. Ak jazdíte plne
        naloženým autom, zadajte vyššiu reálnu spotrebu, aby bol odhad nákladov
        realistickejší.
      </p>

      <AdSenseUnit
        slot={AD_SLOTS.article}
        className="adSenseUnitArticle"
        label="Reklama"
      />

      <section className="relatedGuides">
        <h2>Súvisiace návody</h2>
        <div className="relatedGuideGrid">
          {SEO_LANDING_LINKS.filter((link) => link.language === 'sk').map(
            (link) => (
              <Link to={link.path} className="relatedGuideLink" key={link.path}>
                <span>{link.title}</span>
                <small>{link.description}</small>
              </Link>
            )
          )}
        </div>
      </section>

      <Link to="/">Späť na kalkulačku</Link>
    </article>
  );
}

export default PalivovaKalkulacka;

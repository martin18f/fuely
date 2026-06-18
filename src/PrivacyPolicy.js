// src/PrivacyPolicy.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Ochrana osobných údajov Fuely - súkromie, analytika a reklamy</title>
        <meta
          name="description"
          content="Zásady ochrany osobných údajov Fuely opisujú spracovanie dát pri kalkulačke, mapách, analytike, reklamách, kontakte, hodnotení a lokálnom úložisku."
        />
        <link rel="canonical" href="https://fuely.martinsulak.dev/privacy-policy" />
      </Helmet>

    <div className="contentPage privacy-policy-container">
      <h1>{t('privacyPolicyTitle', 'Zásady ochrany osobných údajov')}</h1>
      <p>
        Tieto zásady vysvetľujú, aké údaje môže Fuely spracúvať pri používaní palivovej
        kalkulačky, mapy, kontaktného formulára, analytiky, reklamy a hodnotenia aplikácie.
      </p>

      <h2>1. Údaje potrebné pre fungovanie aplikácie</h2>
      <p>
        Pri výpočte trasy zadávate štart, cieľ, spotrebu, cenu paliva, menu a ďalšie údaje
        potrebné na výpočet. Väčšina týchto údajov sa spracúva v prehliadači. Miesta a trasy
        sa odosielajú službe Google Maps, aby bolo možné zobraziť mapu, autocomplete a trasu.
      </p>
      <h3>Výpočet nákladov a lokálne spracovanie</h3>
      <p>
        Hodnoty ako spotreba, cena paliva, mýto, zvolená mena a typ vozidla slúžia na samotný
        výpočet nákladov. Fuely ich používa na zobrazenie výsledku, odhadu spotrebovaného paliva
        alebo energie a orientačného cestovného rozpočtu.
      </p>

      <h2>2. Kontaktný formulár</h2>
      <p>
        Ak použijete kontaktný formulár, spracujeme meno, e-mail a správu, ktorú odošlete.
        Formulár je odosielaný cez službu EmailJS na účely odpovede a riešenia spätnej väzby.
      </p>
      <h3>Účel kontaktu</h3>
      <p>
        Kontaktné údaje používame iba na odpoveď na otázku, riešenie nahlásenej chyby alebo
        zapracovanie spätnej väzby k funkciám palivovej kalkulačky.
      </p>

      <h2>3. Analytika a hodnotenie</h2>
      <p>
        Analytické a reklamné consent signály pre Google Tag Manager, Microsoft Clarity,
        Vercel Analytics, Vercel Speed Insights a Google AdSense povoľujeme až po prijatí
        cookies. Hodnotiaci formulár sa tiež zobrazí až po súhlase a môže odoslať hodnotenie,
        komentár, dátum, typ zariadenia a jazykové nastavenie cez náš serverový API endpoint
        do Google Apps Script / Google Sheets.
      </p>
      <h3>Dobrovoľná spätná väzba</h3>
      <p>
        Hodnotenie aplikácie je dobrovoľné. Pomáha zistiť, či je výpočet vzdialenosti, cena
        paliva, práca so zastávkami a výsledný odhad pre používateľov zrozumiteľný.
      </p>

      <h2>4. Lokálne úložisko</h2>
      <p>
        Po súhlase môžeme v localStorage uložiť preferencie aplikácie, napríklad jednotky,
        menu, vybrané vozidlo, zadané miesta alebo informáciu o poslednom hodnotení. Pri
        zamietnutí cookies sa tieto údaje neukladajú trvalo.
      </p>
      <h3>Kontrola nad uloženými údajmi</h3>
      <p>
        Preferencie uložené v prehliadači môžete odstrániť resetom cookies v aplikácii alebo
        vymazaním dát stránky v nastaveniach prehliadača.
      </p>

      <h2>5. Tretie strany</h2>
      <p>
        Pri používaní aplikácie môžu byť zapojené služby Google Maps, Google Tag Manager,
        Microsoft Clarity, Vercel Analytics, Vercel Speed Insights, Google AdSense, EmailJS
        a Google Apps Script. Tieto služby spracúvajú údaje podľa vlastných pravidiel ochrany
        súkromia.
      </p>

      <h2>6. Vaše práva</h2>
      <p>
        Môžete nás požiadať o informácie o spracúvaní, opravu, vymazanie alebo obmedzenie
        spracúvania údajov, ak sa na danú situáciu tieto práva vzťahujú.
      </p>

      <h2>7. Kontakt</h2>
      <p>
        V prípade otázok k ochrane osobných údajov nás kontaktujte cez{' '}
        <Link to="/">kontaktný formulár na úvodnej stránke</Link>.
      </p>

      <p>
        <em>{t('privacyPolicyUpdated', 'Posledná aktualizácia: 17.05.2026')}</em>
      </p>
    </div>
    </>
  );
};

export default PrivacyPolicy;

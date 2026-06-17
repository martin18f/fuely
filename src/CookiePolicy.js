// src/CookiePolicy.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { resetCookieConsent } from './components/cookieConsent';

const CookiePolicy = () => {
  const { t } = useTranslation();

  const handleResetConsent = () => {
    resetCookieConsent();
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>Cookie Policy Fuely - cookies, analytika a pravidlá súhlasu</title>
        <meta
          name="description"
          content="Cookie Policy Fuely vysvetľuje nevyhnutné lokálne úložisko, Google Maps, analytiku, hodnotenie aplikácie a spôsob zmeny súhlasu."
        />
        <link rel="canonical" href="https://fuely.martinsulak.dev/cookie-policy" />
      </Helmet>

    <div className="contentPage cookie-policy-container">
      <h1>{t('cookiePolicyTitle', 'Cookie Policy')}</h1>
      <p>
        Táto stránka používa nevyhnutné lokálne úložisko pre uloženie vášho rozhodnutia
        o cookies a voliteľné analytické služby iba po vašom súhlase.
      </p>

      <p>
        <strong>Posledná aktualizácia:</strong> 17.05.2026
      </p>

      <h2>1. Čo ukladáme vždy</h2>
      <p>
        Hodnotu <strong>cookieConsent</strong> ukladáme v localStorage, aby sme si zapamätali,
        či ste cookies prijali alebo zamietli. Toto považujeme za nevyhnutnú preferenciu.
      </p>
      <h3>Prečo je táto hodnota nevyhnutná?</h3>
      <p>
        Bez uloženia tejto preferencie by sa banner zobrazoval pri každej návšteve. Fuely tým
        nezískava marketingový profil používateľa, iba si pamätá rozhodnutie o súhlase.
      </p>

      <h2>2. Funkčné služby</h2>
      <p>
        Fuely používa Google Maps JavaScript API a Places Autocomplete na vyhľadanie miest,
        zobrazenie mapy a výpočet trasy. Tieto služby sú súčasťou hlavnej funkcie aplikácie.
        Pri ich používaní môže Google spracovať technické údaje, IP adresu a zadané miesta.
      </p>
      <h3>Vyhľadávanie štartu, cieľa a zastávok</h3>
      <p>
        Keď zadáte štart, cieľ alebo zastávku, vyhľadávanie miest pomáha nájsť presnú adresu a
        súradnice. Vďaka tomu palivová kalkulačka dokáže vypočítať vzdialenosť, čas jazdy a
        náklady na cestu presnejšie než pri ručnom zadávaní kilometrov.
      </p>

      <h2>3. Voliteľná analytika a spätná väzba</h2>
      <p>
        Po kliknutí na „Prijať” môžeme spustiť Google Tag Manager, Microsoft Clarity,
        Vercel Analytics, Vercel Speed Insights a hodnotiaci formulár. Hodnotenie sa odosiela
        cez serverový endpoint Fuely do Google Sheets. Tieto služby pomáhajú merať návštevnosť,
        výkon a kvalitu aplikácie.
      </p>
      <p>
        Ak kliknete na „Zamietnuť”, tieto analytické a spätnoväzbové služby nespúšťame.
      </p>
      <h3>Aké analytické nástroje môžu byť aktivované?</h3>
      <p>
        Po súhlase môže stránka spustiť Google Tag Manager, Microsoft Clarity, Vercel Analytics
        a Vercel Speed Insights. Tieto nástroje používame na meranie výkonu, odhalenie chýb v
        rozhraní a pochopenie, ktoré časti kalkulačky sú pre návštevníkov najužitočnejšie.
      </p>

      <h2>4. Nastavenia aplikácie</h2>
      <p>
        Po prijatí súhlasu si aplikácia môže uložiť vaše nastavenia kalkulačky, napríklad
        jednotky, menu, vybrané vozidlo alebo naposledy zadané miesta. Po zamietnutí sa tieto
        údaje neukladajú trvalo.
      </p>
      <h3>Nastavenia, ktoré zlepšujú používanie kalkulačky</h3>
      <p>
        Uložené jednotky, mena, spotreba alebo typ vozidla šetria čas pri ďalšom výpočte.
        Používateľ ich môže kedykoľvek zmeniť resetom formulára alebo vymazaním dát stránky v
        prehliadači.
      </p>

      <h2>5. Ako zmeniť rozhodnutie</h2>
      <p>
        Súhlas môžete zmeniť vymazaním dát stránky v nastaveniach prehliadača alebo tlačidlom
        nižšie. Po obnovení stránky sa banner zobrazí znova.
      </p>
      <button type="button" className="accept" onClick={handleResetConsent}>
        Zmeniť nastavenia cookies
      </button>

      <h2>6. Kontakt</h2>
      <p>
        Otázky k používaniu cookies nám môžete poslať cez{' '}
        <Link to="/">kontaktný formulár na úvodnej stránke</Link>.
      </p>
    </div>
    </>
  );
};

export default CookiePolicy;

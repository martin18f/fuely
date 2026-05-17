// src/CookiePolicy.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { resetCookieConsent } from './components/cookieConsent';

const CookiePolicy = () => {
  const { t } = useTranslation();

  const handleResetConsent = () => {
    resetCookieConsent();
    window.location.reload();
  };

  return (
    <div className="cookie-policy-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
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

      <h2>2. Funkčné služby</h2>
      <p>
        Fuely používa Google Maps JavaScript API a Places Autocomplete na vyhľadanie miest,
        zobrazenie mapy a výpočet trasy. Tieto služby sú súčasťou hlavnej funkcie aplikácie.
        Pri ich používaní môže Google spracovať technické údaje, IP adresu a zadané miesta.
      </p>

      <h2>3. Voliteľná analytika a spätná väzba</h2>
      <p>
        Po kliknutí na „Prijať” môžeme spustiť Google Tag Manager, Microsoft Clarity,
        Vercel Analytics, Vercel Speed Insights a hodnotiaci formulár. Tieto služby pomáhajú
        merať návštevnosť, výkon a kvalitu aplikácie.
      </p>
      <p>
        Ak kliknete na „Zamietnuť”, tieto analytické a spätnoväzbové služby nespúšťame.
      </p>

      <h2>4. Nastavenia aplikácie</h2>
      <p>
        Po prijatí súhlasu si aplikácia môže uložiť vaše nastavenia kalkulačky, napríklad
        jednotky, menu, vybrané vozidlo alebo naposledy zadané miesta. Po zamietnutí sa tieto
        údaje neukladajú trvalo.
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
        Otázky k používaniu cookies nám môžete poslať na:{' '}
        <a href="mailto:dsnextgen.eu@gmail.com">dsnextgen.eu@gmail.com</a>
      </p>
    </div>
  );
};

export default CookiePolicy;

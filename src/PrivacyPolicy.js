// src/PrivacyPolicy.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div
      className="privacy-policy-container"
      style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}
    >
      <h1>{t('privacyPolicyTitle', 'Zásady ochrany osobných údajov')}</h1>
      <p>
        Tieto zásady vysvetľujú, aké údaje môže Fuely spracúvať pri používaní palivovej
        kalkulačky, mapy, kontaktného formulára, analytiky a hodnotenia aplikácie.
      </p>

      <h2>1. Údaje potrebné pre fungovanie aplikácie</h2>
      <p>
        Pri výpočte trasy zadávate štart, cieľ, spotrebu, cenu paliva, menu a ďalšie údaje
        potrebné na výpočet. Väčšina týchto údajov sa spracúva v prehliadači. Miesta a trasy
        sa odosielajú službe Google Maps, aby bolo možné zobraziť mapu, autocomplete a trasu.
      </p>

      <h2>2. Kontaktný formulár</h2>
      <p>
        Ak použijete kontaktný formulár, spracujeme meno, e-mail a správu, ktorú odošlete.
        Formulár je odosielaný cez službu EmailJS na účely odpovede a riešenia spätnej väzby.
      </p>

      <h2>3. Analytika a hodnotenie</h2>
      <p>
        Analytické služby Google Tag Manager, Microsoft Clarity, Vercel Analytics a Vercel
        Speed Insights spúšťame až po prijatí cookies. Hodnotiaci formulár sa tiež zobrazí
        až po súhlase a môže odoslať hodnotenie, komentár, dátum, typ zariadenia a jazykové
        nastavenie do Google Apps Script.
      </p>

      <h2>4. Lokálne úložisko</h2>
      <p>
        Po súhlase môžeme v localStorage uložiť preferencie aplikácie, napríklad jednotky,
        menu, vybrané vozidlo, zadané miesta alebo informáciu o poslednom hodnotení. Pri
        zamietnutí cookies sa tieto údaje neukladajú trvalo.
      </p>

      <h2>5. Tretie strany</h2>
      <p>
        Pri používaní aplikácie môžu byť zapojené služby Google Maps, Google Tag Manager,
        Microsoft Clarity, Vercel Analytics, Vercel Speed Insights, EmailJS a Google Apps
        Script. Tieto služby spracúvajú údaje podľa vlastných pravidiel ochrany súkromia.
      </p>

      <h2>6. Vaše práva</h2>
      <p>
        Môžete nás požiadať o informácie o spracúvaní, opravu, vymazanie alebo obmedzenie
        spracúvania údajov, ak sa na danú situáciu tieto práva vzťahujú.
      </p>

      <h2>7. Kontakt</h2>
      <p>
        V prípade otázok k ochrane osobných údajov nás kontaktujte na:{' '}
        <a href="mailto:dsnextgen.eu@gmail.com">dsnextgen.eu@gmail.com</a>
      </p>

      <p>
        <em>{t('privacyPolicyUpdated', 'Posledná aktualizácia: 17.05.2026')}</em>
      </p>
    </div>
  );
};

export default PrivacyPolicy;

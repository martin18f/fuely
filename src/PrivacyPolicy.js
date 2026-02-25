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
        {t(
          'privacyPolicyIntro',
          `Tieto zásady ochrany osobných údajov (ďalej len "zásady") popisujú, ako zhromažďujeme, používame a chránime vaše osobné údaje. Použitím tejto webovej stránky súhlasíte so spracovaním vašich údajov podľa týchto zásad.`
        )}
      </p>

      <h2>{t('privacyPolicyCollectionTitle', '1. Zhromažďovanie údajov')}</h2>
      <p>
        {t(
          'privacyPolicyCollectionContent',
          `Zhromažďujeme osobné údaje, ktoré nám poskytnete prostredníctvom registrácie, objednávok alebo kontaktných formulárov. Medzi tieto údaje môžu patriť vaše meno, e-mailová adresa, telefónne číslo a ďalšie informácie, ktoré sú potrebné na poskytovanie našich služieb.`
        )}
      </p>

      <h2>{t('privacyPolicyUsageTitle', '2. Používanie údajov')}</h2>
      <p>
        {t(
          'privacyPolicyUsageContent',
          `Vaše údaje používame na spracovanie objednávok, komunikáciu s vami, poskytovanie zákazníckej podpory a zlepšovanie našich služieb. Vaše informácie môžeme tiež využiť na marketingové účely, pokiaľ ste nám dali na to súhlas.`
        )}
      </p>

      <h2>{t('privacyPolicyProtectionTitle', '3. Ochrana údajov')}</h2>
      <p>
        {t(
          'privacyPolicyProtectionContent',
          `Zavádzame prísne bezpečnostné opatrenia, aby sme zabezpečili, že vaše osobné údaje sú chránené pred neoprávneným prístupom, zverejnením alebo zneužitím.`
        )}
      </p>

      <h2>{t('privacyPolicyRightsTitle', '4. Vaše práva')}</h2>
      <p>
        {t(
          'privacyPolicyRightsContent',
          `Máte právo na prístup k vašim osobným údajom, ich opravu alebo vymazanie. Ak máte akékoľvek otázky ohľadom spracovania vašich údajov, neváhajte nás kontaktovať.`
        )}
      </p>

      <h2>{t('privacyPolicyContactTitle', '5. Kontakt')}</h2>
      <p>
        {t(
          'privacyPolicyContactContent',
          `V prípade akýchkoľvek otázok alebo pripomienok ohľadom našich zásad ochrany osobných údajov nás kontaktujte na:`
        )}{' '}
        <a href="mailto:dsnextgen.eu@gmail.com">dsnextgen.eu@gmail.com</a>
      </p>

      <p>
        <em>{t('privacyPolicyUpdated', 'Posledná aktualizácia: 10.02.2025')}</em>
      </p>
    </div>
  );
};

export default PrivacyPolicy;

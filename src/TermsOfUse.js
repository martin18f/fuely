// src/TermsOfUse.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Podmienky používania Fuely - pravidlá palivovej kalkulačky</title>
        <meta
          name="description"
          content="Podmienky používania Fuely vysvetľujú pravidlá palivovej kalkulačky, odhad nákladov, externé služby, zodpovednosť používateľa a súkromie."
        />
        <link rel="canonical" href="https://fuely.martinsulak.dev/terms-of-use" />
      </Helmet>

      <div className="contentPage terms-of-use-container">
        <h1>{t('termsOfUseTitle', 'Podmienky používania')}</h1>

        <p>
          Používaním webovej aplikácie Fuely súhlasíte s týmito podmienkami. Ak s nimi
          nesúhlasíte, aplikáciu nepoužívajte.
        </p>

        <h2>1. Účel služby</h2>
        <p>
          Fuely slúži na orientačný výpočet nákladov na cestu podľa zadanej trasy, spotreby,
          ceny paliva alebo elektriny a meny. Výsledky sú odhady a nemusia zodpovedať skutočným
          nákladom.
        </p>
        <h3>Palivová kalkulačka a cestovný rozpočet</h3>
        <p>
          Aplikácia má pomôcť s plánovaním výdavkov na benzín, naftu alebo nabíjanie
          elektromobilu. Výsledok používajte ako praktickú orientáciu, nie ako garantovanú cenu.
        </p>

        <h2>2. Presnosť údajov</h2>
        <p>
          Výpočet závisí od údajov, ktoré zadáte, od dostupnosti Google Maps a od externých
          kurzových alebo dátových zdrojov. Fuely nezaručuje nepretržitú dostupnosť ani úplnú
          presnosť výsledkov.
        </p>
        <h3>Čo môže ovplyvniť výsledok?</h3>
        <p>
          Reálnu cenu cesty ovplyvňuje premávka, rýchlosť, počasie, profil trasy, hmotnosť auta,
          štýl jazdy, presnosť zadanej spotreby a aktuálna cena paliva alebo elektriny.
        </p>

        <h2>3. Zodpovednosť používateľa</h2>
        <p>
          Trasu, dopravné obmedzenia, ceny paliva, poplatky, bezpečnosť jazdy a právne povinnosti
          si vždy overte pred cestou. Fuely nenahrádza navigáciu, dopravné pokyny ani odborné
          poradenstvo.
        </p>
        <h3>Bezpečnosť a overenie trasy</h3>
        <p>
          Pred odchodom skontrolujte aktuálne dopravné informácie, uzávierky, mýto a pravidlá
          krajín, cez ktoré cestujete. Navigácia alebo mapa môže obsahovať zmeny mimo kontroly
          aplikácie Fuely.
        </p>

        <h2>4. Externé služby</h2>
        <p>
          Aplikácia využíva externé služby, najmä Google Maps, EmailJS, analytické nástroje a
          technické hostingové služby. Ich dostupnosť a spracovanie údajov sa riadia aj pravidlami
          týchto poskytovateľov.
        </p>

        <h2>5. Ochrana osobných údajov a cookies</h2>
        <p>
          Informácie o spracúvaní údajov a cookies nájdete v zásadách ochrany osobných údajov
          a v Cookie Policy. Analytické služby spúšťame až po prijatí cookies.
        </p>

        <h2>6. Autorské práva</h2>
        <p>
          Texty, dizajn, rozhranie a ďalší obsah aplikácie sú chránené právnymi predpismi.
          Bez súhlasu ich nemožno kopírovať, upravovať ani ďalej šíriť mimo bežného používania
          aplikácie.
        </p>

        <h2>7. Zmeny podmienok</h2>
        <p>
          Tieto podmienky môžeme aktualizovať. Aktuálna verzia bude vždy zverejnená na tejto
          stránke.
        </p>

        <h2>8. Kontakt</h2>
        <p>
          Otázky k podmienkam používania môžete poslať cez{' '}
          <Link to="/">kontaktný formulár na úvodnej stránke</Link>.
        </p>

        <p>
          <em>{t('termsOfUseUpdated', 'Posledná aktualizácia: 17.05.2026')}</em>
        </p>
      </div>
    </>
  );
};

export default TermsOfUse;

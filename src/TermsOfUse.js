// src/TermsOfUse.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';


const TermsOfUse = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* SEO meta tagy špecifické pre /terms-of-use */}
      <Helmet>
        <title>Fuely – Terms of Use (Podmienky používania)</title>
        <meta
          name="description"
          content="Oficiálne podmienky používania služby Fuely. Nájdete tu info o zodpovednosti, ochrane súkromia a ďalšie právne náležitosti pre používateľov Fuely.sk."
        />
        <link rel="canonical" href="https://fuely.sk/terms-of-use" />
      </Helmet>

      <div
        className="terms-of-use-container"
        style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}
      >
        <h1>{t('termsOfUseTitle', 'Podmienky používania')}</h1>

        <p>
          {t(
            'termsOfUseIntroduction',
            `Tieto podmienky používania (ďalej len "podmienky") upravujú prístup a používanie tejto webovej stránky. Použitím tejto stránky súhlasíte s dodržiavaním týchto podmienok.`
          )}
        </p>

        <h2>1. Prístup k stránke</h2>
        <p>
          {t(
            'termsOfUseAccess',
            `Používateľ má právo prístupu k informáciám a obsahu tejto stránky, avšak tento prístup je podmienený dodržiavaním týchto podmienok.`
          )}
        </p>

        <h2>2. Zodpovednosť</h2>
        <p>
          {t(
            'termsOfUseLiability',
            `Prevádzkovateľ webovej stránky nenesie zodpovednosť za škody, ktoré môžu vzniknúť v dôsledku použitia alebo nemožnosti použitia informácií a služieb poskytovaných touto stránkou.`
          )}
        </p>

        <h2>3. Ochrana osobných údajov</h2>
        <p>
          {t(
            'termsOfUsePrivacy',
            `Informácie o spracúvaní a ochrane osobných údajov nájdete v našej Zásade ochrany osobných údajov, ktorá je neoddeliteľnou súčasťou týchto podmienok.`
          )}
        </p>

        <h2>4. Autorské práva</h2>
        <p>
          {t(
            'termsOfUseCopyright',
            `Všetok obsah, dizajn a texty na tejto stránke sú chránené autorskými právami a inými právnymi predpismi. Akékoľvek neoprávnené kopírovanie, šírenie alebo iné použitie je prísne zakázané.`
          )}
        </p>

        <h2>5. Zmeny podmienok</h2>
        <p>
          {t(
            'termsOfUseChanges',
            `Prevádzkovateľ si vyhradzuje právo kedykoľvek meniť tieto podmienky. Aktuálna verzia podmienok bude vždy zverejnená na tejto stránke.`
          )}
        </p>

        <h2>6. Kontakt</h2>
        <p>
          {t(
            'termsOfUseContact',
            `Ak máte akékoľvek otázky alebo pripomienky k týmto podmienkam používania, neváhajte nás kontaktovať na:`
          )}{' '}
          <a href="mailto:dsnextgen.eu@gmail.com">dsnextgen.eu@gmail.com</a>
        </p>

        <p>
          <em>
            {t('termsOfUseUpdated', 'Posledná aktualizácia: 10.02.2025')}
          </em>
        </p>
      </div>
    </>
  );
};

export default TermsOfUse;

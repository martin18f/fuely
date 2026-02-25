// src/CookiePolicy.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const CookiePolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="cookie-policy-container">
      <h1>{t('cookiePolicyTitle', 'Cookie Policy')}</h1>
      <p>
        {t(
          'cookiePolicyContent',
          `Táto stránka používa cookies, aby vám poskytla lepší zážitok. 
          Cookies sú malé textové súbory uložené vo vašom prehliadači. 
          Používame ich na zabezpečenie základnej funkčnosti stránky, 
          analytiku a marketingové účely. Pre viac informácií si prečítajte našu 
          zásadu ochrany osobných údajov.`
        )}
      </p>

      <hr />

      <p>
        <strong>Posledná aktualizácia:</strong> 10.02.2025
      </p>

      <h2>1. Čo sú cookies?</h2>
      <p>
        Cookies sú malé textové súbory, ktoré sa uložia vo vašom prehliadači, keď navštívite webovú stránku. Pomáhajú webovým stránkam zapamätať si informácie o vašej návšteve, čo zlepšuje vašu skúsenosť (napríklad tým, že si pamätajú vaše preferencie alebo prihlásenie).
      </p>

      <h2>2. Ako používame cookies</h2>
      <p>
        Na našej stránke <strong>fuely.sk</strong> používame cookies z nasledujúcich dôvodov:
      </p>
      <ul>
        <li>
          <strong>Základná funkčnosť:</strong> Umožňujú nám zabezpečiť, že stránka funguje správne. Patria sem cookies, ktoré pamätajú, či ste prihlásení, a udržiavajú vaše nastavenia.
        </li>
        <li>
          <strong>Analytika a štatistiky:</strong> Pomocou cookies sledujeme, ako návštevníci používajú našu stránku, čo nám pomáha vylepšiť obsah a funkcionalitu. Tieto údaje sú anonymné.
        </li>
        <li>
          <strong>Marketing a personalizácia:</strong> V niektorých prípadoch môžeme používať cookies na zlepšenie reklám a zobrazenie relevantného obsahu. Tieto cookies môžu byť nastavené aj tretími stranami.
        </li>
      </ul>

      <h2>3. Typy používaných cookies</h2>
      <ul>
        <li>
          <strong>Reliačné (Session) cookies:</strong> Dočasné cookies, ktoré sa vymažú po zatvorení prehliadača.
        </li>
        <li>
          <strong>Trvalé cookies:</strong> Cookies, ktoré zostanú uložené vo vašom zariadení aj po zatvorení prehliadača a pomáhajú nám zapamätať si vaše preferencie pri ďalších návštevách.
        </li>
        <li>
          <strong>Prvé strany a tretie strany:</strong> Niektoré cookies nastavujeme my priamo (prvé strany), zatiaľ čo iné môžu byť nastavené našimi partnermi (tretie strany).
        </li>
      </ul>

      <h2>4. Tretie strany</h2>
      <p>
        Niektoré služby, ktoré používame (napríklad analytické nástroje a sociálne siete), môžu tiež používať vlastné cookies. Tieto cookies sú spravované príslušnými spoločnosťami. Pre viac informácií o ich zásadách ochrany osobných údajov odporúčame navštíviť ich webové stránky.
      </p>

      <h2>5. Ako spravovať a odstrániť cookies</h2>
      <p>
        Väčšina moderných prehliadačov umožňuje nastaviť, ako chcete s cookies zaobchádzať – môžete ich blokovať, odstrániť alebo upozorniť, keď sa cookie ukladá. Viac informácií nájdete v nastaveniach vášho prehliadača. Majte však na pamäti, že zablokovanie cookies môže ovplyvniť funkčnosť niektorých častí našej stránky.
      </p>

      <h2>6. Zmeny v Cookie Policy</h2>
      <p>
        Táto Cookie Policy môže byť časom aktualizovaná. Odporúčame vám pravidelne kontrolovať túto stránku, aby ste boli informovaní o prípadných zmenách.
      </p>

      <h2>7. Kontakt</h2>
      <p>
        Ak máte akékoľvek otázky alebo pripomienky k tejto Cookie Policy, neváhajte nás kontaktovať na adrese: <a href="mailto:dsnextgen.eu@gmail.com">dsnextgen.eu@gmail.com</a>
      </p>
    </div>
  );
};

export default CookiePolicy;

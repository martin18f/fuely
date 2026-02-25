import React from 'react';
import './CurrencySwitcher.css';

function CurrencySwitcher({ selectedCurrency, setSelectedCurrency }) {
  return (
    <div className="container">
      <div className="tabs">
        <input
          type="radio"
          id="radio-1"
          name="currency"
          value="eur"
          checked={selectedCurrency === 'eur'}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        />
        <label className="tab" htmlFor="radio-1">EUR</label>

        <input
          type="radio"
          id="radio-2"
          name="currency"
          value="usd"
          checked={selectedCurrency === 'usd'}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        />
        <label className="tab" htmlFor="radio-2">USD</label>

        <input
          type="radio"
          id="radio-3"
          name="currency"
          value="gbp"
          checked={selectedCurrency === 'gbp'}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        />
        <label className="tab" htmlFor="radio-3">GBP</label>

        <input
          type="radio"
          id="radio-4"
          name="currency"
          value="czk"
          checked={selectedCurrency === 'czk'}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        />
        <label className="tab" htmlFor="radio-4">CZK</label>

        <input
          type="radio"
          id="radio-5"
          name="currency"
          value="jpy"
          checked={selectedCurrency === 'jpy'}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        />
        <label className="tab" htmlFor="radio-5">JPY</label>

        <input
          type="radio"
          id="radio-6"
          name="currency"
          value="aud"
          checked={selectedCurrency === 'aud'}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        />
        <label className="tab" htmlFor="radio-6">AUD</label>

        <input
          type="radio"
          id="radio-7"
          name="currency"
          value="cad"
          checked={selectedCurrency === 'cad'}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        />
        <label className="tab" htmlFor="radio-7">CAD</label>

        <input
          type="radio"
          id="radio-8"
          name="currency"
          value="chf"
          checked={selectedCurrency === 'chf'}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        />
        <label className="tab" htmlFor="radio-8">CHF</label>

        {/* Posuvný prvok (glider), ktorý sa presúva pod vybranú záložku */}
        <div className="glider"></div>
      </div>
    </div>
  );
}

export default CurrencySwitcher;



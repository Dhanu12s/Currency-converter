// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  // Custom CSS

const App = () => {
  const [countries, setCountries] = useState([]);  // Store fetched countries
  const [fromCurrency, setFromCurrency] = useState('');  // Selected base currency
  const [toCurrency, setToCurrency] = useState('');  // Selected target currency
  const [amount, setAmount] = useState(1);  // Amount to convert
  const [convertedAmount, setConvertedAmount] = useState(null);  // Result of conversion
  const [searchQueryFrom, setSearchQueryFrom] = useState('');  // For searching base country
  const [searchQueryTo, setSearchQueryTo] = useState('');  // For searching target country

  // Fetch country and currency data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get('https://restcountries.com/v3.1/all');
        const countryData = res.data
          .map((country) => ({
            name: country.name.common,
            currency: country.currencies ? Object.keys(country.currencies)[0] : null,
          }))
          .filter(country => country.currency !== null); // Filter out countries without currency data
        setCountries(countryData);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };
    fetchCountries();
  }, []);

  // Convert currency on form submission
  const handleConvert = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const rate = res.data.rates[toCurrency];
      setConvertedAmount((amount * rate).toFixed(2));
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  // Filter countries based on search query and sort alphabetically
  const filterAndSortCountries = (query) => {
    return countries
      .filter(country =>
        country.name.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));  // Sort alphabetically
  };

  const filteredCountriesFrom = filterAndSortCountries(searchQueryFrom);
  const filteredCountriesTo = filterAndSortCountries(searchQueryTo);

  return (
    <div className="converter-container">
      <h1>Currency Converter</h1>
      <form onSubmit={handleConvert}>
        {/* From Currency */}
        <div className="input-group">
          <label>Select Base Currency:</label>
         
          <select onChange={(e) => setFromCurrency(e.target.value)} required>
            <option value="">Select Country</option>
            {filteredCountriesFrom.map((country, index) => (
              <option key={index} value={country.currency}>
                {country.name} ({country.currency})
              </option>
            ))}
          </select>
        </div>

        {/* To Currency */}
        <div className="input-group">
          <label>Convert To:</label>
          
          <select onChange={(e) => setToCurrency(e.target.value)} required>
            <option value="">Select Country</option>
            {filteredCountriesTo.map((country, index) => (
              <option key={index} value={country.currency}>
                {country.name} ({country.currency})
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="input-group">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <button type="submit">Convert</button>
      </form>

      {convertedAmount && (
        <div className="result">
          <h3>Converted Amount: {convertedAmount} {toCurrency}</h3>
        </div>
      )}
    </div>
  );
};

export default App;

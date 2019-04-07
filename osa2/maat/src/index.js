import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';

const CountryList = ({ countries, setFilter }) => {
  return (
    <div>
      {countries.map(country => (
        <div key={country.name}>
          {country.name}
          <button
            onClick={() => {
              setFilter(country.name);
            }}
          >
            show
          </button>
        </div>
      ))}
    </div>
  );
};

const Weather = ({ country }) => {
  const [weather, setWeather] = useState({ condition: {} });

  const apiUrl = `http://api.apixu.com/v1/current.json?key=548ba5ec922a4ea191f212520190704&q=${
    country.name
  }`;

  useEffect(() => {
    axios.get(apiUrl).then(res => {
      console.log('weather promise fulfilled', res.data);
      setWeather(res.data.current);
    });
  }, []);

  return (
    <div>
      <div>
        <b>temperature:</b> {weather.temp_c} Celsius
      </div>
      <img src={weather.condition.icon} alt={weather.condition.text} />
      <div>
        <b>wind:</b> {weather.wind_kph} direction {weather.wind_dir}
      </div>
    </div>
  );
};

const CountryDetails = ({ country }) => {
  const { name, nativeName, capital, population, flag, languages } = country;

  return (
    <div>
      <h2>
        {name} / {nativeName}
      </h2>
      <div>capital: {capital}</div>
      <div>population: {population}</div>
      <h3>languages</h3>
      <ul>
        {languages.map(l => (
          <li key={l.name}>{l.name}</li>
        ))}
      </ul>
      <img width="384" height="256" src={flag} alt={name} />

      <Weather country={country} />
    </div>
  );
};

const FilteredCountries = ({ countries, filter, setFilter }) => {
  let countriesToShow = countries.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  console.log(countriesToShow);

  if (countriesToShow.length > 10) {
    return <div>Too many countries to show ({countriesToShow.length})</div>;
  } else if (countriesToShow.length <= 10 && countriesToShow.length > 1) {
    return <CountryList countries={countriesToShow} setFilter={setFilter} />;
  } else if (countriesToShow.length === 1) {
    return <CountryDetails country={countriesToShow[0]} />;
  } else {
    return <div>Nothing found</div>;
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  const handleFilterChange = e => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then(res => {
      console.log('promise fulfilled', res);
      setCountries(res.data);
    });
  }, []);

  return (
    <div>
      find countries
      <input value={filter} onChange={handleFilterChange} />
      <FilteredCountries
        countries={countries}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

import React, { useState } from 'react';
import cltNames from '../../assets/clt_neighborhood_names.json';
import './NeighborhoodSearch.css';
import CharlotteCrimeLogo from '../../assets/CharlotteCrimeLogo.png';

export default function NeighborhoodSearch({ onSelect }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [prevFirstChar, setPrevFirstChar] = useState('');
  const [error, setError] = useState(null);

  const [crimeData, setCrimeData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // ---------- load slice for first-character ----------
  const handleFirstCharChange = async (firstChar) => {
    setLoadingData(true);
    try {
     //test const url = `http://localhost:5001/api/crime/${encodeURIComponent(firstChar)}`;
     /*prod*/ const url = `https://cltcrime-service.onrender.com/api/crime/${encodeURIComponent(firstChar)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.d || data.value || [];
      setCrimeData(arr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
      setTimeout(() => setError(null), 10_000);
    }
  };

  // ---------- input change ----------
  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setError(null);

    const firstChar = val.charAt(0) || '';
    if (firstChar !== prevFirstChar) {
      setPrevFirstChar(firstChar);
      if (firstChar) handleFirstCharChange(firstChar);
      else setCrimeData([]);
    }

    if (!val) {
      setSuggestions([]);
      return;
    }
    const matches = cltNames.filter((name) =>
      name.toLowerCase().startsWith(val.toLowerCase()),
    );
    setSuggestions(matches.length ? matches : ['No Matches']);
  };

  // ---------- selection ----------
  const finalizeSelection = (name) => {
    if (name === 'No Matches') {
      setError('Invalid neighborhood—no matches found.');
      return;
    }

    // gather every matching record for downstream analysis
    const matchedRecords = crimeData.filter((rec) => {
      const raw = typeof rec.LOCATION === 'string' ? rec.LOCATION : '';
      const loc = raw.replace(/^[\d\s]+/, '');
      return loc === name;
    });

    const count = matchedRecords.length;

    // pass name, count, **and records** up
    onSelect?.(name, count, matchedRecords);

    // reset UI
    setInput('');
    setSuggestions([]);
  };

  const handleSelect = (name) => {
    if (loadingData) return;
    finalizeSelection(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loadingData) return;
    if (!suggestions.includes(input)) {
      setError('Please select a valid neighborhood from suggestions.');
      return;
    }
    finalizeSelection(input);
  };

  const isValid = suggestions.includes(input);

  return (
    <div className="neighborhood-search">
      <img src={CharlotteCrimeLogo} alt="Logo" className="logo" />
      <h2>Neighborhood Safety Report</h2>

      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Neighborhood"
        />
        <button type="submit" disabled={!isValid || loadingData}>
          {'>'}
        </button>
      </form>

      {!input && <h3>Disclaimer: Data is relevant only to Charlotte, NC.</h3>}

      {input && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => handleSelect(s)}>
              {s}
            </li>
          ))}
        </ul>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
}
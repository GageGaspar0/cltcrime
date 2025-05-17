import React, { useState, useEffect } from 'react';
import cltNames from '../../assets/clt_neighborhood_names.json';
import './NeighborhoodSearch.css';
import CharlotteCrimeLogo from '../../assets/CharlotteCrimeLogo.png';

export default function NeighborhoodSearch({ onSelect, onLoading }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [prevFirstChar, setPrevFirstChar] = useState('');
  const [error, setError] = useState(null);

  const [crimeData, setCrimeData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [pendingSelection, setPendingSelection] = useState(null);


  const handleFirstCharChange = async (firstChar) => {
    const letter = firstChar.toUpperCase();
    setLoadingData(true);
    try {
      const url = `https://cltcrime-service.onrender.com/api/crime/${encodeURIComponent(letter)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.d || data.value || [];
      setCrimeData(arr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setError(null);

    const firstChar = val.charAt(0).toUpperCase() || '';
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

 
  const finalizeSelection = (name, force = false) => {
    if (name === 'No Matches') {
      setError('Invalid neighborhood—no matches found.');
      return;
    }

     setSuggestions([]);
    setInput('');

 
    if (!force && loadingData) {
      onLoading?.(true);
      setPendingSelection(name);          
      return;                            
    }

  
    const matchedRecords = crimeData.filter((rec) => {
      const raw = typeof rec.LOCATION === 'string' ? rec.LOCATION : '';
      const loc = raw.replace(/^[\d\s]+/, '');
      return loc === name;
    });

  
    onSelect?.(name, matchedRecords.length, matchedRecords);
    onLoading?.(false);

    setPendingSelection(null);
    setInput('');
    setSuggestions([]);
  };

  const handleSelect = (name) => finalizeSelection(name);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!suggestions.includes(input)) {
      setError('Please select a valid neighborhood from suggestions.');
      return;
    }
    finalizeSelection(input);
  };

  
  useEffect(() => {
    if (!loadingData && pendingSelection) {
      finalizeSelection(pendingSelection, true);  
    }
  }, [loadingData, pendingSelection]);           

  const isValid = suggestions.includes(input);

  /* ---------------------------------------------------------------------- */
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
        <button type="submit" disabled={!isValid}>
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
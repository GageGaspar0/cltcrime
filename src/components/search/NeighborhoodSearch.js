// src/components/search/NeighborhoodSearch.js
import React, { useState } from 'react';
import cltNames from '../../assets/clt_neighborhood_names.json';
import './NeighborhoodSearch.css';
import CharlotteCrimeLogo  from '../../assets/CharlotteCrimeLogo.png';

export default function NeighborhoodSearch({ onSelect }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [prevFirstChar, setPrevFirstChar] = useState('');
  const [error, setError] = useState(null);

  const handleFirstCharChange = async (firstChar) => {

    try {
    const encoded = encodeURIComponent(firstChar);
    const url = `http://localhost:5001/api/crime/${encoded}`;
    const res = await fetch(url);
      
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    
    const data = await res.json();
    console.log('crime data', data);
    
    const crimesArray = Array.isArray(data)
      ? data
      : data.d
      ? data.d
      : data.value
      ? data.value
      : [];
    
  } catch (err) {
    setError(`Failed to fetch crime data: ${err.message}`);
    console.error('Error details:', err);
  } finally {
    setInput('');
  }
};


  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
  
    const firstChar = val.charAt(0) || '';
    if (firstChar !== prevFirstChar) {
      setPrevFirstChar(firstChar);
      if (firstChar) {
        handleFirstCharChange(firstChar);
      }
    }

    if (!val) {
      setSuggestions([]);
      return;
    }
  

    const matches = cltNames.filter(name =>
      name.toLowerCase().startsWith(val.toLowerCase())   
    );
  
    setSuggestions(matches.length ? matches : ['No Matches']);
  };

  const handleSelect = (name) => {
    if (name === 'No Matches') return;
    
    setInput(name);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cltNames.includes(input)) {
      onSelect?.(input);
    }
    setInput('');
    setSuggestions([]);
  };

return (
    <div className="neighborhood-search">
       
       <img src={CharlotteCrimeLogo} alt="Logo" className="logo"/>
       <h2>Neighborhood Safety Report</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
            <input
                type="text"
                value={input}
                onChange={handleChange}
                placeholder="Neighborhood"
            />
            <button type="submit" disabled={!cltNames.includes(input)}>
                {'>'}
            </button>
        </form>
        {!input && (
            <h3>
                Disclaimer: Data is relevant only to Charlotte, NC. 
            </h3>
        )}
        {input && (
            <ul className="suggestions">
                {suggestions.map((s, i) => (
                    <li key={i} onClick={() => handleSelect(s)}>
                        {s}
                    </li>
                ))}
            </ul>
        )}
    </div>
);
}
import React, { useState } from 'react';
import cltNames from '../../assets/clt_neighborhood_names.json';
import './NeighborhoodSearch.css';
import CharlotteCrimeLogo  from '../../assets/CharlotteCrimeLogo.png';

export default function NeighborhoodSearch({ onSelect }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
  
    if (!val) {
      setSuggestions([]);
      return;
    }
  
    // show only names that START with the typed text
    const matches = cltNames.filter(name =>
      name.toLowerCase().startsWith(val.toLowerCase())   // <-- updated line
    );
  
    setSuggestions(matches.length ? matches : ['No Matches']);
  };

  const handleSelect = (name) => {
    if (name === 'No Matches') return;
    // populate input with the clicked suggestion but don't auto-submit
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
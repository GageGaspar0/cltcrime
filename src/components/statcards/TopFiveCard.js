// src/components/statcards/TopFiveCard.js
import React from 'react';
import './TopFiveCard.css';

const TOP3 = [
  { rank: '#1', value: 17876, label: 'N TRYON ST' },
  { rank: '#2', value: 14972, label: 'SOUTH BV'    },
  { rank: '#3', value: 11319, label: 'S TRYON ST'  },

];

export default function TopFiveCard() {
  return (
    <div className="top-five-cards">
      {TOP3.map((item, i) => (
        <div className="top-five-card" key={i}>
          <div className="tf-static-label">{item.rank}</div>
          <div className="tf-value">{item.value.toLocaleString()}</div>
          <div className="tf-dynamic-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
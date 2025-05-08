import React from 'react';
import './TopFiveCard.css';

const TOP5 = [
  { rank: '#1', value: 17876, label: 'N TRYON ST' },
  { rank: '#2', value: 14972, label: 'SOUTH BV'    },
  { rank: '#3', value: 11319, label: 'S TRYON ST'  },
  { rank: '#4', value: 10205, label: 'ALBEMARLE RD'},
  { rank: '#5', value:  7471, label: 'E.INDEPENDENCE' }
];

export default function TopFiveCard() {
  return (
    <div className="top-five-cards">
      {TOP5.map((item, i) => (
        <div className="top-five-card" key={i}>
          <div className="tf-static-label">{item.rank}</div>
          <div className="tf-value">{item.value.toLocaleString()}</div>
          <div className="tf-dynamic-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
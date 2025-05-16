import './TopThreeZipcodes.css';
import React from 'react';


const TOP3ZIP = [
   { rank: '#1', value: 45651, label: '28208' },
   { rank: '#2', value: 39856, label: '28205' },
   { rank: '#3', value: 36004, label: '28216' },

];

export default function TopThreeZipcodes() {
  return (
<div className="top-three-zipcodes-wrapper">
  <h2 className="zipcode-section-header">Top 3 Highest Crime Zip Codes</h2>

  <div className="top-three-zipcodes">
    {TOP3ZIP.map((item, i) => (
      <div className="top-three-zipcode" key={i}>
        <div className="tf-static-label">{item.rank}</div>
        <div className="tf-value">{item.value.toLocaleString()}</div>
        <div className="tf-dynamic-label">{item.label}</div>
      </div>
    ))}
  </div>
</div>
  );
}
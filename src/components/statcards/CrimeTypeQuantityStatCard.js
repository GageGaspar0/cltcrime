import React, { useState, useEffect } from 'react';
import './CrimeTypeQuantityStatCard.css';

const DATA = [
  { label: 'Assault',    value: 22863 },
  { label: 'Burglary/B&E',   value: 35811 },
  { label: 'Robbery',    value: 13085 },
  { label: 'Murder',    value: 725 },
  { label: 'Motor Vehicle Theft',    value: 36118 },
  { label: 'Forcible Rape',    value: 1953 },
  { label: 'Theft From Motor Vehicle',    value: 75481 },
];

export default function CrimeTypeQuantityStatCard() {
  const [idx, setIdx] = useState(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setDisplay(0);
    const target = DATA[idx].value;
    const duration = 2000;
    const steps = Math.min(target, 60);
    const stepTime = duration / steps;
    let current = 0,
        step    = Math.ceil(target / steps);

    const counter = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplay(current);
      if (current >= target) {
        clearInterval(counter);
        setTimeout(() => setIdx((idx + 1) % DATA.length), 4000);
      }
    }, stepTime);

    return () => clearInterval(counter);
  }, [idx]);

  return (
    <div className="crime-type-quantity-stat-card">
      <div className="value">{display.toLocaleString()}</div>
      <div className="dynamic-label">{DATA[idx].label}</div>
    </div>
  );
}
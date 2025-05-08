// src/components/statcards/CrimeReportsPerYearStatCard.js
import React, { useState, useEffect } from 'react';
import './CrimeReportsPerYearStatCard.css';

const DATA = [
  { label: 'Total since 2017', value: 675727 },
  { label: '2020',            value: 76162  },
  { label: '2021',            value: 77171  },
  { label: '2022',            value: 80520  },
  { label: '2023',            value: 86417  },
  { label: '2024',            value: 83684  },
  { label: '2025',            value: 24973  },
];

export default function CrimeReportsPerYearStatCard() {
  const [idx, setIdx] = useState(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setDisplay(0);
    const target = DATA[idx].value;
    const duration = 2000;
    const steps = Math.min(target, 60);
    const stepTime = duration / steps;
    let current = 0, step = Math.ceil(target/steps);

    const counter = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplay(current);
      if (current >= target) {
        clearInterval(counter);
        setTimeout(() => setIdx((idx+1)%DATA.length), 6000);
      }
    }, stepTime);

    return () => clearInterval(counter);
  }, [idx]);

  return (
    <div className="crime-reports-stat-card">
      <div className="static-label">Crime Reports</div>
      <div className="value">{display.toLocaleString()}</div>
      <div className="dynamic-label">{DATA[idx].label}</div>
    </div>
  );
}
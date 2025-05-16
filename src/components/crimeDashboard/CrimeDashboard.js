import './CrimeDashboard.css';
import React, { useState, useEffect } from 'react';
import defaultCrimeData from '../../assets/default_crime_data.json';   // ← NEW
import TopThreeZipcodes from '../statcards/TopThreeZipcodes';
/* -------------------------------------------------------------------------- */
/* helper: tiny least-squares slope → 'increasing' | 'decreasing' | 'stable'  */
/* -------------------------------------------------------------------------- */
function trendFromSeries(series) {
  if (series.length < 2) return 'insufficient data';
  const n = series.length;
  const xs = [...Array(n).keys()];
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = series.reduce((a, b) => a + b, 0) / n;
  const num = xs.reduce((s, x, i) => s + (x - meanX) * (series[i] - meanY), 0);
  const den = xs.reduce((s, x) => s + (x - meanX) ** 2, 0);
  const slope = num / den;
  if (slope > 0) return 'increasing';
  if (slope < 0) return 'decreasing';
  return 'stable';
}

/* -------------------------------------------------------------------------- */
/* core analytics                                                             */
/* -------------------------------------------------------------------------- */
function analyzeCrimeData(records) {
  const total_reports_count = records.length;

  const monthCounts = new Map();        // yyyy-mm → #
  const yearCounts = new Map();         // DATE_REPORTED based
  const reportsByYear = new Map();      // explicit YEAR based
  const nibrsCounts = new Map();
  const locationTypeCounts = new Map();

  let total_arrests = 0;
  let total_open_status = 0;
  const arrestsPerYear = new Map();

  records.forEach((r) => {
    /* ---------- DATE-based splits ---------- */
    const date = new Date(r.DATE_REPORTED);
    if (!Number.isNaN(date.valueOf())) {
      const y = date.getFullYear();
      const ym = `${y}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts.set(ym, (monthCounts.get(ym) || 0) + 1);
      yearCounts.set(y, (yearCounts.get(y) || 0) + 1);
    }

    /* ---------- explicit YEAR for reports_by_year ---------- */
    const yr = r.YEAR;
    if (typeof yr === 'number' && !Number.isNaN(yr)) {
      reportsByYear.set(yr, (reportsByYear.get(yr) || 0) + 1);
    }

    /* ---------- NIBRS, location type ---------- */
    const nibrs = r.HIGHEST_NIBRS_DESCRIPTION ?? '';
    nibrsCounts.set(nibrs, (nibrsCounts.get(nibrs) || 0) + 1);

    const locType = r.LOCATION_TYPE_DESCRIPTION ?? 'Unknown';
    locationTypeCounts.set(
      locType,
      (locationTypeCounts.get(locType) || 0) + 1,
    );

    /* ---------- clearance status ---------- */
    const clr = String(r.CLEARANCE_STATUS ?? '').trim().toLowerCase();
    if (clr === 'cleared by arrest') {
      total_arrests += 1;
      arrestsPerYear.set(
        date.getFullYear(),
        (arrestsPerYear.get(date.getFullYear()) || 0) + 1,
      );
    } else if (clr === 'open') {
      total_open_status += 1;
    }
  });

  /* ---------- averages ---------- */
const yearsPresent = [...reportsByYear.keys()].filter((y) => y !== 2025);
const totalMonths = yearsPresent.length * 12;          // 12 months per full year
const avgMonth =
  totalMonths === 0 ? 0 : total_reports_count / totalMonths;


  const yearCountsWithout2025 = [...yearCounts.entries()].filter(
    ([y]) => y !== 2025,
  );
  const avgYear =
    yearCountsWithout2025.reduce((a, [, v]) => a + v, 0) /
    (yearCountsWithout2025.length || 1);

  const avgArrestsYear =
    [...arrestsPerYear.entries()]
      .filter(([y]) => y !== 2025)
      .reduce((a, [, v]) => a + v, 0) /
    (arrestsPerYear.size || 1);

  /* ---------- NIBRS top-three ---------- */
  const sortedNibrs = [...nibrsCounts.entries()].sort((a, b) => b[1] - a[1]);
  const topThree = sortedNibrs.slice(0, 3);
  const top_three_nibrs_descriptions = topThree.map(([d]) => d);
  const top_three_nibrs_percentage = Object.fromEntries(
    topThree.map(([d, c]) => [d, +(100 * (c / total_reports_count)).toFixed(0)]),
  );

  /* ---------- trends ---------- */
  const lastThreeYears = yearCountsWithout2025
    .sort(([a], [b]) => a - b)
    .slice(-3)
    .map(([, v]) => v);
  const lastThreeYearsTrend = trendFromSeries(lastThreeYears);

  const monthsWanted = [
    '2024-10',
    '2024-11',
    '2024-12',
    '2025-01',
    '2025-02',
    '2025-03',
  ];
  const lastSix = monthsWanted.map((m) => monthCounts.get(m) || 0).reverse();
  const lastSixMonthsTrend = trendFromSeries(lastSix);

  /* ---------- assemble ---------- */
  return {
    total_reports_count,
    average_report_count_per_month: avgMonth < 1 ? <h2>less than 1</h2>: +avgMonth.toFixed(0),
    avg_report_count_per_year: +avgYear.toFixed(0),

    top_three_nibrs_descriptions,
    top_three_nibrs_percentage,

    total_arrests,
    total_open_status,
    average_arrests_per_year: +avgArrestsYear.toFixed(0),

    last_three_years_trend: lastThreeYearsTrend,
    last_six_months_trend: lastSixMonthsTrend,

    location_type_counts: Object.fromEntries(locationTypeCounts),
    nibrs_description_with_counts: Object.fromEntries(nibrsCounts),
    reports_by_year: Object.fromEntries(reportsByYear),
  };
}

/* -------------------------------------------------------------------------- */
/* component                                                                  */
/* -------------------------------------------------------------------------- */
export default function CrimeDashboard({ location, records }) {
  const [metrics, setMetrics] = useState({
    /* ------------ city-wide defaults (unchanged) ------------ */
    total_reports_count: 675727,
    average_report_count_per_month: 6757,
    avg_report_count_per_year: 81344,
    top_three_nibrs_descriptions: [
      'Theft From Motor Vehicle',
      'All Other Offenses',
      'Simple Assault',
    ],
    top_three_nibrs_percentage: {
      'Theft From Motor Vehicle': 11,
      'All Other Offenses': 11,
      'Simple Assault': 9,
    },
    total_arrests: 118840,
    total_open_status: 432817,
    average_arrests_per_year: 14479,
    last_three_years_trend: 'increasing',
    last_six_months_trend: 'decreasing',
    location_type_counts: {
      Indoors: 296019,
      Outdoors: 241270,
      'Parking Lot': 108100,
      Other: 19400,
      'Parking Deck': 10938,
    },
    nibrs_description_with_counts: {
      "Theft From Motor Vehicle": 75481,
    "All Other Offenses": 72710,
    "Simple Assault": 63987,
    "All Other Thefts": 63883,
    "Shoplifting": 44903,
    "Damage/Vandalism Of Property": 44100,
    "Motor Vehicle Theft": 36118,
    "Burglary/B&E": 35811,
    "Drug/Narcotic Violations": 27000,
    "Intimidation": 23529,
    "Aggravated Assault": 22863,
    "Missing Person": 20532,
    "False Pretenses/Swindle": 13830,
    "Robbery": 13085,
    "Theft of Motor Vehicle Parts from Vehicle": 12386,
    "Credit Card/Teller Fraud": 8696,
    "Theft From Building": 8252,
    "Identity Theft": 7843,
    "Sudden/Natural Death Investigation": 7561,
    "Weapon Law Violations": 5879,
    "Stolen Property Offenses": 5632,
    "Trespass Of Real Property": 5156,
    "Impersonation": 4853,
    "Counterfeiting/Forgery": 4657,
    "Overdose": 4332,
    "Suicide": 4212,
    "Vehicle Recovery": 4195,
    "Drug Equipment Violations": 3883,
    "Forcible Fondling": 3870,
    "Driving Under The Influence": 3719,
    "Embezzlement": 2515,
    "Pornography/Obscene Material": 2403,
    "Forcible Rape": 1953,
    "Affray": 1728,
    "Public Accident": 1456,
    "Extortion/Blackmail": 1353,
    "Kidnapping": 1326,
    "Pocket-Picking": 1303,
    "Arson": 1110,
    "Purse-Snatching": 1075,
    "Indecent Exposure": 887,
    "Murder": 725,
    "Disorderly Conduct": 709,
    "Hacking/Computer Invasion": 457,
    "Forcible Sodomy": 454,
    "Family Offenses; Nonviolent": 423,
    "Liquor Law Violations": 391,
    "Wire Fraud": 360,
    "Animal Cruelty": 356,
    "Statutory Rape": 273,
    "Theft From Coin-Operated Machine Or Device": 255,
    "Fire (Accidental/Non-Arson)": 252,
    "Peeping Tom": 213,
    "Curfew/Loitering/Vagrancy Violations": 134,
    "Worthless Check: Felony (over $2000)": 103,
    "Justifiable Homicide": 97,
    "Sexual Assault With Object": 96,
    "Prostitution": 87,
    "Human Trafficking, Involuntary Servitude": 67,
    "Dog Bite/Animal Control Incident": 45,
    "Negligent Manslaughter": 32,
    "Human Trafficking, Commercial Sex Acts": 29,
    "Incest": 29,
    "Gambling Equipment Violations": 23,
    "Assisting Gambling": 18,
    "Assisting Prostitution": 11,
    "Betting/Wagering": 8,
    "Welfare Fraud": 7,
    "Purchasing Prostitution": 3,
    "Bribery": 2,
    "Gas Leak": 1
    },
    reports_by_year: {
      2017: 82962,
      2018: 80418,
      2019: 83420,
      2020: 76162,
      2021: 77171,
      2022: 80520,
      2023: 86417,
      2024: 83684,
      2025: 24973,
    },
  });

  /* ZIP-code comparison sentence */
  const [zipComparison, setZipComparison] = useState(
    'ZIP code data unavailable',
  );

  /* ---------------- recompute on new records or fetch ------------------- */
  useEffect(() => {
    const process = (rows, label) => {
      const newMetrics = analyzeCrimeData(rows);
      setMetrics(newMetrics);

      /* ---------- ZIP-code comparison ---------- */
      let text = 'ZIP code data unavailable';
      if (rows.length) {
        const firstWithZip = rows.find((r) =>
          String(r.ZIP ?? '').trim().match(/^\d{5}$/),
        );
        if (firstWithZip) {
          const zip = String(firstWithZip.ZIP).padStart(5, '0');
          const zipTotals =
            defaultCrimeData.crime_reports_by_zipcode || {};
          const zipTotal = zipTotals[zip];

          if (zipTotal) {
            const pct = ((rows.length / zipTotal) * 100).toFixed(2);
                        text = (
              <>
                This neighborhood accounts for {pct}% of the total crime in zip code&nbsp;
                <strong>{zip}</strong>
              </>
            );
          }
        }
      }
      setZipComparison(text);

      /* ---------- console debug ---------- */
      console.log(`[CrimeDashboard] ${label}: ${rows.length} records`);
      console.log('  zip comparison:', text);
      Object.entries(newMetrics).forEach(([k, v]) =>
        console.log(`  ${k}:`, v),
      );
    };

    /* --- use records supplied from parent --- */
    if (records && records.length) {
      process(records, 'analysed');
      return;
    }

    /* --- otherwise fetch slice for the first letter --- */
    if (!location || location === 'Charlotte, NC') return;

    const firstChar = location[0].toUpperCase();
    const url = `https://cltcrime-service.onrender.com/api/crime/${encodeURIComponent(
      firstChar,
    )}`;

    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();

        const filtered = data.filter((r) => {
          const raw = typeof r.LOCATION === 'string' ? r.LOCATION : '';
          const loc = raw.replace(/^[\d\s]+/, '');
          return loc === location;
        });

        if (filtered.length) process(filtered, 'fetched & analysed');
      } catch (err) {
        console.error('[CrimeDashboard] analysis error:', err);
      }
    })();
  }, [location, records]);

  /* ---------------------------------------------------------------------- */
  return (
    <div className="crime-dashboard">
      {/* ---------------- selected location ---------------- */}
      <div className="selected-location-name">
        <h2>{location}</h2>
      </div>

      

      {/* ---------------- yearly tiles ---------------- */}
<div className="year-section">          {/* ← takes grid-area */}
  <h2 className="section-header">Crime Reports By Year</h2>

  <div className="year-tiles">          {/* ← keeps existing grid */}
    {Object.entries(metrics.reports_by_year).map(([year, count]) => (
      <div key={year} className="year-tile">
        <h2>{year}</h2>
        <p>{count}</p>
      </div>
    ))}
    <div key="total" className="year-tile">
      <h2>total</h2>
      <p>{metrics.total_reports_count}</p>
    </div>
  </div>
</div>

      {/* ---------------- crime stats ---------------- */}
      <div className="crime-stats">
        <div className="crime-stats-section">
          <h2>Total</h2> {metrics.total_reports_count}
          <h2>Reports</h2>
        </div>
        <div className="crime-stats-section">
          <h2>On Avg.</h2> {metrics.average_report_count_per_month}
          <h2>per&nbsp;month</h2>
        </div>
        <div className="crime-stats-section">
          <h2>On Avg.</h2> {metrics.avg_report_count_per_year}
          <h2>per&nbsp;year</h2>
        </div>
      </div>

      {/* ---------------- top three crimes ---------------- */}
      <div className="top-three">
        <h2>Top Three Crimes - % of Total</h2>
        {metrics.top_three_nibrs_descriptions.map((desc, i) => (
          <div key={i} className="top-three-item">
            <h3>
              {desc} - {metrics.top_three_nibrs_percentage[desc]}%
            </h3>
          </div>
        ))}
      </div>

      {/* ---------------- crime description counts ---------------- */}
      <div className="crime-description-with-counts">
        <h2>Crime Description with Counts</h2>
        {Object.entries(metrics.nibrs_description_with_counts).map(
          ([desc, count]) => (
            <div key={desc} className="crime-description-item">
              <h3>
                {desc} - {count}
              </h3>
            </div>
          ),
        )}
      </div>

      {/* ---------------- location type counts ---------------- */}
      <div className="location-type-counts">
        <h2>Location Type Counts</h2>
        {Object.entries(metrics.location_type_counts).map(([type, count]) => (
          <div key={type} className="location-type-item">
            <h3>
              {type} - {count}
            </h3>
          </div>
        ))}
      </div>

      {/* ---------------- arrest stats ---------------- */}
      <div className="arrest-stats">
        <div className="crime-stats-section">
          <h2>Total</h2> {metrics.total_arrests}
          <h2>Arrests</h2>
        </div>
        <div className="crime-stats-section">
          <h2>On&nbsp;Avg.</h2> {metrics.average_arrests_per_year}
          <h2>Arrests/yr</h2>
        </div>
        <div className="crime-stats-section">
          <h2>Cases</h2> {metrics.total_open_status}
          <h2>Open</h2>
        </div>
      </div>

      {/* ---------------- crime trends ---------------- */}
      <div className="crime-trends">
        <h2>Crime Trends</h2>
        <div className="trend-row">
          <div className="trend-item">
            <div className="trend-label">
              <h3>3&nbsp;yr Trend</h3>
            </div>
            <div className="trend-value">{metrics.last_three_years_trend}</div>
          </div>
          <div className="trend-item">
            <div className="trend-label">
              <h3>6&nbsp;mo Trend</h3>
            </div>
            <div className="trend-value">{metrics.last_six_months_trend}</div>
          </div>
        </div>
      </div>

      
<div className="zip-code-wrapper">                   

  {(!location || location === 'Charlotte, NC') ? (
    <TopThreeZipcodes />
  ) : (
    <div className="zip-code-comparison">{zipComparison}</div>
  )}
</div>
    </div>
  );
}
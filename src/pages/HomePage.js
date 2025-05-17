import './HomePage.css';
import React, { useState, useRef } from 'react';
import CrimeReportsPerYearStatCard from '../components/statcards/CrimeReportsPerYearStatCard';
import CrimeTypeQuantityStatCard from '../components/statcards/CrimeTypeQuantityStatCard';
import NeighborhoodSearch from '../components/search/NeighborhoodSearch';
import TopFiveCard from '../components/statcards/TopFiveCard';
import CrimeDashboard from '../components/crimeDashboard/CrimeDashboard';
import CrimeDashboardSkeleton from '../components/crimeDashboard/CrimeDashboardSkeleton';
import '../components/crimeDashboard/CrimeDashboard.css';

export default function HomePage() {
  const [location, setLocation] = useState('Charlotte, NC');
  const [matchCount, setMatchCount] = useState(null);
  const [records, setRecords] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]     = useState(false); 


  const dashRef = useRef(null);

  const handleNeighborhoodSelect = (name, count, recs) => {
    setLoading(false);                  
    setLocation(name);
    setMatchCount(count);
    setRecords(recs);
  };

    const handleLoading = (isLoading) => {
    setLoading(isLoading);
    
        if (isLoading && window.innerWidth <= 1215 && dashRef.current) {
     
      const target =
        dashRef.current.querySelector(".arrest-stats") ||
        dashRef.current;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }
  };

  return (
    <div className="homepage">
      <div className="search-container">
        <div className="location-label">
          <h1>Charlotte Crime Report</h1>
        </div>

        <div className="statcard-container">
          <CrimeReportsPerYearStatCard />
          <CrimeTypeQuantityStatCard />
        </div>

        <div className="search-neighborhood">
          <NeighborhoodSearch onSelect={handleNeighborhoodSelect} onLoading={handleLoading} />
        </div>

        <div className="top-three-wrapper">
          <p>Top 3 Highest Crime Locations</p>
        </div>

        <div className="top-five-container">
          <TopFiveCard />
        </div>

        <div className="learn-more">
          <button
            className="learn-more_button"
            onClick={() => setShowModal(true)}
          >
            Learn More About This Data
          </button>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  className="modal-close-button"
                  onClick={() => setShowModal(false)}
                >
                  X
                </button>
              </div>
              <div className="modal-body">
                <p>
                  This website is an independent project and is not affiliated
                  with, endorsed by, or operated by the City of Charlotte, North
                  Carolina. It is solely intended to provide a convenient
                  platform for accessing publicly available crime data for the
                  Charlotte area.
                  <br />
                  <br />
                  The crime reports and related data presented on this website
                  are sourced from the City of Charlotte’s publicly available
                  data at https://data.charlottenc.gov/. However, this site is
                  not an official source of government information.
                  <br />
                  <br />
                  Please note that the data displayed here has been processed to
                  remove non-criminal reports and other unrelated records,
                  resulting in potential differences between this site’s data
                  and the original database. The creator of this website did not
                  generate or edit the original crime reports, and any
                  inaccuracies or omissions are the result of the data provided
                  by the original source.
                  <br />
                  <br />
                  This website is intended for informational purposes only and
                  should not be relied upon for legal, official, or emergency
                  purposes. For the most accurate and complete data, please
                  refer to the official City of Charlotte data portal.
                  <br />
                  <br />
                  Thank you for using this resource.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="main-dashboard" ref={dashRef}>
        {loading
          ? <CrimeDashboardSkeleton />
          : <CrimeDashboard location={location} records={records} />}
      </div>
    </div>
  );
}
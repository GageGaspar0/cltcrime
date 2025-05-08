// src/pages/HomePage.js
import './HomePage.css';
import React, { useState } from 'react';
import CrimeReportsPerYearStatCard from '../components/statcards/CrimeReportsPerYearStatCard';
import CrimeTypeQuantityStatCard from '../components/statcards/CrimeTypeQuantityStatCard';
import NeighborhoodSearch from '../components/search/NeighborhoodSearch';
import TopFiveCard from '../components/statcards/TopFiveCard';



export default function HomePage() {

  const [location, setLocation] = useState('Charlotte, NC');

  return (
    <div className='homepage'>
        <div className='search-container'>
            <div className='location-label'>
              <h1>{location}</h1>
            </div>
            <div className='statcard-container'>
                <CrimeReportsPerYearStatCard/>
                <CrimeTypeQuantityStatCard/>
            </div>
            <div className='search-neighborhood'>
               <NeighborhoodSearch/>
            </div>
            <p>Top 10 Neighborhoods</p>
            <div className='top-five-container'>  
            <TopFiveCard/>
            </div>
        </div>

        <div className='main-dashboard'>
          
        </div>
    </div>
  );
}
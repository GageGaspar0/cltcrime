import './CrimeDashboardSkeleton.css';import './CrimeDashboardSkeleton.css';


export default function CrimeDashboardSkeleton() {
 
  const years = Array.from({ length: 9 }, (_, i) => 2017 + i);

  return (
    <div className="crime-dashboard skeleton">
     
      <div className="selected-location-name placeholder" />

    
      <div className="year-section">
        <div className="section-header placeholder" />
        <div className="year-tiles">
          {years.map((y) => (
            <div key={y} className="year-tile placeholder" />
          ))}
          <div className="year-tile placeholder" /> 
        </div>
      </div>

     
      <div className="crime-stats">
        {[1, 2, 3].map((i) => (
          <div key={i} className="crime-stats-section placeholder" />
        ))}
      </div>

    
      <div className="top-three   placeholder" />
      <div className="crime-description-with-counts placeholder" />
      <div className="location-type-counts       placeholder" />
      <div className="arrest-stats">
        {[1, 2, 3].map((i) => (
          <div key={i} className="crime-stats-section placeholder" />
        ))}
      </div>
      <div className="crime-trends  placeholder" />
      <div className="zip-code-wrapper placeholder" />
    </div>
  );
}
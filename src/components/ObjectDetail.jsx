import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ObjectDetail = ({ objectName }) => {
  const [objectData, setObjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchObjectData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch data from Solar System OpenData API
        const response = await fetch(`https://api.le-systeme-solaire.net/rest/bodies/${objectName}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Transform the API data
        const transformedData = {
          id: data.id,
          name: data.englishName,
          latinName: data.name,
          type: data.isPlanet ? 'Planet' : data.bodyType,
          moons: data.moons ? data.moons.length : 0,
          moonsList: data.moons || [],
          gravity: data.gravity,
          density: data.density,
          discoveryDate: data.discoveryDate || 'Prehistoric',
          discoveryBy: data.discoveredBy || 'Unknown',
          mass: data.mass ? {
            massValue: data.mass.massValue,
            massExponent: data.mass.massExponent
          } : null,
          meanRadius: data.meanRadius,
          equaRadius: data.equaRadius,
          polarRadius: data.polarRadius,
          flattening: data.flattening,
          inclination: data.inclination,
          eccentricity: data.eccentricity,
          semimajorAxis: data.semimajorAxis,
          sideralOrbit: data.sideralOrbit,
          sideralRotation: data.sideralRotation,
          perihelion: data.perihelion,
          aphelion: data.aphelion,
          axialTilt: data.axialTilt,
          avgTemp: data.avgTemp,
          mainAnomaly: data.mainAnomaly,
          argPeriapsis: data.argPeriapsis,
          longAscNode: data.longAscNode,
          bodyType: data.bodyType
        };
        
        setObjectData(transformedData);
        
        // Generate mock historical data for visualization
        // In a real app, this would come from another API call
        generateHistoricalData(transformedData);
        
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch object data: ' + error.message);
        setLoading(false);
      }
    };
    
    fetchObjectData();
  }, [objectName]);
  
  const generateHistoricalData = (data) => {
    // Mock data for orbit visualization
    // In a real application, this would come from actual historical data
    const mockData = [];
    const dataPoints = 12;
    
    // Use the object's actual orbital period if available, or default to Earth's (365 days)
    const orbitalPeriod = data.sideralOrbit || 365;
    
    for (let i = 0; i < dataPoints; i++) {
      const angle = (i / dataPoints) * 2 * Math.PI;
      const distanceFactor = 1 - (data.eccentricity || 0.01667) * Math.cos(angle);
      const distance = (data.semimajorAxis || 149598000) * distanceFactor / 1000000; // Convert to million km
      
      mockData.push({
        time: i * (orbitalPeriod / dataPoints),
        distance: distance.toFixed(2),
        temperature: data.avgTemp ? (data.avgTemp - Math.random() * 10).toFixed(1) : 0
      });
    }
    
    setHistoricalData(mockData);
  };
  
  if (loading) return <div className="loading">Loading object data...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!objectData) return <div className="not-found">Object not found</div>;
  
  // Format mass as scientific notation
  const formatMass = (mass) => {
    if (!mass) return "Unknown";
    return `${mass.massValue} × 10^${mass.massExponent} kg`;
  };
  
  return (
    <div className="object-detail">
      <div className="detail-header">
        <Link to="/" className="back-button">← Back to Dashboard</Link>
        <h1>{objectData.name}</h1>
        <div className="object-type">{objectData.type}</div>
      </div>
      
      <div className="detail-content">
        <div className="detail-section">
          <h2>Overview</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <h3>Latin Name</h3>
              <p>{objectData.latinName}</p>
            </div>
            <div className="detail-item">
              <h3>Body Type</h3>
              <p>{objectData.bodyType}</p>
            </div>
            <div className="detail-item">
              <h3>Discovery</h3>
              <p>{objectData.discoveryDate} by {objectData.discoveryBy}</p>
            </div>
            <div className="detail-item">
              <h3>Mass</h3>
              <p>{formatMass(objectData.mass)}</p>
            </div>
            <div className="detail-item">
              <h3>Gravity</h3>
              <p>{objectData.gravity ? `${objectData.gravity} m/s²` : "Unknown"}</p>
            </div>
            <div className="detail-item">
              <h3>Density</h3>
              <p>{objectData.density ? `${objectData.density} g/cm³` : "Unknown"}</p>
            </div>
          </div>
        </div>
        
        <div className="detail-section">
          <h2>Physical Characteristics</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <h3>Mean Radius</h3>
              <p>{objectData.meanRadius ? `${objectData.meanRadius.toLocaleString()} km` : "Unknown"}</p>
            </div>
            <div className="detail-item">
              <h3>Equatorial Radius</h3>
              <p>{objectData.equaRadius ? `${objectData.equaRadius.toLocaleString()} km` : "Unknown"}</p>
            </div>
            <div className="detail-item">
              <h3>Polar Radius</h3>
              <p>{objectData.polarRadius ? `${objectData.polarRadius.toLocaleString()} km` : "Unknown"}</p>
            </div>
            <div className="detail-item">
              <h3>Flattening</h3>
              <p>{objectData.flattening || "Unknown"}</p>
            </div>
            <div className="detail-item">
              <h3>Average Temperature</h3>
              <p>{objectData.avgTemp ? `${objectData.avgTemp} K` : "Unknown"}</p>
            </div>
            <div className="detail-item">
              <h3>Axial Tilt</h3>
              <p>{objectData.axialTilt ? `${objectData.axialTilt}°` : "Unknown"}</p>
            </div>
          </div>
        </div>
        
        <div className="detail-section">
          <h2>Orbital Characteristics</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <h3>Semimajor Axis</h3>
              <p>{objectData.semimajorAxis ? `${(objectData.semimajorAxis / 1000000).toFixed(2)} million km` : "Unknown"}</p>
            </div>
            <div className="detail-item">
              <h3>Orbital Period</h3>
              <p>{objectData.sideralOrbit ? `${objectData.sideralOrbit.toLocaleString()} days` : "Unknown"}</p>
            </div>
            <div className="detail-item">
              <h3>Rotation Period</h3>
              <p>{objectData.sideralRotation ? `${objectData.sideralRotation.toLocaleString()} hours` : "Unknown"}</p>
            </div>
            <div className="detail-item">
              <h3>Eccentricity</h3>
              <p>{objectData.eccentricity || "Unknown"}</p>
            </div>
            <div className="detail-item">
              <h3>Inclination</h3>
              <p>{objectData.inclination ? `${objectData.inclination}°` : "Unknown"}</p>
            </div>
            <div className="detail-item">
              <h3>Perihelion</h3>
              <p>{objectData.perihelion ? `${(objectData.perihelion / 1000000).toFixed(2)} million km` : "Unknown"}</p>
            </div>
            <div className="detail-item">
              <h3>Aphelion</h3>
              <p>{objectData.aphelion ? `${(objectData.aphelion / 1000000).toFixed(2)} million km` : "Unknown"}</p>
            </div>
          </div>
        </div>
        
        {objectData.moons > 0 && (
          <div className="detail-section">
            <h2>Moons ({objectData.moons})</h2>
            <div className="moons-list">
              {objectData.moonsList.map((moon, index) => (
                <div key={index} className="moon-item">
                  {moon.moon}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="detail-section">
          <h2>Orbital Distance Variation</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={historicalData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (Earth days)', position: 'insideBottomRight', offset: -10 }} 
                />
                <YAxis 
                  label={{ value: 'Distance (million km)', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip formatter={(value) => `${value} million km`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="distance" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  name="Distance from Sun"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-description">
            This chart shows the variation in the object's distance from the Sun throughout its orbit,
            illustrating the effect of orbital eccentricity on the object's path.
          </p>
        </div>
        
        {objectData.avgTemp && (
          <div className="detail-section">
            <h2>Temperature Variation</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={historicalData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time (Earth days)', position: 'insideBottomRight', offset: -10 }} 
                  />
                  <YAxis 
                    label={{ value: 'Temperature (K)', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip formatter={(value) => `${value} K`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ff7300" 
                    activeDot={{ r: 8 }} 
                    name="Surface Temperature"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-description">
              This chart illustrates the estimated temperature variations on the object,
              which is affected by its distance from the Sun and axial tilt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectDetail;
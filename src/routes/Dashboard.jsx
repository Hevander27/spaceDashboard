import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [celestialObjects, setCelestialObjects] = useState([]);
  const [filteredObjects, setFilteredObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [objectType, setObjectType] = useState('all');
  const [error, setError] = useState(null);
  const [showDiameterChart, setShowDiameterChart] = useState(true);
  const [showTypeChart, setShowTypeChart] = useState(true);
  
  // Function to fetch data from Solar System OpenData API
  const fetchSolarSystemData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data from Solar System OpenData API
      const response = await fetch('https://api.le-systeme-solaire.net/rest/bodies/');
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      // Transform the data to match our expected format
      const transformedData = data.bodies
        .filter(body => body.isPlanet || body.bodyType === 'Dwarf Planet')
        .slice(0, 15)
        .map((body, index) => ({
          id: index + 1,
          name: body.englishName,
          type: body.isPlanet ? 'planet' : 'dwarf planet',
          distanceFromSun: body.semimajorAxis ? (body.semimajorAxis / 149598000).toFixed(2) : 0, // Convert to AU
          diameter: body.meanRadius ? (body.meanRadius * 2) : 0,
          moons: body.moons ? body.moons.length : 0,
          discoveryYear: body.discoveryDate || 'Prehistoric',
          gravity: body.gravity || 0,
          density: body.density || 0,
          escape: body.escape || 0, // Escape velocity
          sideralOrbit: body.sideralOrbit || 0, // Orbital period in days
          sideralRotation: body.sideralRotation || 0, // Rotation period in hours
        }));
      
      setCelestialObjects(transformedData);
      setFilteredObjects(transformedData);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch data: ' + error.message);
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchSolarSystemData();
  }, []);

  // Filter objects based on search term and type filter
  useEffect(() => {
    const results = celestialObjects.filter(object => {
      const matchesSearch = object.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = objectType === 'all' || object.type === objectType;
      return matchesSearch && matchesType;
    });
    setFilteredObjects(results);
  }, [searchTerm, objectType, celestialObjects]);

  // Calculate statistics
  const totalObjects = celestialObjects.length;
  const averageDiameter = celestialObjects.length > 0 
    ? (celestialObjects.reduce((sum, obj) => {
        const diameter = typeof obj.diameter === 'number' ? obj.diameter : 0;
        return sum + diameter;
      }, 0) / totalObjects).toFixed(2)
    : 0;
  const totalMoons = celestialObjects.length > 0 
    ? celestialObjects.reduce((sum, obj) => sum + obj.moons, 0)
    : 0;

  // Data for charts
  const diameterChartData = celestialObjects
    .filter(obj => obj.diameter > 0)
    .sort((a, b) => b.diameter - a.diameter)
    .map(obj => ({
      name: obj.name,
      diameter: typeof obj.diameter === 'number' ? obj.diameter : 0
    }));

  const typeDistributionData = [
    { name: 'Planets', value: celestialObjects.filter(obj => obj.type === 'planet').length },
    { name: 'Dwarf Planets', value: celestialObjects.filter(obj => obj.type === 'dwarf planet').length }
  ];

  // Moon distribution data for additional chart
  const moonChartData = celestialObjects
    .filter(obj => obj.moons > 0)
    .sort((a, b) => b.moons - a.moons)
    .map(obj => ({
      name: obj.name,
      moons: obj.moons
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) return <div className="loading">Loading celestial data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>Space Explorer Dashboard</h1>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Objects</h3>
          <p>{totalObjects}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Diameter</h3>
          <p>{averageDiameter} km</p>
        </div>
        <div className="stat-card">
          <h3>Total Moons</h3>
          <p>{totalMoons}</p>
        </div>
      </div>

      {/* Controls for toggling charts */}
      <div className="chart-controls">
        <h3>Data Visualizations</h3>
        <div className="toggle-buttons">
          <button 
            className={showDiameterChart ? 'active' : ''}
            onClick={() => setShowDiameterChart(!showDiameterChart)}
          >
            {showDiameterChart ? 'Hide' : 'Show'} Diameter Chart
          </button>
          <button 
            className={showTypeChart ? 'active' : ''}
            onClick={() => setShowTypeChart(!showTypeChart)}
          >
            {showTypeChart ? 'Hide' : 'Show'} Type Distribution
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        {showDiameterChart && (
          <div className="chart-card">
            <h3>Object Diameters (km)</h3>
            <div className="chart">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={diameterChartData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => value.toLocaleString() + ' km'} />
                  <Legend />
                  <Bar dataKey="diameter" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-description">
              This chart shows the relative diameters of different celestial objects in kilometers. 
              Note the massive size difference between gas giants and terrestrial planets.
            </p>
          </div>
        )}
        
        {showTypeChart && (
          <div className="chart-card">
            <h3>Object Type Distribution</h3>
            <div className="chart">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typeDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-description">
              This pie chart shows the distribution of planets versus dwarf planets in our dataset.
              After the 2006 reclassification, Pluto and several other bodies were categorized as dwarf planets.
            </p>
          </div>
        )}

        <div className="chart-card">
          <h3>Moon Distribution</h3>
          <div className="chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moonChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="moons" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-description">
            This chart displays the number of moons each celestial object has. 
            Gas giants like Jupiter and Saturn have significantly more moons than inner planets.
          </p>
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <label htmlFor="search">Search Objects:</label>
          <input
            id="search"
            type="text"
            placeholder="Enter celestial object name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-dropdown">
          <label htmlFor="type-filter">Filter by Type:</label>
          <select
            id="type-filter"
            value={objectType}
            onChange={(e) => setObjectType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="planet">Planets</option>
            <option value="dwarf planet">Dwarf Planets</option>
          </select>
        </div>
      </div>

      <div className="object-list">
        <h2>Celestial Objects ({filteredObjects.length} results)</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Distance (AU)</th>
              <th>Diameter (km)</th>
              <th>Moons</th>
              <th>Discovery</th>
            </tr>
          </thead>
          <tbody>
            {filteredObjects.map((object) => (
              <tr key={object.id}>
                <td>
                  <Link to={`/object/${object.name}`} className="object-link">
                    {object.name}
                  </Link>
                </td>
                <td>{object.type}</td>
                <td>{object.distanceFromSun}</td>
                <td>{typeof object.diameter === 'number' ? object.diameter.toLocaleString() : object.diameter}</td>
                <td>{object.moons}</td>
                <td>{object.discoveryYear}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
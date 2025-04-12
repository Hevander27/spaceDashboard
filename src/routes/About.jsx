import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <h1>About Space Explorer</h1>
      
      <div className="about-section">
        <h2>Project Overview</h2>
        <p>
          Space Explorer is an interactive dashboard that provides information about celestial objects
          in our solar system. The application fetches data from the Solar System OpenData API to display
          information about planets, dwarf planets, and their characteristics.
        </p>
        <p>
          This project was created as part of Web Development Project 6, demonstrating the use of React Router
          for navigation, API data fetching, and data visualization using Recharts.
        </p>
      </div>
      
      <div className="about-section">
        <h2>Data Source</h2>
        <p>
          All data is sourced from the <a href="https://api.le-systeme-solaire.net/" target="_blank" rel="noopener noreferrer">
          Solar System OpenData API</a>, which provides comprehensive information about bodies in our solar system.
        </p>
        <p>
          The API offers data on physical characteristics (diameter, mass, density), orbital parameters
          (semimajor axis, eccentricity, inclination), and various other properties of celestial objects.
        </p>
      </div>
      
      <div className="about-section">
        <h2>Features</h2>
        <ul>
          <li>Interactive dashboard with search and filtering capabilities</li>
          <li>Detailed view for each celestial object</li>
          <li>Data visualizations including bar charts, pie charts, and line charts</li>
          <li>Responsive design that works on mobile and desktop devices</li>
          <li>Toggle controls to show/hide different visualizations</li>
        </ul>
      </div>
      
      <div className="about-section">
        <h2>Technologies Used</h2>
        <ul>
          <li>React - Frontend library for building user interfaces</li>
          <li>React Router - For navigation and routing within the application</li>
          <li>Recharts - A composable charting library built on React components</li>
          <li>Fetch API - For making API requests</li>
          <li>CSS - For styling the application</li>
        </ul>
      </div>
      
      <div className="about-section">
        <h2>Interesting Facts About Our Solar System</h2>
        <ul>
          <li>The Sun contains 99.86% of the mass in the solar system</li>
          <li>Jupiter has the shortest day of all the planets, rotating once every 9.8 hours</li>
          <li>Venus is the hottest planet in our solar system with an average temperature of 462°C (864°F)</li>
          <li>Saturn's rings are made up of ice particles, with a small amount of dust and debris</li>
          <li>A year on Neptune lasts 165 Earth years</li>
          <li>Pluto was reclassified from a planet to a dwarf planet in 2006</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
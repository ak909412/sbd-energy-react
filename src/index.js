// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import AboutPage from './pages/about';
import ContactPage from './pages/Contact';
import AwardsPage from './pages/Award';
import Solar from './Servicers/Solar';
import Water from './Servicers/Water';
import ITAutomation from './Servicers/It';
import EVCharging from './Servicers/ev';
import BrandingAdvertising from './Servicers/branding'
import FilmProduction from './Servicers/film'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/awards" element={<AwardsPage />} />
        <Route path="/solar" element={<Solar />} />
        <Route path="/water" element={<Water />} />
        <Route path="/it" element={<ITAutomation />} />
        <Route path="/ev" element={<EVCharging />} />
        <Route path="/branding" element={<BrandingAdvertising />} />
        <Route path="/film" element={<FilmProduction />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
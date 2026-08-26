import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Technology from './pages/Technology';
import HowItWorks from './pages/HowItWorks';
import Preprocessing from './pages/Preprocessing';
import Analyze from './pages/Analyze';
import Metrics from './pages/Metrics';
import History from './pages/History';
import About from './pages/About';
import Contact from './pages/Contact';
import Datasets from './pages/Datasets';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`app-wrapper ${isHomePage ? 'home-no-scroll' : ''}`} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/datasets" element={<Datasets />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/dashboard" element={<Metrics />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/preprocessing" element={<Preprocessing />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

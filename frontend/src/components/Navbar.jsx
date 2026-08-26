import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Activity, Menu, X, ArrowRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/analyze', label: 'Detection Studio' },
    { to: '/technology', label: 'Technology' },
    { to: '/metrics', label: 'Metrics' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="site-navbar">
      <div className="content-container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-wrapper">
            <Activity size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>NeuroScan AI</span>
              <span style={{
                fontSize: '0.65rem',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-cyan-glow)',
                color: 'var(--accent-cyan)',
                border: '1px solid var(--border-medium)',
                fontFamily: 'JetBrains Mono',
                fontWeight: 700
              }}>
                CLINICAL AI
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="navbar-actions">
          <ThemeToggle />

          <Link to="/analyze" className="btn btn-primary btn-sm desktop-auth">
            <span>Analyze MRI</span>
            <ArrowRight size={15} />
          </Link>

          {/* Mobile menu trigger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              style={{ display: 'block', padding: '0.65rem 0.5rem' }}
            >
              {link.label}
            </NavLink>
          ))}

          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <Link to="/analyze" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary w-full" style={{ width: '100%', justifyContent: 'center' }}>
              <span>Analyze MRI</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

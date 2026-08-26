import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="content-container" style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
        <div className="footer-grid">
          {/* Column 1: Architecture */}
          <div className="footer-col">
            <h4>Architecture</h4>
            <ul className="footer-links">
              <li><Link to="/technology#pdscnn" className="footer-link">PDSCNN Branch (256d)</Link></li>
              <li><Link to="/technology#vit" className="footer-link">Vision Transformer (ViT)</Link></li>
              <li><Link to="/technology#fusion" className="footer-link">Feature Concatenation</Link></li>
              <li><Link to="/technology#rrelm" className="footer-link">RRELM Classifier</Link></li>
              <li><Link to="/preprocessing" className="footer-link">CLAHE Enhancement (224×224)</Link></li>
            </ul>
          </div>

          {/* Column 2: Research & Datasets */}
          <div className="footer-col">
            <h4>Research & Data</h4>
            <ul className="footer-links">
              <li><Link to="/datasets" className="footer-link">Download Datasets</Link></li>
              <li><Link to="/metrics" className="footer-link">Model Metrics & Curves</Link></li>
              <li><Link to="/metrics#confusion" className="footer-link">Confusion Matrix</Link></li>
              <li><Link to="/about" className="footer-link">Clinical Overview</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li><Link to="/analyze" className="footer-link">Analyze Scan Studio</Link></li>
              <li><Link to="/metrics" className="footer-link">Performance Dashboard</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Support</Link></li>
              <li><Link to="/history" className="footer-link">Scan History</Link></li>
            </ul>
          </div>
        </div>

        {/* Centered Footer Bottom */}
        <div className="footer-bottom" style={{ justifyContent: 'center', textAlign: 'center', gap: '0.75rem' }}>
          <span>© {new Date().getFullYear()} NeuroScan AI • Clinical Decision Support System • Parallel CNN–ViT + RRELM</span>
        </div>
      </div>
    </footer>
  );
}

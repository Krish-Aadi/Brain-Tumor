import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layers, Eye, Activity, ShieldCheck, Cpu } from 'lucide-react';

export default function Home() {
  return (
    <div className="home-hero-page">
      {/* Dynamic Floating Aurora Ambient Orbs */}
      <div
        className="home-glow-orb"
        style={{
          top: '10%',
          left: '12%',
          width: '380px',
          height: '380px',
          background: 'rgba(6, 182, 212, 0.28)'
        }}
      />
      <div
        className="home-glow-orb"
        style={{
          top: '15%',
          right: '10%',
          width: '420px',
          height: '420px',
          background: 'rgba(99, 102, 241, 0.32)',
          animationDelay: '-4s'
        }}
      />
      <div
        className="home-glow-orb"
        style={{
          bottom: '10%',
          left: '45%',
          width: '360px',
          height: '360px',
          background: 'rgba(168, 85, 247, 0.22)',
          animationDelay: '-7s'
        }}
      />

      <div className="content-container" style={{ position: 'relative', zIndex: 1, maxWidth: '980px', margin: '0 auto' }}>
        {/* Top Tag */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div className="home-badge-tag">
            <Sparkles size={15} style={{ color: 'var(--accent-cyan)' }} />
            <span>Parallel Deep Learning & Explainable AI</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5.2vw, 4.2rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          marginBottom: '1.5rem',
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)'
        }}>
          Advanced <span className="home-gradient-text">Brain Tumor</span> Detection &amp; Classification
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 1.35vw, 1.18rem)',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          maxWidth: '780px',
          margin: '0 auto 2.5rem'
        }}>
          Harnessing <strong>Parallel Depthwise Separable CNNs</strong> and <strong>Vision Transformers</strong> with an analytical <strong>Regularized Ridge Regression ELM</strong> for transparent, 4-class brain MRI classification and explainability.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', justifyContent: 'center', marginBottom: '3.25rem' }}>
          <Link to="/analyze" className="home-btn-primary">
            <span>Start Detection</span>
            <ArrowRight size={18} />
          </Link>

          <Link to="/technology" className="home-btn-secondary">
            <span>Learn the Architecture</span>
          </Link>
        </div>

        {/* Feature Highlights Row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1.25rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div className="home-highlight-pill">
            <Layers size={16} style={{ color: '#38bdf8' }} />
            <span>4-Class Detection</span>
          </div>

          <div className="home-highlight-pill">
            <Eye size={16} style={{ color: '#22c55e' }} />
            <span>Grad-CAM + ViT XAI</span>
          </div>

          <div className="home-highlight-pill">
            <Activity size={16} style={{ color: '#818cf8' }} />
            <span>124 × 124 CLAHE</span>
          </div>

          <div className="home-highlight-pill">
            <ShieldCheck size={16} style={{ color: '#f59e0b' }} />
            <span>RRELM (C=0.1)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

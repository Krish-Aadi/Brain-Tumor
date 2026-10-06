import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Eye, ShieldCheck, Layers, Activity } from 'lucide-react';

export default function Hero({ onStartDetectionClick }) {
  return (
    <section className="hero-section" style={{
      padding: '5.5rem 0 4.5rem',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-main) 100%)',
      textAlign: 'center'
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '450px',
        background: 'radial-gradient(circle, var(--accent-cyan-glow) 0%, rgba(99, 102, 241, 0.06) 40%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="content-container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
        <div className="section-tag" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
          <Sparkles size={14} />
          <span>Parallel Deep Learning & Explainable AI</span>
        </div>

        <h1 style={{
          fontSize: '3.6rem',
          fontWeight: 900,
          lineHeight: 1.15,
          marginBottom: '1.5rem',
          letterSpacing: '-0.03em'
        }}>
          Advanced <span style={{
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #38bdf8 50%, var(--accent-indigo) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Brain Tumor</span> Detection & Classification
        </h1>

        <p style={{
          fontSize: '1.18rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
          maxWidth: '740px',
          margin: '0 auto 2.5rem'
        }}>
          Harnessing <strong>Parallel Depthwise Separable CNNs</strong> and <strong>Vision Transformers</strong> with a <strong>5-Seed Bagging Ensemble Regularized Ridge ELM (97.68% CV Accuracy)</strong> for transparent, 4-class brain MRI classification and explainability.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
          {onStartDetectionClick ? (
            <button
              type="button"
              onClick={onStartDetectionClick}
              className="btn btn-primary"
              style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}
            >
              <span>Start Detection</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <Link to="/analyze" className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
              <span>Start Detection</span>
              <ArrowRight size={18} />
            </Link>
          )}

          <Link to="/technology" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            <span>Learn the Architecture</span>
          </Link>
        </div>

        {/* Micro badges row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>4-Class Detection</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={16} style={{ color: 'var(--accent-teal)' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Grad-CAM + ViT XAI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} style={{ color: 'var(--accent-blue)' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>124 × 124 CLAHE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--accent-indigo)' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>5-Seed Ensemble RRELM (97.68%)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

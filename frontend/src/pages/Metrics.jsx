import React from 'react';
import { Link } from 'react-router-dom';
import MetricsDashboard from '../components/MetricsDashboard';
import { Activity, ArrowRight, BookOpen, Layers, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

export default function Metrics() {
  return (
    <div className="metrics-page">
      {/* Header Banner */}
      <div className="page-header-banner">
        <div className="content-container">
          <div className="section-tag">Empirical Evaluation & Performance</div>
          <h1 className="section-title">Model Metrics & Research Analytics</h1>
          <p className="section-subtitle">
            Comprehensive quantitative analysis of the <strong>Parallel PDSCNN + Vision Transformer + RRELM</strong> architecture evaluated across <strong>13,994 multi-center brain MRI scans</strong> with 5-Fold Stratified Cross-Validation (<strong>98.05% ±0.16%</strong>).
          </p>
        </div>
      </div>

      {/* Main Metrics Content */}
      <div className="content-container page-section" style={{ paddingTop: 0 }}>
        {/* Core Metrics & Training Charts Dashboard Component */}
        <MetricsDashboard />

        {/* Dataset Breakdown & Experimental Protocol */}
        <div style={{ marginTop: '3.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Database size={20} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '1.25rem' }}>Dataset Scale & 5-Fold Splitting</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Multi-center stratified partitioning across 5 independent folds strictly avoiding slice leakage, with balanced 3,000 scans per class.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                <span>Glioma Scans (Balanced):</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--color-glioma)' }}>3,000 Scans (Prec: 98.05%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                <span>Meningioma Scans (Balanced):</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--color-meningioma)' }}>3,000 Scans (Prec: 97.95%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                <span>Pituitary Scans (Balanced):</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--color-pituitary)' }}>3,000 Scans (Prec: 99.24%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                <span>Healthy Control Scans (Balanced):</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--color-notumor)' }}>3,000 Scans (Rec: 99.80%)</span>
              </div>
            </div>
          </div>

          <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Layers size={20} style={{ color: 'var(--accent-teal)' }} />
              <h3 style={{ fontSize: '1.25rem' }}>Inference & Latency Profile</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Due to the analytical closed-form solution of the RRELM classification layer, test-time inference achieves real-time responsiveness.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'Outfit' }}>~1.8s</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>End-to-End Latency</div>
              </div>
              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-indigo)', fontFamily: 'Outfit' }}>CPU / GPU</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Device Compatibility</div>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/analyze" className="btn btn-primary w-full" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Test Live MRI Scan</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

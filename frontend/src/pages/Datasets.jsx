import React from 'react';
import { 
  Database, 
  DownloadCloud, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  HardDrive,
  FileCode2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Datasets() {
  const datasets = [
    {
      id: 'nickparvar',
      title: 'Masoud Nickparvar Brain Tumor MRI Dataset',
      source: 'Kaggle Dataset Repository',
      scanCount: '7,023 T1 MRI Scans',
      classes: '4 Classes (Glioma, Meningioma, Pituitary, Healthy)',
      resolution: 'Standardized 124 × 124 CLAHE',
      description: 'Primary benchmark dataset containing curated high-resolution axial and coronal cranial MRI scans across 4 pathological states with robust anatomical margin contrast.',
      downloadUrl: 'https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset',
      badge: 'Primary Benchmark'
    },
    {
      id: 'bhuvaji',
      title: 'Sartaj Bhuvaji Brain Tumor Classification Dataset',
      source: 'Kaggle Dataset Repository',
      scanCount: '3,264 T1 MRI Scans',
      classes: '4 Classes (Glioma, Meningioma, Pituitary, Normal)',
      resolution: 'Multi-institutional acquisition',
      description: 'Widely cited multi-institutional brain MRI collection used for cross-validation and feature generalization across diverse MRI scanner profiles.',
      downloadUrl: 'https://www.kaggle.com/datasets/sartajbhuvaji/brain-tumor-classification-mri',
      badge: 'Multi-Center Validation'
    },
    {
      id: 'merged-cohort',
      title: 'NeuroScan Standardized 13,994 Cohort',
      source: 'Harmonized Research Pipeline',
      scanCount: '13,994 Total Scans (12,000 Train + 1,994 Test)',
      classes: '100% Balanced (3,000 scans per class in training)',
      resolution: 'CLAHE Enhanced (124 × 124 × 3)',
      description: 'Fully deduplicated, contrast-normalized, and class-balanced dataset produced by our preprocessing pipeline with zero train-test data leakage.',
      downloadUrl: 'https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset',
      badge: 'Balanced & Deduplicated',
      isLocalPipeline: true
    }
  ];

  return (
    <div className="datasets-page" style={{ padding: '3.5rem 0 5rem' }}>
      <div className="content-container" style={{ maxWidth: '1040px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-tag" style={{ marginBottom: '0.75rem' }}>
            Open Science & Data
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Brain Tumor MRI Datasets
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Download and explore the standardized multi-class brain MRI datasets utilized for training, cross-validation, and empirical testing of the NeuroScan AI model.
          </p>
        </div>

        {/* Dataset Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '3.5rem' }}>
          {datasets.map((ds) => (
            <div
              key={ds.id}
              className="card-panel"
              style={{
                background: 'var(--bg-surface)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid var(--border-medium)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(6, 182, 212, 0.12)',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Database size={22} />
                  </div>
                  <div>
                    <div style={{
                      display: 'inline-block',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      background: 'rgba(56, 189, 248, 0.12)',
                      color: 'var(--accent-cyan)',
                      marginBottom: '0.3rem'
                    }}>
                      {ds.badge}
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {ds.title}
                    </h3>
                  </div>
                </div>

                <a
                  href={ds.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  <DownloadCloud size={16} />
                  <span>Download on Kaggle</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {ds.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <HardDrive size={15} style={{ color: 'var(--accent-cyan)' }} />
                  <span><strong>Scale:</strong> {ds.scanCount}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Layers size={15} style={{ color: 'var(--accent-teal)' }} />
                  <span><strong>Classes:</strong> {ds.classes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <ShieldCheck size={15} style={{ color: 'var(--accent-indigo)' }} />
                  <span><strong>Format:</strong> {ds.resolution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick CLI Auto-Download Guide */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>
            <FileCode2 size={22} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Automated Script Download via Kaggle API
            </h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            You can automatically fetch, extract, and balance the complete 13,994 MRI dataset using the repository's built-in Python helper script:
          </p>
          <div style={{
            background: 'var(--bg-card)',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.88rem',
            color: 'var(--accent-cyan)',
            border: '1px solid var(--border-subtle)',
            overflowX: 'auto'
          }}>
            <code>python download_dataset.py</code>
          </div>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/analyze" className="btn btn-secondary">
            <span>Return to Detection Studio</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

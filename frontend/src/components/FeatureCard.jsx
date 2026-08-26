import React from 'react';
import { GitFork, Maximize2, Cpu, Eye, BookMarked } from 'lucide-react';

const FEATURES = [
  {
    icon: GitFork,
    title: "Parallel Feature Extraction",
    description: "Simultaneous dual-stream extraction combining convolution-based local feature maps with self-attention transformer representations.",
    accent: "var(--accent-cyan)"
  },
  {
    icon: Maximize2,
    title: "Local + Global Representation",
    description: "PDSCNN captures fine boundary textures and micro-structures while ViT models long-range spatial context across 124 × 124 patches.",
    accent: "var(--accent-indigo)"
  },
  {
    icon: Cpu,
    title: "RRELM Classification",
    description: "Regularized Ridge Regression Extreme Learning Machine provides ultra-fast, analytically solved decision boundaries with L2 stabilization.",
    accent: "var(--accent-teal)"
  },
  {
    icon: Eye,
    title: "Explainable Predictions",
    description: "Dual XAI mechanisms: Grad-CAM for CNN convolutional layer heatmaps and ViT multi-head self-attention maps for transparency.",
    accent: "var(--accent-blue)"
  },
  {
    icon: BookMarked,
    title: "Research-Oriented Architecture",
    description: "Designed for rigorous academic evaluation across multi-center benchmark datasets, patient-wise splitting, and focal loss training.",
    accent: "#f59e0b"
  }
];

export default function FeatureCard() {
  return (
    <section className="page-section" style={{ background: 'var(--bg-surface)' }}>
      <div className="content-container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-tag">Core Technical Pillars</div>
          <h2 className="section-title">Architectural Highlights</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Engineered to overcome the limitations of isolated CNN or standalone Transformer models in medical neuroimaging.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}>
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="card-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: feat.accent
                }}>
                  <Icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.65rem' }}>{feat.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, flexGrow: 1 }}>
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

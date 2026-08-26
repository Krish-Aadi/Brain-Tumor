import React from 'react';
import { Upload, Sliders, Cpu, Eye, Binary, ShieldCheck, Sparkles } from 'lucide-react';

const STEPS = [
  {
    num: "01",
    title: "MRI Upload",
    desc: "Acquire DICOM or high-resolution PNG/JPG T1-weighted axial/coronal/sagittal brain MRI scan.",
    icon: Upload,
    accent: "var(--accent-cyan)"
  },
  {
    num: "02",
    title: "CLAHE Preprocessing",
    desc: "Resize to 224 × 224 resolution and apply Contrast-Limited Adaptive Histogram Equalization.",
    icon: Sliders,
    accent: "var(--accent-teal)"
  },
  {
    num: "03",
    title: "PDSCNN Extraction",
    desc: "Parallel Depthwise Separable CNN branch extracts 256-d local spatial micro-textures.",
    icon: Cpu,
    accent: "var(--accent-blue)"
  },
  {
    num: "04",
    title: "ViT Global Extraction",
    desc: "Vision Transformer partitions MRI into patches and computes multi-head self-attention.",
    icon: Sparkles,
    accent: "var(--accent-indigo)"
  },
  {
    num: "05",
    title: "Feature Fusion",
    desc: "Concatenate local spatial vectors and global contextual tokens into a unified 384-d descriptor.",
    icon: Binary,
    accent: "#ec4899"
  },
  {
    num: "06",
    title: "RRELM Classification",
    desc: "Analytical Ridge Regression ELM applies L2-regularized pseudo-inverse projection for fast inference.",
    icon: ShieldCheck,
    accent: "#f59e0b"
  },
  {
    num: "07",
    title: "Prediction & XAI",
    desc: "Output 4-class probabilities alongside Grad-CAM heatmaps and ViT attention maps.",
    icon: Eye,
    accent: "var(--color-notumor)"
  }
];

export default function Workflow() {
  return (
    <section className="page-section" style={{ background: 'var(--bg-main)' }}>
      <div className="content-container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-tag">End-to-End Pipeline</div>
          <h2 className="section-title">How NeuroScan AI Works</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            A transparent 7-stage analytical pipeline engineered for medical imaging researchers and faculty evaluators.
          </p>
        </div>

        {/* Steps Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          position: 'relative'
        }}>
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="card-panel"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: `3px solid ${step.accent}`
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: step.accent
                  }}>
                    {step.num}
                  </span>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step.accent
                  }}>
                    <Icon size={18} />
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

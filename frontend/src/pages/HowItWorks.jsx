import React from 'react';
import Workflow from '../components/Workflow';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import { ArrowRight, Brain, Sliders, Cpu, Sparkles, Binary, ShieldCheck, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div className="how-it-works-page">
      <div className="page-header-banner">
        <div className="content-container">
          <div className="section-tag">Methodology & Execution</div>
          <h1 className="section-title">End-to-End Diagnostic Pipeline</h1>
          <p className="section-subtitle">
            A comprehensive, step-by-step walkthrough of how raw brain MRI scans transition through contrast enhancement, dual-branch local and global feature extraction, concatenation, and regularized classification.
          </p>
        </div>
      </div>

      <div className="content-container page-section" style={{ paddingTop: 0 }}>
        {/* Workflow Summary Grid */}
        <div style={{ marginBottom: '4rem' }}>
          <Workflow />
        </div>

        {/* Detailed Breakdown for each stage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginBottom: '4rem' }}>
          <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>01</div>
              <h3 style={{ fontSize: '1.3rem' }}>MRI Input Acquisition & Verification</h3>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              The system receives standard clinical cranial MRI slices (axial, coronal, or sagittal orientations). The input image is converted to a 3-channel RGB format and checked for dimension integrity and corrupted pixel artifacts before passing to preprocessing.
            </p>
          </div>

          <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-teal)' }}>02</div>
              <h3 style={{ fontSize: '1.3rem' }}>CLAHE Contrast Normalization</h3>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Raw MRI scans frequently suffer from scanner-specific bias fields and low soft-tissue contrast. Contrast-Limited Adaptive Histogram Equalization (CLAHE) is computed across localized 8×8 contextual tiles with a clip limit of 2.0. The output is standardized to 224 × 224 spatial resolution and normalized to [0, 1] floating-point tensors.
            </p>
          </div>

          <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-blue)' }}>03 & 04</div>
              <h3 style={{ fontSize: '1.3rem' }}>Parallel Feature Extraction (PDSCNN + ViT)</h3>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              The preprocessed scan simultaneously branches into two parallel backbones:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li><strong>PDSCNN Branch:</strong> Applies 4 hierarchical depthwise separable convolutional stages, producing a 256-dimensional local spatial feature vector.</li>
              <li><strong>ViT Branch:</strong> Partitions the 224 × 224 image into 16 × 16 patches (196 tokens), passing them through 8 multi-head self-attention transformer blocks to extract a 128-dimensional global contextual vector.</li>
            </ul>
          </div>

          <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.2rem', fontWeight: 800, color: '#ec4899' }}>05</div>
              <h3 style={{ fontSize: '1.3rem' }}>Concatenation & Fusion Layer</h3>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              The two representation streams are joined along the feature channel dimension:
              <br />
              <code style={{ display: 'inline-block', marginTop: '0.5rem', padding: '4px 10px', background: 'var(--bg-main)', borderRadius: '4px', color: '#ec4899' }}>
                F_fused = [F_local(256d) || F_global(128d)] → Total: 384 Dimensions
              </code>
            </p>
          </div>

          <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>06 & 07</div>
              <h3 style={{ fontSize: '1.3rem' }}>RRELM Output & Explainable AI (XAI)</h3>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              The 384-dimensional fused vector is projected into 4096 hidden projection neurons and multiplied by the pre-solved Ridge Regularized matrix <code>β</code>. The resulting softmax logits yield 4-class probabilities (Glioma, Meningioma, Pituitary, Healthy Control), while Grad-CAM gradients and ViT attention maps are synthesized simultaneously for explainability.
            </p>
          </div>
        </div>

        {/* CTA to run analysis */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/analyze" className="btn btn-primary" style={{ padding: '0.9rem 2rem' }}>
            <span>Test the Pipeline on an MRI Scan</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

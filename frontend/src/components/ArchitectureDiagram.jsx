import React, { useState } from 'react';
import { Brain, Sliders, Cpu, Sparkles, Binary, ShieldCheck, Layers, Info, CheckCircle2, ChevronRight } from 'lucide-react';

const NODES = {
  mri: {
    id: 'mri',
    title: 'Raw MRI Input (124 × 124)',
    type: 'Input Acquisition',
    accent: 'var(--accent-cyan)',
    formula: 'X ∈ ℝ²²⁴ ˣ ²²⁴ ˣ ³',
    summary: 'The network accepts high-resolution T1-weighted contrast-enhanced brain MRI scans resized to standard 124 × 124 pixel dimension.',
    details: [
      'Standardized 124 × 124 spatial resolution preserves micro-structures and lesion borders.',
      'Supports axial, sagittal, and coronal cranial planes.',
      '3-channel RGB representation compatible with hybrid convolutional and patch transformer backbones.'
    ]
  },
  clahe: {
    id: 'clahe',
    title: 'CLAHE Contrast Enhancement',
    type: 'Image Preprocessing',
    accent: 'var(--accent-teal)',
    formula: 'g(x,y) = ClipLimit(HistogramEqualize(f(x,y)))',
    summary: 'Contrast-Limited Adaptive Histogram Equalization prevents over-amplification of noise while highlighting low-contrast tumor tissue margins.',
    details: [
      'Operates on localized contextual 8×8 pixel tiles across the scan.',
      'Clips histogram peaks at clipLimit=2.0 to curb sensor noise and background artifacts.',
      'Significantly improves lesion boundary discernment for both CNN kernel filters and ViT patch embeddings.'
    ]
  },
  pdscnn: {
    id: 'pdscnn',
    title: 'Parallel Depthwise Separable CNN (PDSCNN)',
    type: 'Local Feature Extraction',
    accent: 'var(--accent-blue)',
    formula: 'F_local = PDSCNN(X_CLAHE) ∈ ℝ²⁵⁶',
    summary: 'Extracts fine-grained spatial textures, lesion contours, and sharp local intensity variations using parameter-efficient depthwise separable convolutions.',
    details: [
      '4-stage hierarchical depthwise separable convolutional blocks with GELU activation.',
      'Drastically reduces computational FLOPs and parameter footprint compared to standard 2D convolutions.',
      'Yields a compact 256-dimensional spatial representation vector F_local.'
    ]
  },
  vit: {
    id: 'vit',
    title: 'Vision Transformer (ViT Branch)',
    type: 'Global Context Extraction',
    accent: 'var(--accent-indigo)',
    formula: 'Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k) · V',
    summary: 'Processes non-overlapping image patches to capture long-range semantic dependencies and anatomical contextual symmetry throughout the brain.',
    details: [
      'Splits 124 × 124 MRI into 16 × 16 pixel patches with 1D learnable position embeddings.',
      '8 multi-head self-attention (MHSA) transformer encoder blocks.',
      'Produces a 128-dimensional global contextual representation vector F_global.'
    ]
  },
  fusion: {
    id: 'fusion',
    title: 'Concatenated Feature Fusion',
    type: 'Representation Integration',
    accent: '#ec4899',
    formula: 'F_fused = [F_local ‖ F_global] ∈ ℝ³⁸⁴',
    summary: 'Direct concatenation seamlessly couples complementary local texture descriptions with broad global context into a rich 384-dimensional descriptor.',
    details: [
      'Dimension: 256 (PDSCNN) + 128 (ViT) = 384 fused features per MRI scan.',
      'Retains fine boundary fidelity without losing global intracranial structural awareness.',
      'Eliminates feature loss often caused by simple element-wise summation or pooling.'
    ]
  },
  rrelm: {
    id: 'rrelm',
    title: '5-Seed Bagging Ensemble Regularized Ridge ELM',
    type: 'Output Classification Engine',
    accent: '#f59e0b',
    formula: 'β_k = (H_kᵀ·H_k + C·I)⁻¹ · H_kᵀ·T,  k ∈ Seeds(5), C = 0.1',
    summary: 'Replaces conventional slow iterative backpropagation dense layers with an analytically computed 5-Seed Bagging Ensemble Ridge-Regularized Extreme Learning Machine.',
    details: [
      '5 independent Kaiming-scaled random projection heads (8,192 hidden neurons each, total 40,960 projection neurons).',
      'Ridge regularization parameter C=0.1 penalizes extreme weight magnitudes to prevent overfitting.',
      'Soft-voting probability aggregation across seeds achieves 97.68% (±0.24%) 5-fold CV accuracy with zero backpropagation parameter overhead.'
    ]
  },
  classes: {
    id: 'classes',
    title: '4-Class Classification & Explainability',
    type: 'Final Output & Decision',
    accent: 'var(--color-notumor)',
    formula: 'ŷ = argmax_c P(y=c | x),  c ∈ {1, 2, 3, 4}',
    summary: 'Calculates normalized softmax probability distributions across the 4 clinical categories along with Grad-CAM and ViT attention maps.',
    details: [
      'Glioma: High-grade invasive neuroglial cellular neoplasms.',
      'Meningioma: Dural-based extra-axial meningeal neoplasms.',
      'Pituitary: Sellar / suprasellar endocrine gland neoplasms.',
      'No Tumor: Healthy control scans with normal ventricular & parenchymal anatomy.'
    ]
  }
};

export default function ArchitectureDiagram() {
  const [selectedNodeId, setSelectedNodeId] = useState('pdscnn');
  const activeNode = NODES[selectedNodeId];

  return (
    <div className="card-panel" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Side: Visual Node Pipeline Hierarchy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Info size={14} /> Click any architecture block to inspect technical specifications:
          </div>

          {/* Node 1: Input MRI */}
          <div
            className={`arch-node ${selectedNodeId === 'mri' ? 'active-node' : ''}`}
            onClick={() => setSelectedNodeId('mri')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Brain size={18} style={{ color: 'var(--accent-cyan)' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Raw Brain MRI Scan</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Input Resolution: 124 × 124 × 3</div>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          {/* Node 2: CLAHE */}
          <div
            className={`arch-node ${selectedNodeId === 'clahe' ? 'active-node' : ''}`}
            onClick={() => setSelectedNodeId('clahe')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Sliders size={18} style={{ color: 'var(--accent-teal)' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>CLAHE Preprocessing</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contrast-Limited Adaptive Histogram Equalization</div>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          {/* Parallel Branch Split */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {/* Branch 1: PDSCNN */}
            <div
              className={`arch-node ${selectedNodeId === 'pdscnn' ? 'active-node' : ''}`}
              onClick={() => setSelectedNodeId('pdscnn')}
              style={{ borderLeft: '3px solid var(--accent-blue)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                <Cpu size={16} style={{ color: 'var(--accent-blue)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>PDSCNN Branch</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Local Spatial Textures
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: 'var(--accent-blue)' }}>
                256-d local features
              </div>
            </div>

            {/* Branch 2: ViT */}
            <div
              className={`arch-node ${selectedNodeId === 'vit' ? 'active-node' : ''}`}
              onClick={() => setSelectedNodeId('vit')}
              style={{ borderLeft: '3px solid var(--accent-indigo)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                <Sparkles size={16} style={{ color: 'var(--accent-indigo)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>ViT Branch</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Patch Self-Attention
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: 'var(--accent-indigo)' }}>
                128-d global features
              </div>
            </div>
          </div>

          {/* Node 3: Feature Fusion */}
          <div
            className={`arch-node ${selectedNodeId === 'fusion' ? 'active-node' : ''}`}
            onClick={() => setSelectedNodeId('fusion')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Binary size={18} style={{ color: '#ec4899' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Concatenated Feature Fusion</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vector Union: [256d + 128d] = 384d</div>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          {/* Node 4: RRELM */}
          <div
            className={`arch-node ${selectedNodeId === 'rrelm' ? 'active-node' : ''}`}
            onClick={() => setSelectedNodeId('rrelm')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck size={18} style={{ color: '#f59e0b' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>5-Seed Ensemble RRELM</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bagging Ensemble ELM (5 Heads, C=0.1)</div>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          {/* Node 5: 4 Classes Output */}
          <div
            className={`arch-node ${selectedNodeId === 'classes' ? 'active-node' : ''}`}
            onClick={() => setSelectedNodeId('classes')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Layers size={18} style={{ color: 'var(--color-notumor)' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>4-Class Prediction + XAI</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Glioma • Meningioma • Pituitary • No Tumor</div>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* Right Side: Detailed Technical Inspector Panel */}
        <div style={{
          background: 'var(--bg-surface)',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-medium)',
          minHeight: '420px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: activeNode.accent,
              marginBottom: '0.75rem'
            }}>
              {activeNode.type}
            </div>

            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              {activeNode.title}
            </h3>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {activeNode.summary}
            </p>

            {/* Formula Block */}
            <div style={{
              background: 'var(--bg-input)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.82rem',
              color: 'var(--accent-cyan)',
              marginBottom: '1.25rem',
              overflowX: 'auto'
            }}>
              {activeNode.formula}
            </div>

            {/* Technical Bullet Points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {activeNode.details.map((detail, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <CheckCircle2 size={15} style={{ color: activeNode.accent, flexShrink: 0, marginTop: '3px' }} />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>NeuroScan AI Parallel Pipeline</span>
            <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)' }}>Stage {Object.keys(NODES).indexOf(selectedNodeId) + 1} of 7</span>
          </div>
        </div>
      </div>
    </div>
  );
}

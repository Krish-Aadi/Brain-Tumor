import React from 'react';
import { Cpu, Sparkles, Binary, ShieldCheck, Sliders, Layers, CheckCircle2, Info, ArrowDown, Target } from 'lucide-react';
import ArchitectureDiagram from '../components/ArchitectureDiagram';

export default function Technology() {
  return (
    <div className="technology-page">
      {/* Page Header */}
      <div className="page-header-banner">
        <div className="content-container">
          <div className="section-tag">Machine Learning Architecture</div>
          <h1 className="section-title">Core Technology & Mathematical Formulations</h1>
          <p className="section-subtitle">
            A comprehensive technical breakdown of the Parallel Depthwise Separable CNN and Vision Transformer fusion network with Regularized Extreme Learning Machine classification.
          </p>
        </div>
      </div>

      <div className="content-container page-section" style={{ paddingTop: 0 }}>
        {/* Full Interactive Architecture Diagram */}
        <div style={{ marginBottom: '4.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Pipeline Architecture Map</h2>
          <ArchitectureDiagram />
        </div>

        {/* Deep Dive Section 1: PDSCNN */}
        <section id="pdscnn" className="card-panel" style={{ marginBottom: '3rem', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(56, 189, 248, 0.1)',
              color: 'var(--accent-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cpu size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 700 }}>LOCAL SPATIAL STREAM</div>
              <h2 style={{ fontSize: '1.6rem' }}>Parallel Depthwise Separable CNN (PDSCNN)</h2>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            The PDSCNN branch is dedicated to capturing localized morphological signatures, including lesion margins, intratumoral heterogeneity, vascular enhancement patterns, and hyperintense necrotic cores. Rather than using conventional high-parameter 2D convolutions, the architecture uses <strong>depthwise separable convolutions</strong> to decouple spatial filtering from channel projection.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>1. Depthwise Convolution</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Applies a single convolutional kernel per input channel independently to capture spatial relationships without inter-channel mixing:
              </p>
              <div className="mono-font" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginTop: '0.5rem' }}>
                FLOPs = D_K × D_K × M × D_F × D_F
              </div>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>2. Pointwise Projection (1×1)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Computes linear combinations across all feature channels, producing the compact <strong>256-dimensional</strong> local feature descriptor vector:
              </p>
              <div className="mono-font" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginTop: '0.5rem' }}>
                F_local ∈ ℝ²⁵⁶
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-blue)' }} />
              <span>Yields high computational efficiency with ~80% reduction in trainable parameters compared to standard convolutional backbones.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-blue)' }} />
              <span>Forms the direct target for Grad-CAM gradient backpropagation for explainability heatmaps.</span>
            </div>
          </div>
        </section>

        {/* Deep Dive Section 2: Vision Transformer */}
        <section id="vit" className="card-panel" style={{ marginBottom: '3rem', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--accent-indigo)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-indigo)', fontWeight: 700 }}>GLOBAL CONTEXT STREAM</div>
              <h2 style={{ fontSize: '1.6rem' }}>Vision Transformer (ViT Branch)</h2>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            While convolutional filters excel at high-frequency local textures, they inherently suffer from a restricted receptive field in early stages. The Vision Transformer branch treats the 124 × 124 MRI as a sequence of discrete patches, calculating all-to-all attention to establish global anatomical symmetry between cerebral hemispheres.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent-indigo)' }}>Patch Embedding (16 × 16)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Flattens the 124 × 124 MRI into N = (224/16)² = 64 sequential patch tokens, prepended with a learnable <code>[CLS]</code> classification token and 1D positional encodings.
              </p>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent-indigo)' }}>Multi-Head Self-Attention (MHSA)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                8 parallel self-attention heads compute dynamic affinity matrices across all intracranial regions, outputting a <strong>128-dimensional</strong> global contextual vector:
              </p>
              <div className="mono-font" style={{ fontSize: '0.85rem', color: 'var(--accent-indigo)', marginTop: '0.5rem' }}>
                Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k) · V
              </div>
            </div>
          </div>
        </section>

        {/* Deep Dive Section 3: 124 x 124 Resolution & Fusion */}
        <section id="fusion" className="card-panel" style={{ marginBottom: '3rem', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(236, 72, 153, 0.1)',
              color: '#ec4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Binary size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#ec4899', fontWeight: 700 }}>REPRESENTATION INTEGRATION</div>
              <h2 style={{ fontSize: '1.6rem' }}>124 × 124 Input & Concatenated Feature Fusion</h2>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            The current proposed configuration adopts <strong>124 × 124 MRI input resolution</strong>. Compared to smaller downscaled resolutions (e.g. 124 × 124), the 124 × 124 spatial canvas provides substantially richer sub-millimeter anatomical detail, enabling cleaner patch boundaries in ViT and finer spatial gradients in PDSCNN.
          </p>

          {/* Fusion Visual Formula */}
          <div style={{
            background: 'var(--bg-main)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ padding: '0.65rem 1.25rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--accent-blue)', borderRadius: 'var(--radius-md)', fontFamily: 'JetBrains Mono', color: 'var(--accent-blue)' }}>
                PDSCNN Features: 256-d
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-muted)' }}>+</span>
              <div style={{ padding: '0.65rem 1.25rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--accent-indigo)', borderRadius: 'var(--radius-md)', fontFamily: 'JetBrains Mono', color: 'var(--accent-indigo)' }}>
                ViT Features: 128-d
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-muted)' }}>=</span>
              <div style={{ padding: '0.65rem 1.25rem', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid #ec4899', borderRadius: 'var(--radius-md)', fontFamily: 'JetBrains Mono', color: '#ec4899', fontWeight: 700 }}>
                Fused Vector: 384-d
              </div>
            </div>
          </div>
        </section>

        {/* Deep Dive Section 4: RRELM */}
        <section id="rrelm" className="card-panel" style={{ marginBottom: '3rem', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>ANALYTICAL CLASSIFIER</div>
              <h2 style={{ fontSize: '1.6rem' }}>Regularized Ridge Regression ELM (RRELM)</h2>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Rather than relying on iterative gradient descent with backpropagation in the classification head, the fused 384-dimensional features are mapped into a high-dimensional feature space (8192 hidden projection neurons) and solved analytically via <strong>Tikhonov (L2) Regularized Ridge Regression</strong>.
          </p>

          <div style={{
            background: 'var(--bg-input)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)',
            fontFamily: 'JetBrains Mono',
            fontSize: '0.95rem',
            color: 'var(--accent-cyan)',
            marginBottom: '1.5rem',
            overflowX: 'auto'
          }}>
            β = (Hᵀ·H + C·I)⁻¹ · Hᵀ·T
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Where <code>H</code> is the hidden-layer randomized projection matrix, <code>T</code> is the one-hot target matrix, and <code>C = 0.05</code> is the ridge regularization penalty coefficient that prevents singular inversion and stabilizes generalized decision boundaries.
          </p>
        </section>

        {/* Deep Dive Section 5: Focal Loss Training Strategy */}
        <section id="focal-loss" className="card-panel" style={{ background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--color-notumor)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-notumor)', fontWeight: 700 }}>OPTIMIZATION STRATEGY</div>
              <h2 style={{ fontSize: '1.6rem' }}>Focal Loss Training Formulation</h2>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            In multi-class neuroimaging datasets, certain tumor subclasses (e.g. subtle small meningiomas or early-stage pituitary adenomas) are more difficult to distinguish than obvious cases. The proposed training configuration incorporates <strong>Focal Loss</strong> to dynamically down-weight the loss assigned to easy background examples and focus gradient updates on hard, ambiguous cases.
          </p>

          <div style={{
            background: 'var(--bg-input)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)',
            fontFamily: 'JetBrains Mono',
            fontSize: '0.95rem',
            color: 'var(--color-notumor)',
            marginBottom: '1.25rem',
            overflowX: 'auto'
          }}>
            FL(p_t) = -α_t · (1 - p_t)^γ · log(p_t)
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-main)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}>
            <Info size={16} style={{ color: 'var(--accent-cyan)', display: 'inline', marginRight: '6px' }} />
            <em>Note for research review:</em> While Focal Loss addresses class imbalance and hard-sample learning dynamics, its real-world performance depends on hyperparameter tuning (focusing parameter γ and balancing factor α) and does not inherently guarantee universal empirical gains across every arbitrary split.
          </div>
        </section>
      </div>
    </div>
  );
}

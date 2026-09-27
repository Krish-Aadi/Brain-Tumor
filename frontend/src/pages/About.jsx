import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  Zap,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  Target,
  Layers,
  Clock,
  Sparkles
} from 'lucide-react';
import DatasetMiniBlock from '../components/DatasetMiniBlock';

// Custom Count-Up Hook with smooth easing
function useCountUp(target, duration = 1600, isTriggered = false, decimals = 0) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isTriggered) return;
    let startTimestamp = null;
    let reqId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = ease * target;
      setVal(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.round(current));

      if (progress < 1) {
        reqId = requestAnimationFrame(step);
      }
    };

    reqId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqId);
  }, [target, duration, isTriggered, decimals]);

  return val;
}

export default function About() {
  const statsSectionRef = useRef(null);
  const [statsInView, setStatsInView] = useState(false);

  // Trigger count-up when stats section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
        }
      },
      { threshold: 0.25 }
    );

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animated metric values
  const accuracyCount = useCountUp(96, 1600, statsInView);
  const latencyCount = useCountUp(80, 1300, statsInView);
  const classesCount = useCountUp(4, 900, statsInView);
  const availabilityCount = useCountUp(24, 1200, statsInView);

  return (
    <div className="about-page" style={{ padding: '3.5rem 0 5rem' }}>
      <div className="content-container" style={{ maxWidth: '1080px' }}>
        {/* 1. Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-tag" style={{ marginBottom: '0.75rem' }}>
            Clinical AI Platform
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Advanced AI for Brain Tumor Detection
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Our platform combines parallel deep learning algorithms with explainable AI heatmaps to assist radiologists and doctors in fast, reliable brain MRI classification.
          </p>
        </div>

        {/* 2. Three Core Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem',
          marginBottom: '2.5rem'
        }}>
          {/* Card 1: Hybrid AI Architecture */}
          <div className="card-panel" style={{
            background: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '2.25rem 1.75rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(56, 189, 248, 0.12)',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <BrainCircuit size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
              Hybrid Deep Learning
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Combines Parallel CNNs with Vision Transformers to capture both fine local lesion margins and broad global brain symmetry.
            </p>
          </div>

          {/* Card 2: Instant Analysis */}
          <div className="card-panel" style={{
            background: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '2.25rem 1.75rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Zap size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
              Real-Time Analysis
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Generates predictions and visual explainability maps in under a second, giving physicians rapid second-opinion support.
            </p>
          </div>

          {/* Card 3: High Precision & XAI */}
          <div className="card-panel" style={{
            background: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '2.25rem 1.75rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(168, 85, 247, 0.12)',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
              High Accuracy & XAI
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Achieves 97.7% classification accuracy across thousands of scans with pinpoint Grad-CAM and ViT attention heatmaps.
            </p>
          </div>
        </div>

        {/* 3. Physician Collaboration Note */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '14px',
          padding: '1.5rem 1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--accent-cyan-glow)',
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px'
          }}>
            <Stethoscope size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Physician Decision Support Tool
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              NeuroScan AI is designed exclusively to <strong>assist qualified medical professionals and radiologists</strong> in identifying brain tumors quickly. It serves as an intelligent diagnostic aid and is <strong>not intended to replace doctors</strong>—final clinical evaluation and patient care decisions always remain in the hands of the medical team.
            </p>
          </div>
        </div>

        {/* 4. Dataset Mini Block (Clickable to Dataset Download Page) */}
        <div style={{ marginBottom: '3rem' }}>
          <DatasetMiniBlock />
        </div>

        {/* 5. Redesigned Interactive Stat Telemetry Grid with Smooth Count-Up Animation */}
        <div ref={statsSectionRef} style={{ marginBottom: '3.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1.25rem'
          }}>
            {/* Stat Card 1: Accuracy */}
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              borderTop: '3px solid #38bdf8',
              padding: '1.75rem 1.5rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                    Diagnostic Accuracy
                  </span>
                  <div style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '6px', borderRadius: '8px' }}>
                    <Target size={18} />
                  </div>
                </div>

                <div style={{
                  fontSize: '2.8rem',
                  fontWeight: 900,
                  color: '#38bdf8',
                  fontFamily: 'Outfit',
                  lineHeight: 1,
                  marginBottom: '0.5rem'
                }}>
                  {accuracyCount}%
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: 1.45 }}>
                  Empirically validated model classification rate
                </p>
              </div>

              {/* Animated Progress Bar */}
              <div style={{ height: '5px', background: 'var(--bg-main)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: statsInView ? '96%' : '0%',
                  background: '#38bdf8',
                  borderRadius: '999px',
                  transition: 'width 1.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>
            </div>

            {/* Stat Card 2: Inference Speed */}
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              borderTop: '3px solid #22c55e',
              padding: '1.75rem 1.5rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                    Inference Speed
                  </span>
                  <div style={{ color: '#22c55e', background: 'rgba(34, 197, 94, 0.12)', padding: '6px', borderRadius: '8px' }}>
                    <Zap size={18} />
                  </div>
                </div>

                <div style={{
                  fontSize: '2.8rem',
                  fontWeight: 900,
                  color: '#22c55e',
                  fontFamily: 'Outfit',
                  lineHeight: 1,
                  marginBottom: '0.5rem'
                }}>
                  &lt; {latencyCount}ms
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: 1.45 }}>
                  Sub-second analytical feature extraction
                </p>
              </div>

              {/* Animated Progress Bar */}
              <div style={{ height: '5px', background: 'var(--bg-main)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: statsInView ? '95%' : '0%',
                  background: '#22c55e',
                  borderRadius: '999px',
                  transition: 'width 1.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>
            </div>

            {/* Stat Card 3: Tumor Classes */}
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              borderTop: '3px solid #818cf8',
              padding: '1.75rem 1.5rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                    Pathology Scope
                  </span>
                  <div style={{ color: '#818cf8', background: 'rgba(129, 140, 248, 0.12)', padding: '6px', borderRadius: '8px' }}>
                    <Layers size={18} />
                  </div>
                </div>

                <div style={{
                  fontSize: '2.8rem',
                  fontWeight: 900,
                  color: '#818cf8',
                  fontFamily: 'Outfit',
                  lineHeight: 1,
                  marginBottom: '0.5rem'
                }}>
                  {classesCount}
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: 1.45 }}>
                  Glioma, Meningioma, Pituitary & Normal
                </p>
              </div>

              {/* Animated Progress Bar */}
              <div style={{ height: '5px', background: 'var(--bg-main)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: statsInView ? '100%' : '0%',
                  background: '#818cf8',
                  borderRadius: '999px',
                  transition: 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>
            </div>

            {/* Stat Card 4: Clinical Availability */}
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              borderTop: '3px solid #f59e0b',
              padding: '1.75rem 1.5rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                    System Access
                  </span>
                  <div style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', padding: '6px', borderRadius: '8px' }}>
                    <Clock size={18} />
                  </div>
                </div>

                <div style={{
                  fontSize: '2.8rem',
                  fontWeight: 900,
                  color: '#f59e0b',
                  fontFamily: 'Outfit',
                  lineHeight: 1,
                  marginBottom: '0.5rem'
                }}>
                  {availabilityCount}/7
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: 1.45 }}>
                  Continuous on-demand triage assistance
                </p>
              </div>

              {/* Animated Progress Bar */}
              <div style={{ height: '5px', background: 'var(--bg-main)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: statsInView ? '100%' : '0%',
                  background: '#f59e0b',
                  borderRadius: '999px',
                  transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* 6. Direct Action CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/analyze" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            <span>Go to Detection Studio</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Mail, 
  ShieldCheck, 
  Stethoscope, 
  Server, 
  ExternalLink, 
  Check, 
  Copy, 
  Lock, 
  FileText,
  Hospital
} from 'lucide-react';

export default function Contact() {
  const [copiedEmail, setCopiedEmail] = useState('');

  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(''), 2500);
  };

  return (
    <div className="contact-page" style={{ padding: '3.5rem 0 5rem' }}>
      <div className="content-container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-tag" style={{ marginBottom: '0.75rem' }}>
            Restricted Clinical Inquiries
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.85rem', letterSpacing: '-0.02em' }}>
            Clinical Access &amp; Collaboration
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Direct communication channels for hospital departments, radiologists, and research institutions evaluating or integrating NeuroScan AI.
          </p>
        </div>

        {/* 1. Access Protocol Notice */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.12)',
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Lock size={20} />
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Authorized Clinical Use:</strong> This diagnostic tool is provisioned for qualified healthcare professionals, radiologists, and academic medical centers.
          </div>
        </div>

        {/* 2. Direct Contact Channels (2 Minimal Cards) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Card 1: Clinical Team */}
          <div className="card-panel" style={{
            background: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '1.75rem',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Clinical Inquiries
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Radiology &amp; Diagnostics</span>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                For diagnostic validation, clinical study collaboration, and multi-institutional MRI benchmark testing.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.9rem',
              borderRadius: '10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)'
            }}>
              <span style={{ fontSize: '0.88rem', fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                clinical@neuroscan.ai
              </span>
              <button
                onClick={() => copyToClipboard('clinical@neuroscan.ai')}
                className="btn-icon"
                title="Copy email address"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copiedEmail === 'clinical@neuroscan.ai' ? '#10b981' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {copiedEmail === 'clinical@neuroscan.ai' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Card 2: Technical & PACS Integration */}
          <div className="card-panel" style={{
            background: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '1.75rem',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: '#818cf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Server size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Technical &amp; Systems IT
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PACS / HIS Integration</span>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                For on-premise server deployment, DICOM PACS integration, API endpoints, and model architecture inquiries.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.9rem',
              borderRadius: '10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)'
            }}>
              <span style={{ fontSize: '0.88rem', fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                systems@neuroscan.ai
              </span>
              <button
                onClick={() => copyToClipboard('systems@neuroscan.ai')}
                className="btn-icon"
                title="Copy email address"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copiedEmail === 'systems@neuroscan.ai' ? '#10b981' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {copiedEmail === 'systems@neuroscan.ai' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Guidelines & Notes for Medical & Hospital Teams */}
        <div className="card-panel" style={{
          background: 'var(--bg-surface)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Hospital size={22} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Notes for Medical &amp; Hospital IT Teams
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ color: 'var(--accent-cyan)', marginTop: '3px' }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Doctor-in-the-Loop Workflow:</strong> NeuroScan AI is designed to support medical specialists by providing rapid second-opinion analysis while keeping attending physicians in complete control of all clinical diagnoses and patient treatment decisions.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ color: 'var(--accent-teal)', marginTop: '3px' }}>
                <Server size={18} />
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Workflow &amp; PACS Interoperability:</strong> When integrating this model into hospital infrastructure or large-scale clinical trials, coordinate technical requirements, network data privacy, and PACS/DICOM interoperability with your IT and radiology departments.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ color: 'var(--accent-indigo)', marginTop: '3px' }}>
                <FileText size={18} />
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Patient Data Privacy:</strong> The core feature extraction and inference pipeline can be hosted on isolated on-premise hospital clusters to maintain strict HIPAA/GDPR health data compliance.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

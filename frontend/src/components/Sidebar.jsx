import React, { useState, useRef } from 'react';
import { UploadCloud, Database, CheckCircle2, Loader2, Image as ImageIcon, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';

const SAMPLES = [
  { id: 'glioma', label: 'Glioma Tumor', badgeClass: 'glioma', tag: 'High Risk' },
  { id: 'meningioma', label: 'Meningioma Tumor', badgeClass: 'meningioma', tag: 'Moderate' },
  { id: 'pituitary', label: 'Pituitary Tumor', badgeClass: 'pituitary', tag: 'Moderate' },
  { id: 'notumor', label: 'Healthy Brain (No Tumor)', badgeClass: 'notumor', tag: 'Normal' },
];

export default function Sidebar({ activeSample, onSelectSample, onFileUpload, isLoading, resultData }) {

  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const fileInputRef = useRef(null);

  const currentIndex = resultData?.sample_index ?? 0;
  const totalSamples = resultData?.total_samples ?? 1;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      onFileUpload(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      onFileUpload(file);
    }
  };

  const handleNextSample = (e, clsId) => {
    e.stopPropagation();
    const nextIdx = (currentIndex + 1) % totalSamples;
    onSelectSample(clsId, nextIdx);
  };

  const handlePrevSample = (e, clsId) => {
    e.stopPropagation();
    const prevIdx = (currentIndex - 1 + totalSamples) % totalSamples;
    onSelectSample(clsId, prevIdx);
  };

  return (
    <div className="glass-panel sidebar-panel">
      <div>
        <div className="section-title">
          <Database size={16} />
          <span>Preset Test Dataset Gallery</span>
        </div>
        <div className="sample-buttons">
          {SAMPLES.map((sample) => {
            const isActive = activeSample === sample.id;
            return (
              <div key={sample.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <button
                  className={`btn-sample ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectSample(sample.id, isActive ? currentIndex : 0)}
                  disabled={isLoading}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                    {isActive && isLoading ? (
                      <Loader2 size={16} className="animate-spin" style={{ color: 'var(--cyan-electric)' }} />
                    ) : isActive ? (
                      <CheckCircle2 size={16} style={{ color: 'var(--cyan-electric)' }} />
                    ) : (
                      <ImageIcon size={16} style={{ color: 'var(--text-muted)' }} />
                    )}
                    <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{sample.label}</span>
                  </div>
                  <span className={`sample-badge ${sample.badgeClass}`}>{sample.tag}</span>
                </button>

                {/* Sub-toolbar for cycling samples when active */}
                {isActive && totalSamples > 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '0.35rem 0.6rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    fontSize: '0.75rem',
                    color: 'var(--text-cyber)'
                  }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem' }}>
                      Sample #{currentIndex + 1} / {totalSamples}
                    </span>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        type="button"
                        onClick={(e) => handlePrevSample(e, sample.id)}
                        disabled={isLoading}
                        title="Previous Scan"
                        style={{
                          background: 'rgba(56, 189, 248, 0.1)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          color: 'var(--cyan-electric)',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleNextSample(e, sample.id)}
                        disabled={isLoading}
                        title="Next Scan"
                        style={{
                          background: 'rgba(56, 189, 248, 0.1)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          color: 'var(--cyan-electric)',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '0.8rem' }}>
        <div className="section-title">
          <UploadCloud size={16} />
          <span>Upload Custom MRI Scan</span>
        </div>
        <div
          className={`upload-dropzone ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg"
            style={{ display: 'none' }}
          />
          <div className="upload-icon">
            <UploadCloud size={24} />
          </div>
          <div className="upload-text">
            {uploadedFileName && !activeSample ? (
              <span style={{ color: 'var(--cyan-electric)', fontWeight: 600 }}>📄 {uploadedFileName}</span>
            ) : (
              <>
                <strong>Click to upload</strong> or drag & drop scan
              </>
            )}
          </div>
          <div className="upload-hint">Supports PNG, JPG, JPEG (Max 10MB)</div>
        </div>
      </div>
    </div>
  );
}


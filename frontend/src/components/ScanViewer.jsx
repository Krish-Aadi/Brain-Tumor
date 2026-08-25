import React, { useState, useRef } from 'react';
import { Columns, Sliders, Eye, Flame, Loader2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function ScanViewer({ resultData, isLoading }) {
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' | 'split-slider'
  const [splitPos, setSplitPos] = useState(50);
  const [showLoupe, setShowLoupe] = useState(false);
  const [loupeStyle, setLoupeStyle] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const origFrameRef = useRef(null);

  const originalImgSrc = resultData?.original_image || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='100%' height='100%' fill='%23050811'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2338BDF8' font-family='sans-serif' font-size='15'>Awaiting MRI Scan</text></svg>";
  const gradcamImgSrc = resultData?.gradcam_image || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='100%' height='100%' fill='%23050811'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2364748B' font-family='sans-serif' font-size='15'>Awaiting Heatmap Generation</text></svg>";

  const handleMouseEnter = () => {
    if (resultData?.original_image && zoomLevel === 1.0) {
      setShowLoupe(true);
    }
  };

  const handleMouseLeave = () => {
    setShowLoupe(false);
  };

  const handleMouseMove = (e) => {
    if (!origFrameRef.current || !resultData?.original_image || zoomLevel !== 1.0) return;
    const rect = origFrameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensWidth = 70;
    const lensHeight = 70;

    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    setLoupeStyle({
      display: 'block',
      left: `${x - lensWidth}px`,
      top: `${y - lensHeight}px`,
      backgroundImage: `url("${resultData.original_image}")`,
      backgroundSize: `${rect.width * 2.5}px ${rect.height * 2.5}px`,
      backgroundPosition: `${bgX}% ${bgY}%`
    });
  };

  const handleZoomIn = () => {
    setShowLoupe(false);
    setZoomLevel(prev => Math.min(prev + 0.3, 2.5));
  };

  const handleZoomOut = () => {
    setShowLoupe(false);
    setZoomLevel(prev => Math.max(prev - 0.3, 1.0));
  };

  const handleResetZoom = () => {
    setShowLoupe(false);
    setZoomLevel(1.0);
  };

  return (
    <div className="glass-panel viewport-panel">
      <div className="viewport-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-cyber)' }}>
          <Eye size={18} />
          <span>Interactive Neural Visualizer</span>
        </div>

        {/* View Mode & Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="view-mode-toggle" style={{ gap: '2px' }}>
            <button
              className="view-mode-btn"
              onClick={handleZoomIn}
              title="Zoom In"
              style={{ padding: '0.35rem 0.5rem' }}
            >
              <ZoomIn size={14} />
            </button>
            <button
              className="view-mode-btn"
              onClick={handleZoomOut}
              title="Zoom Out"
              style={{ padding: '0.35rem 0.5rem' }}
              disabled={zoomLevel <= 1.0}
            >
              <ZoomOut size={14} />
            </button>
            {zoomLevel > 1.0 && (
              <button
                className="view-mode-btn"
                onClick={handleResetZoom}
                title="Reset Zoom"
                style={{ padding: '0.35rem 0.5rem', color: 'var(--cyan-electric)' }}
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>

          <div className="view-mode-toggle">
            <button
              className={`view-mode-btn ${viewMode === 'side-by-side' ? 'active' : ''}`}
              onClick={() => setViewMode('side-by-side')}
            >
              <Columns size={14} />
              <span>Side-by-Side</span>
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'split-slider' ? 'active' : ''}`}
              onClick={() => setViewMode('split-slider')}
            >
              <Sliders size={14} />
              <span>Crossfade Split</span>
            </button>
          </div>
        </div>
      </div>

      <div className="display-canvas">
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(5, 8, 17, 0.85)', backdropFilter: 'blur(8px)', zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
            <Loader2 size={40} className="animate-spin" style={{ color: 'var(--cyan-electric)' }} />
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', color: 'var(--cyan-bright)' }}>
              Executing Hybrid Vision Transformer & Grad-CAM Inference...
            </div>
          </div>
        )}

        {viewMode === 'side-by-side' ? (
          <div className="side-by-side-grid">
            {/* Original MRI with Magnifier Loupe */}
            <div
              className="img-frame"
              ref={origFrameRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              style={{ overflow: 'hidden' }}
            >
              <div className="img-label">
                <span>[INPUT SCAN] PREPROCESSED MRI {zoomLevel > 1.0 ? `(${Math.round(zoomLevel * 100)}%)` : ''}</span>
              </div>
              <img
                src={originalImgSrc}
                alt="Original MRI Scan"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease-out',
                  transformOrigin: 'center center'
                }}
              />
              {showLoupe && zoomLevel === 1.0 && <div className="magnifier-loupe" style={loupeStyle} />}
            </div>

            {/* Grad-CAM Heatmap */}
            <div className="img-frame" style={{ overflow: 'hidden' }}>
              <div className="img-label" style={{ color: 'var(--purple-accent)', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                <Flame size={12} style={{ display: 'inline', marginRight: '4px' }} />
                <span>[GRAD-CAM] ATTENTION HEATMAP {zoomLevel > 1.0 ? `(${Math.round(zoomLevel * 100)}%)` : ''}</span>
              </div>
              <img
                src={gradcamImgSrc}
                alt="GradCAM Heatmap Overlay"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease-out',
                  transformOrigin: 'center center'
                }}
              />
            </div>
          </div>
        ) : (
          /* Interactive Crossfade Split Slider */
          <div className="slider-comparison-box">
            <div className="img-label" style={{ zIndex: 12 }}>
              <span>SPLIT COMPARISON (DRAG SLIDER)</span>
            </div>

            {/* Base Layer: Original MRI */}
            <div className="slider-img-wrapper">
              <img src={originalImgSrc} alt="Original MRI Scan" />
            </div>

            {/* Overlaid Layer: GradCAM Heatmap */}
            <div
              className="slider-overlay-layer"
              style={{ clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)` }}
            >
              <img src={gradcamImgSrc} alt="GradCAM Heatmap Overlay" />
            </div>

            {/* Divider Line */}
            <div className="slider-divider-line" style={{ left: `${splitPos}%` }} />

            {/* Range Input Control */}
            <input
              type="range"
              min="0"
              max="100"
              value={splitPos}
              onChange={(e) => setSplitPos(Number(e.target.value))}
              className="range-input-control"
            />
          </div>
        )}
      </div>
    </div>
  );
}

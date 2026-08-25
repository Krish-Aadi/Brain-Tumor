import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ScanViewer from './components/ScanViewer';
import DiagnosticPanel from './components/DiagnosticPanel';
import ReportModal from './components/ReportModal';

// Backend API URL - Uses Vite Proxy in development, or relative in production
const API_BASE = '/api';

export default function App() {
  const [activeSample, setActiveSample] = useState('glioma');
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch preset test sample prediction
  const fetchSample = async (clsName, index = 0) => {
    setIsLoading(true);
    setErrorMessage(null);
    setActiveSample(clsName);

    try {
      const response = await fetch(`${API_BASE}/sample/${clsName}?index=${index}`);
      const data = await response.json();

      if (data.success) {
        setResultData(data);
      } else {
        setErrorMessage(data.error || 'Failed to fetch sample prediction');
      }
    } catch (err) {
      console.error('Error fetching sample:', err);
      setErrorMessage('Unable to connect to backend server. Make sure app.py is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Upload custom MRI scan file
  const handleFileUpload = async (file) => {
    if (!file) return;

    setIsLoading(true);
    setErrorMessage(null);
    setActiveSample(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResultData(data);
      } else {
        setErrorMessage(data.error || 'Prediction failed for uploaded file');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setErrorMessage('Error connecting to prediction backend.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset console state
  const handleReset = () => {
    setActiveSample(null);
    setResultData(null);
    setErrorMessage(null);
  };

  // Preload initial sample on mount
  useEffect(() => {
    fetchSample('glioma');
  }, []);

  return (
    <div className="dashboard-container">
      <Header />

      {errorMessage && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid var(--glioma-color)',
          color: 'var(--glioma-color)',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          fontSize: '0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>⚠️ {errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            style={{ background: 'transparent', border: 'none', color: 'var(--glioma-color)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      <main className="main-grid">
        <Sidebar
          activeSample={activeSample}
          onSelectSample={fetchSample}
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
          resultData={resultData}
        />

        <ScanViewer
          resultData={resultData}
          isLoading={isLoading}
        />

        <DiagnosticPanel
          resultData={resultData}
          onReset={handleReset}
          onOpenReport={() => setIsReportOpen(true)}
        />
      </main>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        resultData={resultData}
      />
    </div>
  );
}



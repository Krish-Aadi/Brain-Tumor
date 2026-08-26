import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UploadBox from '../components/UploadBox';
import DetectionCapabilities from '../components/DetectionCapabilities';
import ProcessingStatus from '../components/ProcessingStatus';
import PredictionCard from '../components/PredictionCard';
import GradCAMViewer from '../components/GradCAMViewer';
import AttentionMapViewer from '../components/AttentionMapViewer';
import apiService from '../services/api';
import { RotateCcw, Sparkles, Activity, FileText, ArrowRight } from 'lucide-react';

export default function Analyze() {
  const [activeFile, setActiveFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(1);
  const [resultData, setResultData] = useState(null);

  const handleCustomUpload = async (file, previewUrl) => {
    setActiveFile(file);
    setPreviewImage(previewUrl);
    setIsProcessing(true);
    setProcessStep(1);

    const stepTimer = setInterval(() => {
      setProcessStep((prev) => (prev < 7 ? prev + 1 : prev));
    }, 280);

    try {
      const data = await apiService.predictMRI(file);
      clearInterval(stepTimer);
      setProcessStep(7);
      setResultData(data);
      apiService.savePredictionToHistory({
        filename: file.name,
        predicted_class: data.predicted_class,
        confidence: data.confidence,
        resolution: '124 × 124',
        model: 'PDSCNN + ViT + RRELM'
      });
    } catch (err) {
      console.error('Error analyzing uploaded scan:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setActiveFile(null);
    setPreviewImage(null);
    setResultData(null);
  };

  return (
    <div className="analyze-page" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="content-container" style={{ maxWidth: '1100px' }}>
        {/* Page Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem'
        }}>
          <div className="section-tag" style={{ marginBottom: '0.5rem' }}>
            Brain MRI Diagnostic Studio
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            MRI Scan Analysis & Tumor Detection
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
            Upload a T1 cranial brain MRI to run feature extraction across the PDSCNN and Vision Transformer branches.
          </p>
        </div>

        {/* Dynamic Studio Layout */}
        {!resultData && !isProcessing ? (
          /* Step 1: Prominent Large Upload Dropzone + Detection Capabilities */
          <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <UploadBox
              onUpload={handleCustomUpload}
              isProcessing={isProcessing}
            />

            {/* Detection Capabilities Block */}
            <DetectionCapabilities />
          </div>
        ) : isProcessing ? (
          /* Step 2: Clean Processing State */
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <ProcessingStatus currentStep={processStep} />
          </div>
        ) : (
          /* Step 3: Diagnostic Results & Explainability Viewers */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Top Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Analysis Results & Explainability Maps
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleReset} className="btn btn-primary btn-sm">
                  <RotateCcw size={15} />
                  <span>Analyze Another Scan</span>
                </button>
              </div>
            </div>

            {/* 1. Prediction & Confidence Card */}
            <PredictionCard result={resultData} onReset={handleReset} />

            {/* 2. Explainable AI (XAI) Dual Viewers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
              {/* Grad-CAM Heatmap Viewer */}
              <GradCAMViewer
                originalImage={resultData.original_image || previewImage}
                gradcamImage={resultData.gradcam_image}
                predictedClass={resultData.predicted_class}
              />

              {/* ViT Attention Map Viewer */}
              <AttentionMapViewer
                originalImage={resultData.original_image || previewImage}
                vitAttentionImage={resultData.vit_attention_image}
                predictedClass={resultData.predicted_class}
              />
            </div>

            {/* Reference Capabilities Block */}
            <div style={{ marginTop: '1rem' }}>
              <DetectionCapabilities />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

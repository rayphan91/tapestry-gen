import React, { useState } from 'react';
import { Download, X, Video, CheckCircle2, Circle, AlertTriangle, XCircle } from 'lucide-react';
import { useTapestryStore } from '@/store/useTapestryStore';
import { useSwooshStore } from '@/store/useSwooshStore';
import { validateTapestryExport } from '@/utils/exportValidation';
import './ExportModal.css';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'png' | 'jpg' | 'webp', quality: number, scale: number) => void;
  onExportVideo?: (fps: number, duration: number) => void;
  currentWidth: number;
  currentHeight: number;
  isAnimating?: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  onExportVideo,
  currentWidth,
  currentHeight,
  isAnimating = false,
}) => {
  const [exportType, setExportType] = useState<'image' | 'video'>('image');
  const [format, setFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [quality, setQuality] = useState(95);
  const [scale, setScale] = useState(1);
  const [fps, setFps] = useState(30);
  const [videoDuration, setVideoDuration] = useState(8);

  // Get store state for validation
  const selectedRegion = useTapestryStore((state) => state.selectedRegion);
  const layers = useTapestryStore((state) => state.layers);
  const collageImages = useTapestryStore((state) => state.collageImages);
  const showFilmGrain = useTapestryStore((state) => state.showFilmGrain);
  const showScanlines = useTapestryStore((state) => state.showScanlines);
  const showVeins = useTapestryStore((state) => state.showVeins);
  const showSplatter = useTapestryStore((state) => state.showSplatter);
  const showBrushStrokes = useTapestryStore((state) => state.showBrushStrokes);
  const swooshes = useSwooshStore((state) => state.swooshes);

  // Validate tapestry
  const validation = validateTapestryExport({
    selectedRegion,
    layers,
    collageImages,
    swooshes,
    showFilmGrain,
    showScanlines,
    showVeins,
    showSplatter,
    showBrushStrokes,
  });

  if (!isOpen) return null;

  const exportWidth = Math.round(currentWidth * scale);
  const exportHeight = Math.round(currentHeight * scale);

  const handleExport = () => {
    if (exportType === 'video' && onExportVideo) {
      onExportVideo(fps, videoDuration);
    } else {
      onExport(format, quality, scale);
    }
    onClose();
  };

  return (
    <>
      <div className="export-modal-backdrop" onClick={onClose} />
      <div className="export-modal">
        <div className="export-modal-header">
          <h3>Export Tapestry</h3>
          <button className="export-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="export-modal-content">
          {/* Validation Checklist */}
          <div className="export-validation-section">
            <h4 className="export-section-title">Tapestry Ingredients</h4>
            <div className="export-checklist">
              <div className={`checklist-item ${validation.checklist.hasGradient ? 'complete' : 'incomplete'}`}>
                {validation.checklist.hasGradient ? (
                  <CheckCircle2 size={16} className="checklist-icon complete" />
                ) : (
                  <Circle size={16} className="checklist-icon incomplete" />
                )}
                <span>Base Gradient</span>
              </div>
              <div className={`checklist-item ${validation.checklist.hasVisibleLayers ? 'complete' : 'incomplete'}`}>
                {validation.checklist.hasVisibleLayers ? (
                  <CheckCircle2 size={16} className="checklist-icon complete" />
                ) : (
                  <Circle size={16} className="checklist-icon incomplete" />
                )}
                <span>Image Layers ({layers.filter(l => l.visible).length})</span>
              </div>
              <div className={`checklist-item ${validation.checklist.hasCollageImages ? 'complete' : 'incomplete'}`}>
                {validation.checklist.hasCollageImages ? (
                  <CheckCircle2 size={16} className="checklist-icon complete" />
                ) : (
                  <Circle size={16} className="checklist-icon incomplete" />
                )}
                <span>Collage Images ({collageImages.length})</span>
              </div>
              <div className={`checklist-item ${validation.checklist.hasSwooshes ? 'complete' : 'incomplete'}`}>
                {validation.checklist.hasSwooshes ? (
                  <CheckCircle2 size={16} className="checklist-icon complete" />
                ) : (
                  <Circle size={16} className="checklist-icon incomplete" />
                )}
                <span>Swooshes ({swooshes.length})</span>
              </div>
              <div className={`checklist-item ${validation.checklist.hasEffects ? 'complete' : 'incomplete'}`}>
                {validation.checklist.hasEffects ? (
                  <CheckCircle2 size={16} className="checklist-icon complete" />
                ) : (
                  <Circle size={16} className="checklist-icon incomplete" />
                )}
                <span>Effects (grain, scanlines, etc.)</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="export-progress-container">
              <div className="export-progress-bar">
                <div
                  className="export-progress-fill"
                  style={{ width: `${validation.completionPercentage}%` }}
                />
              </div>
              <span className="export-progress-text">{validation.completionPercentage}% Complete</span>
            </div>

            {/* Warnings */}
            {validation.warnings.length > 0 && (
              <div className="export-warnings">
                {validation.warnings.map((warning, index) => (
                  <div key={index} className="export-warning">
                    <AlertTriangle size={14} />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Errors */}
            {validation.issues.length > 0 && (
              <div className="export-errors">
                {validation.issues.map((issue, index) => (
                  <div key={index} className="export-error">
                    <XCircle size={14} />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Export Type Toggle (Image / Video) */}
          {isAnimating && onExportVideo && (
            <div className="export-option-group">
              <div className="export-type-buttons">
                <button
                  className={`export-type-button ${exportType === 'image' ? 'active' : ''}`}
                  onClick={() => setExportType('image')}
                >
                  <Download size={16} />
                  Still Image
                </button>
                <button
                  className={`export-type-button ${exportType === 'video' ? 'active' : ''}`}
                  onClick={() => setExportType('video')}
                >
                  <Video size={16} />
                  Animation Loop
                </button>
              </div>
            </div>
          )}

          {exportType === 'image' ? (
            <>
          {/* Format Selection */}
          <div className="export-option-group">
            <label className="export-label">Format</label>
            <div className="export-format-buttons">
              <button
                className={`export-format-button ${format === 'png' ? 'active' : ''}`}
                onClick={() => setFormat('png')}
              >
                PNG
                <span className="format-desc">Lossless, transparency</span>
              </button>
              <button
                className={`export-format-button ${format === 'jpg' ? 'active' : ''}`}
                onClick={() => setFormat('jpg')}
              >
                JPG
                <span className="format-desc">Smaller file size</span>
              </button>
              <button
                className={`export-format-button ${format === 'webp' ? 'active' : ''}`}
                onClick={() => setFormat('webp')}
              >
                WebP
                <span className="format-desc">Modern, efficient</span>
              </button>
            </div>
          </div>

          {/* Quality (for JPG and WebP) */}
          {(format === 'jpg' || format === 'webp') && (
            <div className="export-option-group">
              <label className="export-label">
                Quality
                <span className="export-value">{quality}%</span>
              </label>
              <input
                type="range"
                min="60"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="export-slider"
              />
            </div>
          )}

          {/* Scale */}
          <div className="export-option-group">
            <label className="export-label">
              Scale
              <span className="export-value">{scale}x</span>
            </label>
            <div className="export-scale-buttons">
              {[1, 1.5, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  className={`export-scale-button ${scale === s ? 'active' : ''}`}
                  onClick={() => setScale(s)}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Output Dimensions */}
          <div className="export-dimensions">
            <div className="export-dimension-label">Output size:</div>
            <div className="export-dimension-value">
              {exportWidth} × {exportHeight} px
            </div>
          </div>

          {/* Presets */}
          <div className="export-option-group">
            <label className="export-label">Quick Presets</label>
            <div className="export-preset-buttons">
              <button
                className="export-preset-button"
                onClick={() => {
                  setScale(1);
                  setFormat('png');
                }}
              >
                Original
              </button>
              <button
                className="export-preset-button"
                onClick={() => {
                  setScale(2);
                  setFormat('png');
                }}
              >
                High Res
              </button>
              <button
                className="export-preset-button"
                onClick={() => {
                  setScale(1);
                  setFormat('jpg');
                  setQuality(85);
                }}
              >
                Web Optimized
              </button>
              <button
                className="export-preset-button"
                onClick={() => {
                  setScale(4);
                  setFormat('png');
                }}
              >
                Print Quality
              </button>
            </div>
          </div>
          </>
          ) : (
            <>
              {/* Video Export Options */}
              <div className="export-option-group">
                <label className="export-label">
                  Frame Rate
                  <span className="export-value">{fps} FPS</span>
                </label>
                <div className="export-scale-buttons">
                  {[24, 30, 60].map((f) => (
                    <button
                      key={f}
                      className={`export-scale-button ${fps === f ? 'active' : ''}`}
                      onClick={() => setFps(f)}
                    >
                      {f} FPS
                    </button>
                  ))}
                </div>
              </div>

              <div className="export-option-group">
                <label className="export-label">
                  Duration
                  <span className="export-value">{videoDuration}s</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(parseInt(e.target.value))}
                  className="export-slider"
                />
              </div>

              <div className="export-dimensions">
                <div className="export-dimension-label">Output format:</div>
                <div className="export-dimension-value">
                  MP4 (H.264)
                </div>
              </div>

              <div className="export-info-box">
                <p>Video will capture {fps * videoDuration} frames total</p>
              </div>
            </>
          )}
        </div>

        <div className="export-modal-footer">
          <button className="export-cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="export-download-button"
            onClick={handleExport}
            disabled={!validation.isValid}
            title={!validation.isValid ? 'Missing required elements' : ''}
          >
            {exportType === 'video' ? <Video size={16} /> : <Download size={16} />}
            {validation.isValid
              ? `Export ${exportType === 'video' ? 'Video' : format.toUpperCase()}`
              : 'Missing Required Elements'}
          </button>
        </div>
      </div>
    </>
  );
};

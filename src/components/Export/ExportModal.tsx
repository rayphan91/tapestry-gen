import React, { useState } from 'react';
import { Download, X, Video } from 'lucide-react';
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
          <button className="export-download-button" onClick={handleExport}>
            {exportType === 'video' ? <Video size={16} /> : <Download size={16} />}
            Export {exportType === 'video' ? 'Video' : format.toUpperCase()}
          </button>
        </div>
      </div>
    </>
  );
};

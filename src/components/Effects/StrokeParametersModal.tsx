import React from 'react';
import { useSwooshStore } from '@/store/useSwooshStore';
import { X } from 'lucide-react';
import './StrokeParametersModal.css';

interface StrokeParametersModalProps {
  strokeId: string;
  onClose: () => void;
}

export const StrokeParametersModal: React.FC<StrokeParametersModalProps> = ({ strokeId, onClose }) => {
  const swooshes = useSwooshStore((state) => state.swooshes);
  const updateSwoosh = useSwooshStore((state) => state.updateSwoosh);

  const swoosh = swooshes.find((s) => s.id === strokeId);

  if (!swoosh) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="stroke-modal">
        <div className="modal-header">
          <h3 className="modal-title">Stroke Properties</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-section">
            <label className="modal-label">Color</label>
            <div className="color-input-group">
              <input
                type="color"
                value={swoosh.color}
                onChange={(e) => updateSwoosh(strokeId, { color: e.target.value })}
                className="modal-color-picker"
              />
              <input
                type="text"
                value={swoosh.color.toUpperCase()}
                onChange={(e) => {
                  const hex = e.target.value;
                  if (/^#[0-9A-F]{6}$/i.test(hex)) {
                    updateSwoosh(strokeId, { color: hex });
                  }
                }}
                className="modal-color-input"
                maxLength={7}
              />
            </div>
          </div>

          <div className="modal-section">
            <label className="modal-label">Thickness</label>
            <div className="slider-group">
              <input
                type="range"
                min="10"
                max="400"
                step="10"
                value={swoosh.thickness}
                onChange={(e) => updateSwoosh(strokeId, { thickness: parseFloat(e.target.value) })}
                className="modal-slider"
              />
              <span className="slider-value">{swoosh.thickness.toFixed(0)}</span>
            </div>
          </div>

          <div className="modal-section">
            <label className="modal-label">Opacity</label>
            <div className="slider-group">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={swoosh.opacity * 100}
                onChange={(e) => updateSwoosh(strokeId, { opacity: parseFloat(e.target.value) / 100 })}
                className="modal-slider"
              />
              <span className="slider-value">{Math.round(swoosh.opacity * 100)}%</span>
            </div>
          </div>

          <div className="modal-section">
            <label className="modal-label">Blend Mode</label>
            <select
              className="modal-select"
              value={swoosh.blendMode}
              onChange={(e) => updateSwoosh(strokeId, { blendMode: e.target.value })}
            >
              <option value="normal">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="darken">Darken</option>
              <option value="lighten">Lighten</option>
              <option value="color-dodge">Color Dodge</option>
              <option value="color-burn">Color Burn</option>
              <option value="hard-light">Hard Light</option>
              <option value="soft-light">Soft Light</option>
              <option value="difference">Difference</option>
              <option value="exclusion">Exclusion</option>
            </select>
          </div>

          <div className="modal-section">
            <label className="modal-label">Trim Start</label>
            <div className="slider-group">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={(swoosh.trimStart || 0) * 100}
                onChange={(e) => updateSwoosh(strokeId, { trimStart: parseFloat(e.target.value) / 100 })}
                className="modal-slider"
              />
              <span className="slider-value">{Math.round((swoosh.trimStart || 0) * 100)}%</span>
            </div>
          </div>

          <div className="modal-section">
            <label className="modal-label">Trim End</label>
            <div className="slider-group">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={(swoosh.trimEnd || 0) * 100}
                onChange={(e) => updateSwoosh(strokeId, { trimEnd: parseFloat(e.target.value) / 100 })}
                className="modal-slider"
              />
              <span className="slider-value">{Math.round((swoosh.trimEnd || 0) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

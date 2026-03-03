import React from 'react';
import { useTapestryStore } from '@/store/useTapestryStore';
import { REGIONAL_GRADIENTS } from '@/types';
import { X } from 'lucide-react';
import '../Effects/StrokeParametersModal.css';

interface RegionParametersModalProps {
  onClose: () => void;
}

export const RegionParametersModal: React.FC<RegionParametersModalProps> = ({ onClose }) => {
  const selectedRegion = useTapestryStore((state) => state.selectedRegion);
  const customNoiseParams = useTapestryStore((state) => state.customNoiseParams);
  const setCustomNoiseParams = useTapestryStore((state) => state.setCustomNoiseParams);
  const customDuotoneColors = useTapestryStore((state) => state.customDuotoneColors);
  const setCustomDuotoneColors = useTapestryStore((state) => state.setCustomDuotoneColors);
  const duotoneBlendMode = useTapestryStore((state) => state.duotoneBlendMode);
  const setDuotoneBlendMode = useTapestryStore((state) => state.setDuotoneBlendMode);
  const noiseSeed = useTapestryStore((state) => state.noiseSeed);
  const setNoiseSeed = useTapestryStore((state) => state.setNoiseSeed);
  const randomizeNoiseSeed = useTapestryStore((state) => state.randomizeNoiseSeed);
  const flipDuotoneColors = useTapestryStore((state) => state.flipDuotoneColors);

  const gradient = REGIONAL_GRADIENTS.find((g) => g.id === selectedRegion);
  const currentNoiseParams = customNoiseParams || gradient?.noiseParams;
  const currentDuotoneColors = customDuotoneColors || gradient?.duotone;

  const handleNoiseParamChange = (key: keyof typeof currentNoiseParams, value: number) => {
    if (!currentNoiseParams) return;
    setCustomNoiseParams({
      ...currentNoiseParams,
      [key]: value,
    });
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="stroke-modal">
        <div className="modal-header">
          <h3 className="modal-title">Duotone Noise</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-content">
          {selectedRegion === 'custom' && (
            <>
              <div className="modal-section">
                <label className="modal-label">Color A</label>
                <input
                  type="color"
                  value={currentDuotoneColors?.colorA || '#163300'}
                  onChange={(e) =>
                    setCustomDuotoneColors({
                      colorA: e.target.value,
                      colorB: currentDuotoneColors?.colorB || '#9fe870',
                    })
                  }
                  className="modal-color-picker"
                />
              </div>
              <div className="modal-section">
                <label className="modal-label">Color B</label>
                <input
                  type="color"
                  value={currentDuotoneColors?.colorB || '#9fe870'}
                  onChange={(e) =>
                    setCustomDuotoneColors({
                      colorA: currentDuotoneColors?.colorA || '#163300',
                      colorB: e.target.value,
                    })
                  }
                  className="modal-color-picker"
                />
              </div>
            </>
          )}

          <div className="modal-section">
            <button
              onClick={flipDuotoneColors}
              className="modal-button"
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                fontSize: 'var(--font-size-sm)',
                marginBottom: 'var(--space-3)',
              }}
            >
              ↕ Flip Colors
            </button>
          </div>

          <div className="modal-section">
            <label className="modal-label">Scale</label>
            <div className="slider-group">
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={currentNoiseParams?.scale || 1.0}
                onChange={(e) => handleNoiseParamChange('scale', parseFloat(e.target.value))}
                className="modal-slider"
              />
              <span className="slider-value">{currentNoiseParams?.scale.toFixed(1)}</span>
            </div>
          </div>

          <div className="modal-section">
            <label className="modal-label">Octaves</label>
            <div className="slider-group">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={currentNoiseParams?.octaves || 2}
                onChange={(e) => handleNoiseParamChange('octaves', parseInt(e.target.value))}
                className="modal-slider"
              />
              <span className="slider-value">{currentNoiseParams?.octaves}</span>
            </div>
          </div>

          <div className="modal-section">
            <label className="modal-label">Lacunarity</label>
            <div className="slider-group">
              <input
                type="range"
                min="1"
                max="4"
                step="0.1"
                value={currentNoiseParams?.lacunarity || 2.0}
                onChange={(e) => handleNoiseParamChange('lacunarity', parseFloat(e.target.value))}
                className="modal-slider"
              />
              <span className="slider-value">{currentNoiseParams?.lacunarity.toFixed(1)}</span>
            </div>
          </div>

          <div className="modal-section">
            <label className="modal-label">Gain</label>
            <div className="slider-group">
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={currentNoiseParams?.gain || 0.5}
                onChange={(e) => handleNoiseParamChange('gain', parseFloat(e.target.value))}
                className="modal-slider"
              />
              <span className="slider-value">{currentNoiseParams?.gain.toFixed(2)}</span>
            </div>
          </div>

          <div className="modal-section">
            <label className="modal-label">Contrast</label>
            <div className="slider-group">
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={currentNoiseParams?.contrast || 8.0}
                onChange={(e) => handleNoiseParamChange('contrast', parseFloat(e.target.value))}
                className="modal-slider"
              />
              <span className="slider-value">{currentNoiseParams?.contrast.toFixed(1)}</span>
            </div>
          </div>

          <div className="modal-section">
            <label className="modal-label">Grain</label>
            <div className="slider-group">
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={currentNoiseParams?.grainIntensity || 0.15}
                onChange={(e) => handleNoiseParamChange('grainIntensity', parseFloat(e.target.value))}
                className="modal-slider"
              />
              <span className="slider-value">{currentNoiseParams?.grainIntensity.toFixed(2)}</span>
            </div>
          </div>

          <div className="modal-section">
            <label className="modal-label">Blend Mode</label>
            <select
              className="modal-select"
              value={duotoneBlendMode}
              onChange={(e) => setDuotoneBlendMode(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="hard-light">Hard Light</option>
              <option value="soft-light">Soft Light</option>
              <option value="color-dodge">Color Dodge</option>
              <option value="color-burn">Color Burn</option>
              <option value="darken">Darken</option>
              <option value="lighten">Lighten</option>
              <option value="difference">Difference</option>
              <option value="exclusion">Exclusion</option>
              <option value="divide">Divide</option>
            </select>
          </div>

          <div className="modal-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <label className="modal-label" style={{ marginBottom: 0 }}>Seed</label>
              <button
                onClick={randomizeNoiseSeed}
                className="modal-button"
                style={{ padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--font-size-xs)' }}
              >
                Randomize
              </button>
            </div>
            <div className="slider-group">
              <input
                type="range"
                min="0"
                max="10000"
                step="1"
                value={Math.round(noiseSeed * 10000)}
                onChange={(e) => setNoiseSeed(parseInt(e.target.value) / 10000)}
                className="modal-slider"
              />
              <span className="slider-value">{Math.round(noiseSeed * 10000)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { useTapestryStore } from '@/store/useTapestryStore';
import { REGIONAL_GRADIENTS } from '@/types';
import type { RegionId } from '@/types';
import { EffectsPanel } from '@/components/Effects/EffectsPanel';
import { ChevronDown, ChevronRight, Plus, ArrowUpDown, Sun, Moon, Shuffle } from 'lucide-react';
import './LeftSidebar.css';

interface LeftSidebarProps {
  collapsed: boolean;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ collapsed }) => {
  const selectedRegion = useTapestryStore((state) => state.selectedRegion);
  const setSelectedRegion = useTapestryStore((state) => state.setSelectedRegion);
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
  const theme = useTapestryStore((state) => state.theme);
  const toggleTheme = useTapestryStore((state) => state.toggleTheme);

  const showFilmGrain = useTapestryStore((state) => state.showFilmGrain);
  const showScanlines = useTapestryStore((state) => state.showScanlines);
  const showVeins = useTapestryStore((state) => state.showVeins);
  const showSplatter = useTapestryStore((state) => state.showSplatter);
  const showBrushStrokes = useTapestryStore((state) => state.showBrushStrokes);
  const toggleFilmGrain = useTapestryStore((state) => state.toggleFilmGrain);
  const toggleScanlines = useTapestryStore((state) => state.toggleScanlines);
  const toggleVeins = useTapestryStore((state) => state.toggleVeins);
  const toggleSplatter = useTapestryStore((state) => state.toggleSplatter);
  const toggleBrushStrokes = useTapestryStore((state) => state.toggleBrushStrokes);

  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isRegionExpanded, setIsRegionExpanded] = useState(true);
  const [isEffectsExpanded, setIsEffectsExpanded] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const canvasSize = useTapestryStore((state) => state.canvas.size);
  const setCanvasSize = useTapestryStore((state) => state.setCanvasSize);
  const [tempWidth, setTempWidth] = useState(canvasSize.width.toString());
  const [tempHeight, setTempHeight] = useState(canvasSize.height.toString());

  const selectedGradient = REGIONAL_GRADIENTS.find((g) => g.id === selectedRegion);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRegionOpen(false);
      }
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRegionSelect = (regionId: RegionId) => {
    setSelectedRegion(regionId);
    setIsRegionOpen(false);
  };

  const handleApplyDimensions = () => {
    const width = parseInt(tempWidth);
    const height = parseInt(tempHeight);
    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      setCanvasSize(width, height);
    }
  };

  const handleAddGrain = () => {
    if (!showFilmGrain) toggleFilmGrain();
    setShowAddMenu(false);
  };

  const handleAddScanlines = () => {
    if (!showScanlines) toggleScanlines();
    setShowAddMenu(false);
  };

  const handleAddVeins = () => {
    if (!showVeins) toggleVeins();
    setShowAddMenu(false);
  };

  const handleAddSplatter = () => {
    if (!showSplatter) toggleSplatter();
    setShowAddMenu(false);
  };

  const addSplatterLayer = useTapestryStore((state) => state.addSplatterLayer);

  const handleAddSplatterLayer = () => {
    addSplatterLayer();
    setShowAddMenu(false);
  };

  const handleAddBrushStrokes = () => {
    if (!showBrushStrokes) toggleBrushStrokes();
    setShowAddMenu(false);
  };

  // Update temp values when canvas size changes externally
  useEffect(() => {
    setTempWidth(canvasSize.width.toString());
    setTempHeight(canvasSize.height.toString());
  }, [canvasSize.width, canvasSize.height]);

  if (collapsed) return null;

  return (
    <div className="left-sidebar">
      {/* Header with Logo and Title */}
      <div className="sidebar-header">
        <div className="header-content">
          <img src="/assets/logo.svg" alt="Wise" className="wise-logo" />
          <div className="title-group">
            <h1 className="sidebar-title">TAPESTRY</h1>
            <h2 className="sidebar-title">GENERATOR</h2>
          </div>
        </div>
      </div>

      <div className="sidebar-section" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
        <div className="section-header-clickable" onClick={() => setIsRegionExpanded(!isRegionExpanded)}>
          <button className="section-toggle-btn">
            {isRegionExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          <h3 className="section-title">REGION</h3>
          {!isRegionExpanded && (
            <span className="section-subtitle">{selectedGradient?.displayName}</span>
          )}
        </div>
        {isRegionExpanded && (
          <div style={{ marginTop: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div className="custom-dropdown" ref={dropdownRef} style={{ flex: 1 }}>
            <button
              className="custom-dropdown-button"
              onClick={() => setIsRegionOpen(!isRegionOpen)}
            >
              <div className="custom-dropdown-selected">
                {selectedGradient?.thumbnail ? (
                  <img
                    src={selectedGradient.thumbnail}
                    alt={selectedGradient.displayName}
                    className="region-thumbnail"
                    style={{
                      width: '32px',
                      height: '32px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  />
                ) : (
                  <div className="custom-dropdown-colors">
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: selectedGradient?.duotone.colorA }}
                    />
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: selectedGradient?.duotone.colorB }}
                    />
                  </div>
                )}
                <span>{selectedGradient?.displayName}</span>
              </div>
              <span className="custom-dropdown-arrow">{isRegionOpen ? '▲' : '▼'}</span>
            </button>

            {isRegionOpen && (
              <div className="custom-dropdown-menu">
                {REGIONAL_GRADIENTS.map((gradient) => (
                  <button
                    key={gradient.id}
                    className={`custom-dropdown-option ${
                      selectedRegion === gradient.id ? 'selected' : ''
                    }`}
                    onClick={() => handleRegionSelect(gradient.id)}
                  >
                    {gradient.thumbnail ? (
                      <img
                        src={gradient.thumbnail}
                        alt={gradient.displayName}
                        className="region-thumbnail"
                        style={{
                          width: '32px',
                          height: '32px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-xs)',
                        }}
                      />
                    ) : (
                      <div className="custom-dropdown-colors">
                        <div
                          className="color-swatch"
                          style={{ backgroundColor: gradient.duotone.colorA }}
                        />
                        <div
                          className="color-swatch"
                          style={{ backgroundColor: gradient.duotone.colorB }}
                        />
                      </div>
                    )}
                    <span>{gradient.displayName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={flipDuotoneColors}
            className="effects-icon-btn"
            title="Flip colors"
          >
            <ArrowUpDown size={16} />
          </button>
        </div>

        {/* Duotone Noise Parameters */}
        <div style={{ marginTop: 'var(--space-4)' }}>
          {selectedRegion === 'custom' && (
            <>
              <div className="parameter-group">
                <label className="parameter-label">Color A</label>
                <input
                  type="color"
                  value={currentDuotoneColors?.colorA || '#163300'}
                  onChange={(e) =>
                    setCustomDuotoneColors({
                      colorA: e.target.value,
                      colorB: currentDuotoneColors?.colorB || '#9fe870',
                    })
                  }
                  className="color-input"
                />
              </div>
              <div className="parameter-group">
                <label className="parameter-label">Color B</label>
                <input
                  type="color"
                  value={currentDuotoneColors?.colorB || '#9fe870'}
                  onChange={(e) =>
                    setCustomDuotoneColors({
                      colorA: currentDuotoneColors?.colorA || '#163300',
                      colorB: e.target.value,
                    })
                  }
                  className="color-input"
                />
              </div>
            </>
          )}

          <div className="parameter-group">
            <label className="parameter-label">Scale</label>
            <div className="parameter-control">
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={currentNoiseParams?.scale || 1.0}
                onChange={(e) => handleNoiseParamChange('scale', parseFloat(e.target.value))}
                className="parameter-slider"
              />
              <span className="parameter-value">{currentNoiseParams?.scale.toFixed(1)}</span>
            </div>
          </div>

          <div className="parameter-group">
            <label className="parameter-label">Octaves</label>
            <div className="parameter-control">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={currentNoiseParams?.octaves || 2}
                onChange={(e) => handleNoiseParamChange('octaves', parseInt(e.target.value))}
                className="parameter-slider"
              />
              <span className="parameter-value">{currentNoiseParams?.octaves}</span>
            </div>
          </div>

          <div className="parameter-group">
            <label className="parameter-label">Lacunarity</label>
            <div className="parameter-control">
              <input
                type="range"
                min="1"
                max="4"
                step="0.1"
                value={currentNoiseParams?.lacunarity || 2.0}
                onChange={(e) => handleNoiseParamChange('lacunarity', parseFloat(e.target.value))}
                className="parameter-slider"
              />
              <span className="parameter-value">{currentNoiseParams?.lacunarity.toFixed(1)}</span>
            </div>
          </div>

          <div className="parameter-group">
            <label className="parameter-label">Gain</label>
            <div className="parameter-control">
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={currentNoiseParams?.gain || 0.5}
                onChange={(e) => handleNoiseParamChange('gain', parseFloat(e.target.value))}
                className="parameter-slider"
              />
              <span className="parameter-value">{currentNoiseParams?.gain.toFixed(2)}</span>
            </div>
          </div>

          <div className="parameter-group">
            <label className="parameter-label">Contrast</label>
            <div className="parameter-control">
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={currentNoiseParams?.contrast || 8.0}
                onChange={(e) => handleNoiseParamChange('contrast', parseFloat(e.target.value))}
                className="parameter-slider"
              />
              <span className="parameter-value">{currentNoiseParams?.contrast.toFixed(1)}</span>
            </div>
          </div>

          <div className="parameter-group">
            <label className="parameter-label">Blend Mode</label>
            <select
              className="parameter-select"
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

          <div className="parameter-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="parameter-label" style={{ marginBottom: 0 }}>Seed</label>
              <button
                onClick={randomizeNoiseSeed}
                className="parameter-icon-btn"
                title="Randomize"
              >
                <Shuffle size={14} />
              </button>
            </div>
            <div className="parameter-control" style={{ marginTop: 'var(--space-2)' }}>
              <input
                type="range"
                min="0"
                max="10000"
                step="1"
                value={Math.round(noiseSeed * 10000)}
                onChange={(e) => setNoiseSeed(parseInt(e.target.value) / 10000)}
                className="parameter-slider"
              />
              <span className="parameter-value">{Math.round(noiseSeed * 10000)}</span>
            </div>
          </div>
        </div>
          </div>
        )}
      </div>

      <div className="sidebar-section" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
        <div className="section-header">
          <div className="section-header-clickable" onClick={() => setIsEffectsExpanded(!isEffectsExpanded)}>
            <button className="section-toggle-btn">
              {isEffectsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            <h3 className="section-title">EFFECTS</h3>
          </div>
          <div ref={addMenuRef} style={{ position: 'relative' }}>
            <button
              className="effects-icon-btn"
              onClick={() => setShowAddMenu(!showAddMenu)}
              title="Add effect"
            >
              <Plus size={16} />
            </button>
            {showAddMenu && (
              <div className="add-menu">
                <button className="add-menu-item" onClick={handleAddGrain} disabled={showFilmGrain}>
                  + Film Grain
                </button>
                <button className="add-menu-item" onClick={handleAddScanlines} disabled={showScanlines}>
                  + Scanlines
                </button>
                <button className="add-menu-item" onClick={handleAddVeins} disabled={showVeins}>
                  + Veins
                </button>
                <button className="add-menu-item" onClick={handleAddSplatterLayer}>
                  + Splatter Layer <span style={{ opacity: 0.6, fontSize: '0.85em' }}>(add multiple)</span>
                </button>
                <button className="add-menu-item" onClick={handleAddBrushStrokes} disabled={showBrushStrokes}>
                  + Brush Strokes
                </button>
              </div>
            )}
          </div>
        </div>
        {isEffectsExpanded && (
          <div style={{ marginTop: 'var(--space-4)' }}>
            <EffectsPanel />
          </div>
        )}
      </div>
    </div>
  );
};

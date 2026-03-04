import React, { useState, useRef, useEffect } from 'react';
import { useTapestryStore } from '@/store/useTapestryStore';
import { REGIONAL_GRADIENTS } from '@/types';
import type { RegionId } from '@/types';
import { EffectsPanel } from '@/components/Effects/EffectsPanel';
import { useSwooshStore } from '@/store/useSwooshStore';
import { generateRandomSwoosh } from '@/utils/swooshGenerator';
import { ChevronDown, ChevronRight, Plus, ArrowUpDown, Sun, Moon, Shuffle, Eye, EyeOff, Trash2 } from 'lucide-react';
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
  const controlMode = useTapestryStore((state) => state.controlMode);

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

  // Swoosh store
  const swooshes = useSwooshStore((state) => state.swooshes);
  const selectedSwooshId = useSwooshStore((state) => state.selectedSwooshId);
  const selectSwoosh = useSwooshStore((state) => state.selectSwoosh);
  const addSwoosh = useSwooshStore((state) => state.addSwoosh);
  const removeSwoosh = useSwooshStore((state) => state.removeSwoosh);
  const updateSwoosh = useSwooshStore((state) => state.updateSwoosh);
  const drawMode = useSwooshStore((state) => state.drawMode);
  const toggleDrawMode = useSwooshStore((state) => state.toggleDrawMode);

  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isRegionExpanded, setIsRegionExpanded] = useState(true);
  const [isSwooshExpanded, setIsSwooshExpanded] = useState(true);
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

  // Swoosh handler
  const handleAddSwoosh = () => {
    const gradient = REGIONAL_GRADIENTS.find((g) => g.id === selectedRegion);
    const duotoneColors = customDuotoneColors || gradient?.duotone;
    const strokeColor = duotoneColors?.colorA || '#ffffff';

    const swoosh = generateRandomSwoosh(canvasSize.width, canvasSize.height, strokeColor);
    addSwoosh(swoosh);
    selectSwoosh(swoosh.id);
  };

  // Opacity drag handler
  const [isDraggingOpacity, setIsDraggingOpacity] = useState(false);
  const [dragStartValue, setDragStartValue] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const dragUpdateRef = useRef<((value: number) => void) | null>(null);

  const handleOpacityDrag = (
    e: React.MouseEvent,
    initialValue: number,
    updateFn: (value: number) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOpacity(true);
    setDragStartValue(initialValue);
    setDragStartY(e.clientY);
    dragUpdateRef.current = updateFn;
  };

  useEffect(() => {
    if (!isDraggingOpacity) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = dragStartY - e.clientY;
      const sensitivity = 0.5;
      const newValue = Math.max(0, Math.min(100, dragStartValue + deltaY * sensitivity));
      dragUpdateRef.current?.(newValue);
    };

    const handleMouseUp = () => {
      setIsDraggingOpacity(false);
      dragUpdateRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingOpacity, dragStartValue, dragStartY]);

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
          <div className="custom-dropdown" ref={dropdownRef}>
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
                      width: '24px',
                      height: '24px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-xs)',
                      flexShrink: 0,
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
                          width: '24px',
                          height: '24px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-xs)',
                          flexShrink: 0,
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

{controlMode === 'manual' ? (
            <>
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
            </>
          ) : (
            <div className="parameter-group">
              <button
                onClick={randomizeNoiseSeed}
                className="randomize-button"
                title="Randomize all noise parameters"
              >
                <Shuffle size={16} />
                <span>Randomize Noise</span>
              </button>
            </div>
          )}
        </div>
          </div>
        )}
      </div>

      {/* SWOOSH SECTION */}
      <div className="sidebar-section" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
        <div className="section-header">
          <div className="section-header-clickable" onClick={() => setIsSwooshExpanded(!isSwooshExpanded)}>
            <button className="section-toggle-btn">
              {isSwooshExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            <h3 className="section-title">DRAW SWOOSH</h3>
          </div>
        </div>
        {isSwooshExpanded && (
          <div style={{ marginTop: 'var(--space-4)' }}>
            {/* Control mode specific buttons */}
            {controlMode === 'manual' ? (
              // Manual mode: Show Draw toggle and Generate button
              <div style={{
                marginBottom: swooshes.length > 0 ? 'var(--space-3)' : '0',
                display: 'flex',
                gap: 'var(--space-2)',
              }}>
                <button
                  onClick={toggleDrawMode}
                  style={{
                    flex: 1,
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: drawMode ? 'var(--color-primary-dark)' : 'var(--color-surface-secondary)',
                    border: `1px solid ${drawMode ? 'var(--color-primary)' : 'var(--color-border-light)'}`,
                    borderRadius: 'var(--radius-sm)',
                    color: drawMode ? 'var(--color-primary)' : 'var(--color-text-primary)',
                    fontSize: '11px',
                    fontWeight: 'var(--font-weight-semibold)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  title={drawMode ? 'Switch to generate mode' : 'Switch to draw mode'}
                >
                  Draw
                </button>

                {!drawMode && (
                  <button
                    onClick={handleAddSwoosh}
                    style={{
                      flex: 1,
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      backgroundColor: 'var(--color-surface-secondary)',
                      border: '1px solid var(--color-border-light)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                      fontSize: '11px',
                      fontWeight: 'var(--font-weight-semibold)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)';
                      e.currentTarget.style.borderColor = 'var(--color-border-light)';
                    }}
                  >
                    <Shuffle size={12} />
                    Generate
                  </button>
                )}
              </div>
            ) : (
              // Auto mode: Only show Generate button
              <div style={{
                marginBottom: swooshes.length > 0 ? 'var(--space-3)' : '0',
              }}>
                <button
                  onClick={handleAddSwoosh}
                  className="randomize-button"
                  style={{ width: '100%' }}
                  title="Generate random swoosh"
                >
                  <Shuffle size={16} />
                  <span>Generate Swoosh</span>
                </button>
              </div>
            )}

            {/* Swoosh layers list */}
            {swooshes.map((swoosh, index) => (
              <div key={swoosh.id} style={{ marginBottom: 'var(--space-2)' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: selectedSwooshId === swoosh.id ? 'var(--color-primary-dark)' : 'transparent',
                    border: selectedSwooshId === swoosh.id ? '1px solid var(--color-primary)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)',
                  }}
                  onClick={() => {
                    if (selectedSwooshId === swoosh.id) {
                      selectSwoosh(null);
                    } else {
                      selectSwoosh(swoosh.id);
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSwooshId !== swoosh.id) {
                      e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSwooshId !== swoosh.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: selectedSwooshId === swoosh.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    {/* Color indicator square */}
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '2px',
                      backgroundColor: swoosh.color,
                      border: '1px solid var(--color-border-light)',
                      flexShrink: 0,
                    }} />
                    Swoosh {index + 1}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Visibility toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        useSwooshStore.getState().updateSwoosh(swoosh.id, { visible: swoosh.visible === false ? true : false });
                      }}
                      style={{
                        padding: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-xs)',
                        color: swoosh.visible === false ? 'var(--color-text-tertiary)' : (selectedSwooshId === swoosh.id ? 'var(--color-primary)' : 'var(--color-text-secondary)'),
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                      title={swoosh.visible === false ? 'Show' : 'Hide'}
                    >
                      {swoosh.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>

                    {/* Opacity */}
                    <div className="inline-opacity-control" style={{
                      borderColor: selectedSwooshId === swoosh.id ? 'var(--color-primary)' : undefined,
                    }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(swoosh.opacity * 100)}
                        onChange={(e) => {
                          e.stopPropagation();
                          const value = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100;
                          useSwooshStore.getState().updateSwoosh(swoosh.id, { opacity: value });
                        }}
                        onMouseDown={(e) => {
                          if (e.button === 0) {
                            handleOpacityDrag(
                              e,
                              Math.round(swoosh.opacity * 100),
                              (newValue) => useSwooshStore.getState().updateSwoosh(swoosh.id, { opacity: newValue / 100 })
                            );
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-opacity-input"
                        style={{
                          color: selectedSwooshId === swoosh.id ? 'var(--color-primary)' : undefined,
                        }}
                      />
                      <span className="inline-opacity-percent" style={{
                        color: selectedSwooshId === swoosh.id ? 'var(--color-primary)' : undefined,
                      }}>%</span>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSwoosh(swoosh.id);
                      }}
                      style={{
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-xs)',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                      }}
                      title="Remove this swoosh"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Swoosh parameters - shown when selected and in manual mode */}
                {selectedSwooshId === swoosh.id && controlMode === 'manual' && (
                  <div style={{
                    marginTop: 'var(--space-2)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-light)',
                  }}>
                    {/* Color picker */}
                    <div className="parameter-group">
                      <label className="parameter-label">Color</label>
                      <input
                        type="color"
                        value={swoosh.color}
                        onChange={(e) => updateSwoosh(swoosh.id, { color: e.target.value })}
                        className="color-input"
                        style={{ width: '100%' }}
                      />
                    </div>

                    {/* Blur control */}
                    <div className="parameter-group">
                      <label className="parameter-label">Blur</label>
                      <div className="parameter-control">
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="0.5"
                          value={swoosh.blur || 0}
                          onChange={(e) => updateSwoosh(swoosh.id, { blur: parseFloat(e.target.value) })}
                          className="parameter-slider"
                        />
                        <span className="parameter-value">{(swoosh.blur || 0).toFixed(1)}px</span>
                      </div>
                    </div>

                    {/* Thickness control */}
                    <div className="parameter-group">
                      <label className="parameter-label">Thickness</label>
                      <div className="parameter-control">
                        <input
                          type="range"
                          min="10"
                          max="500"
                          step="10"
                          value={swoosh.thickness}
                          onChange={(e) => updateSwoosh(swoosh.id, { thickness: parseFloat(e.target.value) })}
                          className="parameter-slider"
                        />
                        <span className="parameter-value">{Math.round(swoosh.thickness)}px</span>
                      </div>
                    </div>

                    {/* Blend mode */}
                    <div className="parameter-group">
                      <label className="parameter-label">Blend Mode</label>
                      <select
                        className="parameter-select"
                        value={swoosh.blendMode}
                        onChange={(e) => updateSwoosh(swoosh.id, { blendMode: e.target.value })}
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
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
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

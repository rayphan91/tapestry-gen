import React from 'react';
import { useTapestryStore } from '@/store/useTapestryStore';
import { Eye, EyeOff, ChevronDown, ChevronRight, Shuffle, Trash2 } from 'lucide-react';
import './EffectsPanel.css';

type ItemType = 'grain' | 'scanlines' | 'veins' | 'splatter' | 'brushswooshs';

// Utility function to get slider fill background
const getSliderBackground = (value: number, min: number, max: number, theme?: string) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const fillColor = theme === 'light' ? '#163300' : '#9fe870';
  return `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percentage}%, var(--color-border-light) ${percentage}%, var(--color-border-light) 100%)`;
};

interface LayerItem {
  id: string;
  type: ItemType;
  enabled: boolean;
  visible: boolean;
  name?: string;
}

export const EffectsPanel: React.FC = () => {
  const selectedRegion = useTapestryStore((state) => state.selectedRegion);
  const showFilmGrain = useTapestryStore((state) => state.showFilmGrain);
  const showScanlines = useTapestryStore((state) => state.showScanlines);
  const showVeins = useTapestryStore((state) => state.showVeins);
  const showSplatter = useTapestryStore((state) => state.showSplatter);
  const showBrushStrokes = useTapestryStore((state) => state.showBrushStrokes);
  const splatterLayers = useTapestryStore((state) => state.splatterLayers);
  const toggleFilmGrain = useTapestryStore((state) => state.toggleFilmGrain);
  const toggleScanlines = useTapestryStore((state) => state.toggleScanlines);
  const toggleVeins = useTapestryStore((state) => state.toggleVeins);
  const toggleSplatter = useTapestryStore((state) => state.toggleSplatter);
  const toggleBrushStrokes = useTapestryStore((state) => state.toggleBrushStrokes);
  const addSplatterLayer = useTapestryStore((state) => state.addSplatterLayer);
  const removeSplatterLayer = useTapestryStore((state) => state.removeSplatterLayer);
  const updateSplatterLayer = useTapestryStore((state) => state.updateSplatterLayer);
  const filmGrainIntensity = useTapestryStore((state) => state.filmGrainIntensity);
  const filmGrainOpacity = useTapestryStore((state) => state.filmGrainOpacity);
  const filmGrainSize = useTapestryStore((state) => state.filmGrainSize);
  const filmGrainBlendMode = useTapestryStore((state) => state.filmGrainBlendMode);
  const scanlinesIntensity = useTapestryStore((state) => state.scanlinesIntensity);
  const scanlinesOpacity = useTapestryStore((state) => state.scanlinesOpacity);
  const scanlinesSpacing = useTapestryStore((state) => state.scanlinesSpacing);
  const scanlinesThickness = useTapestryStore((state) => state.scanlinesThickness);
  const scanlinesBlendMode = useTapestryStore((state) => state.scanlinesBlendMode);
  const veinsIntensity = useTapestryStore((state) => state.veinsIntensity);
  const veinsOpacity = useTapestryStore((state) => state.veinsOpacity);
  const veinsScale = useTapestryStore((state) => state.veinsScale);
  const veinsBlendMode = useTapestryStore((state) => state.veinsBlendMode);
  const veinsColor = useTapestryStore((state) => state.veinsColor);
  const veinsSeed = useTapestryStore((state) => state.veinsSeed);
  const splatterIntensity = useTapestryStore((state) => state.splatterIntensity);
  const splatterOpacity = useTapestryStore((state) => state.splatterOpacity);
  const splatterScale = useTapestryStore((state) => state.splatterScale);
  const splatterBlendMode = useTapestryStore((state) => state.splatterBlendMode);
  const splatterColor = useTapestryStore((state) => state.splatterColor);
  const splatterColor2 = useTapestryStore((state) => state.splatterColor2);
  const splatterColor3 = useTapestryStore((state) => state.splatterColor3);
  const splatterSeed = useTapestryStore((state) => state.splatterSeed);
  const brushStrokesIntensity = useTapestryStore((state) => state.brushStrokesIntensity);
  const brushStrokesOpacity = useTapestryStore((state) => state.brushStrokesOpacity);
  const brushStrokesScale = useTapestryStore((state) => state.brushStrokesScale);
  const brushStrokesGrain = useTapestryStore((state) => state.brushStrokesGrain);
  const brushStrokesBlendMode = useTapestryStore((state) => state.brushStrokesBlendMode);
  const brushStrokesColor = useTapestryStore((state) => state.brushStrokesColor);
  const brushStrokesColor2 = useTapestryStore((state) => state.brushStrokesColor2);
  const brushStrokesColor3 = useTapestryStore((state) => state.brushStrokesColor3);
  const brushStrokesSeed = useTapestryStore((state) => state.brushStrokesSeed);

  const setFilmGrainIntensity = useTapestryStore((state) => state.setFilmGrainIntensity);
  const setFilmGrainOpacity = useTapestryStore((state) => state.setFilmGrainOpacity);
  const setFilmGrainSize = useTapestryStore((state) => state.setFilmGrainSize);
  const setFilmGrainBlendMode = useTapestryStore((state) => state.setFilmGrainBlendMode);
  const setScanlinesIntensity = useTapestryStore((state) => state.setScanlinesIntensity);
  const setScanlinesOpacity = useTapestryStore((state) => state.setScanlinesOpacity);
  const setScanlinesSpacing = useTapestryStore((state) => state.setScanlinesSpacing);
  const setScanlinesThickness = useTapestryStore((state) => state.setScanlinesThickness);
  const setScanlinesBlendMode = useTapestryStore((state) => state.setScanlinesBlendMode);
  const setVeinsIntensity = useTapestryStore((state) => state.setVeinsIntensity);
  const setVeinsOpacity = useTapestryStore((state) => state.setVeinsOpacity);
  const setVeinsScale = useTapestryStore((state) => state.setVeinsScale);
  const setVeinsBlendMode = useTapestryStore((state) => state.setVeinsBlendMode);
  const setVeinsColor = useTapestryStore((state) => state.setVeinsColor);
  const setVeinsSeed = useTapestryStore((state) => state.setVeinsSeed);
  const randomizeVeinsSeed = useTapestryStore((state) => state.randomizeVeinsSeed);
  const setSplatterIntensity = useTapestryStore((state) => state.setSplatterIntensity);
  const setSplatterOpacity = useTapestryStore((state) => state.setSplatterOpacity);
  const setSplatterScale = useTapestryStore((state) => state.setSplatterScale);
  const setSplatterBlendMode = useTapestryStore((state) => state.setSplatterBlendMode);
  const setSplatterColor = useTapestryStore((state) => state.setSplatterColor);
  const setSplatterColor2 = useTapestryStore((state) => state.setSplatterColor2);
  const setSplatterColor3 = useTapestryStore((state) => state.setSplatterColor3);
  const setSplatterSeed = useTapestryStore((state) => state.setSplatterSeed);
  const randomizeSplatterSeed = useTapestryStore((state) => state.randomizeSplatterSeed);
  const swooshOpacity = useTapestryStore((state) => state.swooshOpacity);
  const setSwooshOpacity = useTapestryStore((state) => state.setSwooshOpacity);
  const setBrushStrokesIntensity = useTapestryStore((state) => state.setBrushStrokesIntensity);
  const setBrushStrokesOpacity = useTapestryStore((state) => state.setBrushStrokesOpacity);
  const setBrushStrokesScale = useTapestryStore((state) => state.setBrushStrokesScale);
  const setBrushStrokesGrain = useTapestryStore((state) => state.setBrushStrokesGrain);
  const setBrushStrokesBlendMode = useTapestryStore((state) => state.setBrushStrokesBlendMode);
  const setBrushStrokesColor = useTapestryStore((state) => state.setBrushStrokesColor);
  const setBrushStrokesColor2 = useTapestryStore((state) => state.setBrushStrokesColor2);
  const setBrushStrokesColor3 = useTapestryStore((state) => state.setBrushStrokesColor3);
  const setBrushStrokesSeed = useTapestryStore((state) => state.setBrushStrokesSeed);
  const randomizeBrushStrokesSeed = useTapestryStore((state) => state.randomizeBrushStrokesSeed);
  const randomizeAllEffects = useTapestryStore((state) => state.randomizeAllEffects);
  const controlMode = useTapestryStore((state) => state.controlMode);

  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);
  const [expandedItemId, setExpandedItemId] = React.useState<string | null>(null);
  const [expandedSplatterLayers, setExpandedSplatterLayers] = React.useState<Set<string>>(new Set());

  // Auto-update brush swooshs color when Euro region is selected
  React.useEffect(() => {
    if (selectedRegion === 'euro' && showBrushStrokes) {
      setBrushStrokesColor('#512425');
    }
  }, [selectedRegion, showBrushStrokes, setBrushStrokesColor]);

  // Keyboard shortcuts for opacity (1-9 = 10%-90%, 0 = 100%)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if a number key is pressed and no input is focused
      if (e.key >= '0' && e.key <= '9' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        if (!selectedItemId) return;

        const opacityValue = e.key === '0' ? 1 : parseInt(e.key) / 10;

        // Apply to selected item
        if (selectedItemId === 'grain') setFilmGrainOpacity(opacityValue);
        else if (selectedItemId === 'scanlines') setScanlinesOpacity(opacityValue);
        else if (selectedItemId === 'veins') setVeinsOpacity(opacityValue);
        else if (selectedItemId === 'brushswooshs') setBrushStrokesOpacity(opacityValue);
        // For splatter layers
        else if (selectedItemId.startsWith('splatter-')) {
          const layer = splatterLayers.find(l => l.id === selectedItemId);
          if (layer) updateSplatterLayer(selectedItemId, { opacity: opacityValue });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, setFilmGrainOpacity, setScanlinesOpacity, setVeinsOpacity, setBrushStrokesOpacity, splatterLayers, updateSplatterLayer]);

  // Build unified list: all effects shown by default
  const layerItems: LayerItem[] = [];

  // Add all effects (always shown, can be hidden via visibility toggle)
  layerItems.push({
    id: 'grain',
    type: 'grain',
    enabled: true,
    visible: showFilmGrain,
  });

  layerItems.push({
    id: 'scanlines',
    type: 'scanlines',
    enabled: true,
    visible: showScanlines,
  });

  layerItems.push({
    id: 'veins',
    type: 'veins',
    enabled: true,
    visible: showVeins,
  });

  layerItems.push({
    id: 'brushswooshs',
    type: 'brushswooshs',
    enabled: true,
    visible: showBrushStrokes,
  });

  // Add single grouped splatter item
  layerItems.push({
    id: 'splatter',
    type: 'splatter',
    enabled: true,
    visible: showSplatter,
    name: 'Splatter',
  });

  const handleItemTypeChange = (itemId: string, item: LayerItem, newType: ItemType) => {

    // Normal effect type change
    // Toggle off current effect
    if (itemId === 'grain') toggleFilmGrain();
    else if (itemId === 'scanlines') toggleScanlines();
    else if (itemId === 'veins') toggleVeins();
    else if (itemId === 'splatter') toggleSplatter();
    else if (itemId === 'brushswooshs') toggleBrushStrokes();

    // Toggle on new effect
    if (newType === 'grain') toggleFilmGrain();
    else if (newType === 'scanlines') toggleScanlines();
    else if (newType === 'veins') toggleVeins();
    else if (newType === 'splatter') toggleSplatter();
    else if (newType === 'brushswooshs') toggleBrushStrokes();
  };

  const handleRemoveItem = (itemId: string, item: LayerItem) => {
    if (itemId === 'grain') toggleFilmGrain();
    else if (itemId === 'scanlines') toggleScanlines();
    else if (itemId === 'veins') toggleVeins();
    else if (itemId === 'splatter') toggleSplatter();
    else if (itemId === 'brushswooshs') toggleBrushStrokes();
    else if (itemId.startsWith('splatter-')) {
      // Remove individual splatter layer
      removeSplatterLayer(itemId);
    }
  };

  const handleItemClick = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleToggleExpand = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

  // Drag handler for opacity values
  const handleOpacityDrag = (
    e: React.MouseEvent<HTMLInputElement>,
    currentValue: number,
    onChange: (value: number) => void
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startValue = currentValue;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const sensitivity = 0.5; // Adjust sensitivity
      const newValue = Math.max(0, Math.min(100, startValue + deltaX * sensitivity));
      onChange(newValue);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="effects-panel">
      {controlMode === 'auto' && (
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <button
            onClick={randomizeAllEffects}
            className="randomize-button"
            style={{ width: '100%' }}
            title="Randomize all effects at once"
          >
            <Shuffle size={16} />
            <span>Randomize All Effects</span>
          </button>
        </div>
      )}
      <div className="effects-list">
        {layerItems.length === 0 ? (
          <div className="effects-empty">No items added</div>
        ) : (
          layerItems.map((item) => (
            <React.Fragment key={item.id}>
              <div
                className={`effect-item ${selectedItemId === item.id ? 'selected' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                {controlMode === 'manual' && (
                  <button
                    className="effect-action-btn"
                    onClick={(e) => handleToggleExpand(item.id, e)}
                    title="Toggle parameters"
                  >
                    {expandedItemId === item.id ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </button>
                )}

                <div className="effect-name-box">
                  <span className="effect-name">
                    {item.type === 'grain' && 'FILM GRAIN'}
                    {item.type === 'scanlines' && 'SCANLINES'}
                    {item.type === 'veins' && 'VEINS'}
                    {item.type === 'splatter' && 'SPLATTER'}
                    {item.type === 'brushswooshs' && 'BRUSH STROKES'}
                  </span>

                  {/* Inline Opacity Control - now including splatter and swoosh for global control */}
                  <div className="inline-opacity-control">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={
                        item.type === 'grain' ? Math.round(filmGrainOpacity * 100) :
                        item.type === 'scanlines' ? Math.round(scanlinesOpacity * 100) :
                        item.type === 'veins' ? Math.round(veinsOpacity * 100) :
                        item.type === 'brushswooshs' ? Math.round(brushStrokesOpacity * 100) :
                        item.type === 'splatter' ? Math.round(splatterOpacity * 100) :
                        0
                      }
                      onChange={(e) => {
                        e.stopPropagation();
                        const value = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100;
                        if (item.type === 'grain') setFilmGrainOpacity(value);
                        else if (item.type === 'scanlines') setScanlinesOpacity(value);
                        else if (item.type === 'veins') setVeinsOpacity(value);
                        else if (item.type === 'brushswooshs') setBrushStrokesOpacity(value);
                        else if (item.type === 'splatter') setSplatterOpacity(value);
                      }}
                      onMouseDown={(e) => {
                        if (e.button === 0) { // Left mouse button only
                          const currentValue =
                            item.type === 'grain' ? Math.round(filmGrainOpacity * 100) :
                            item.type === 'scanlines' ? Math.round(scanlinesOpacity * 100) :
                            item.type === 'veins' ? Math.round(veinsOpacity * 100) :
                            item.type === 'brushswooshs' ? Math.round(brushStrokesOpacity * 100) :
                            item.type === 'splatter' ? Math.round(splatterOpacity * 100) :
                            0;

                          const onChange = (newValue: number) => {
                            const value = newValue / 100;
                            if (item.type === 'grain') setFilmGrainOpacity(value);
                            else if (item.type === 'scanlines') setScanlinesOpacity(value);
                            else if (item.type === 'veins') setVeinsOpacity(value);
                            else if (item.type === 'brushswooshs') setBrushStrokesOpacity(value);
                            else if (item.type === 'splatter') setSplatterOpacity(value);
                          };

                          handleOpacityDrag(e, currentValue, onChange);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-opacity-input"
                    />
                    <span className="inline-opacity-percent">%</span>
                  </div>
                </div>

                <button
                  className="effect-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle visibility based on item type
                    if (item.id === 'grain') toggleFilmGrain();
                    else if (item.id === 'scanlines') toggleScanlines();
                    else if (item.id === 'veins') toggleVeins();
                    else if (item.id === 'splatter') toggleSplatter();
                    else if (item.id === 'brushswooshs') toggleBrushStrokes();
                  }}
                  title={item.visible ? "Hide layer" : "Show layer"}
                >
                  {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>

              {/* Inline Parameters - shown when expanded */}
              {expandedItemId === item.id && controlMode === 'manual' && (
                <div className="effect-parameters">
                  {item.type === 'grain' && controlMode === 'manual' && (
                    <>
                      <div className="parameter-group">
                        <label className="parameter-label">Intensity</label>
                        <div className="parameter-control">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={filmGrainIntensity * 100}
                            onChange={(e) => setFilmGrainIntensity(parseFloat(e.target.value) / 100)}
                            className="parameter-slider"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={Math.round(filmGrainIntensity * 100)}
                            onChange={(e) => setFilmGrainIntensity(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100)}
                            className="parameter-value"
                          />
                        </div>
                      </div>

                      <div className="parameter-group">
                        <label className="parameter-label">Grain Size</label>
                        <div className="parameter-control">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={filmGrainSize * 100}
                            onChange={(e) => setFilmGrainSize(parseFloat(e.target.value) / 100)}
                            className="parameter-slider"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={Math.round(filmGrainSize * 100)}
                            onChange={(e) => setFilmGrainSize(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100)}
                            className="parameter-value"
                          />
                        </div>
                      </div>

                      <div className="parameter-group">
                        <label className="parameter-label">Blend Mode</label>
                        <select
                          className="parameter-select"
                          value={filmGrainBlendMode}
                          onChange={(e) => setFilmGrainBlendMode(e.target.value)}
                        >
                          <option value="normal">Normal</option>
                          <option value="multiply">Multiply</option>
                          <option value="screen">Screen</option>
                          <option value="overlay">Overlay</option>
                          <option value="soft-light">Soft Light</option>
                        </select>
                      </div>
                    </>
                  )}

                  {item.type === 'scanlines' && controlMode === 'manual' && (
                    <>
                      <div className="parameter-group">
                        <label className="parameter-label">Intensity</label>
                        <div className="parameter-control">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={scanlinesIntensity * 100}
                            onChange={(e) => setScanlinesIntensity(parseFloat(e.target.value) / 100)}
                            className="parameter-slider"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={Math.round(scanlinesIntensity * 100)}
                            onChange={(e) => setScanlinesIntensity(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100)}
                            className="parameter-value"
                          />
                        </div>
                      </div>

                      <div className="parameter-group">
                        <label className="parameter-label">Spacing</label>
                        <div className="parameter-control">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={scanlinesSpacing}
                            onChange={(e) => setScanlinesSpacing(parseFloat(e.target.value))}
                            className="parameter-slider"
                          />
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={scanlinesSpacing}
                            onChange={(e) => setScanlinesSpacing(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                            className="parameter-value"
                          />
                        </div>
                      </div>

                      <div className="parameter-group">
                        <label className="parameter-label">Thickness</label>
                        <div className="parameter-control">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={scanlinesThickness * 100}
                            onChange={(e) => setScanlinesThickness(parseFloat(e.target.value) / 100)}
                            className="parameter-slider"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={Math.round(scanlinesThickness * 100)}
                            onChange={(e) => setScanlinesThickness(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100)}
                            className="parameter-value"
                          />
                        </div>
                      </div>

                      <div className="parameter-group">
                        <label className="parameter-label">Blend Mode</label>
                        <select
                          className="parameter-select"
                          value={scanlinesBlendMode}
                          onChange={(e) => setScanlinesBlendMode(e.target.value)}
                        >
                          <option value="normal">Normal</option>
                          <option value="multiply">Multiply</option>
                          <option value="screen">Screen</option>
                          <option value="overlay">Overlay</option>
                          <option value="darken">Darken</option>
                          <option value="lighten">Lighten</option>
                          <option value="soft-light">Soft Light</option>
                        </select>
                      </div>
                    </>
                  )}

                  {item.type === 'veins' && (
                    <>
                      {controlMode === 'manual' ? (
                        <>
                          <div className="parameter-group">
                            <label className="parameter-label">Intensity</label>
                            <div className="parameter-control">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={veinsIntensity * 100}
                                onChange={(e) => setVeinsIntensity(parseFloat(e.target.value) / 100)}
                                className="parameter-slider"
                              />
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={Math.round(veinsIntensity * 100)}
                                onChange={(e) => setVeinsIntensity(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100)}
                                className="parameter-value"
                              />
                            </div>
                          </div>

                          <div className="parameter-group">
                            <label className="parameter-label">Scale</label>
                            <div className="parameter-control">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={veinsScale * 100}
                                onChange={(e) => setVeinsScale(parseFloat(e.target.value) / 100)}
                                className="parameter-slider"
                              />
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={Math.round(veinsScale * 100)}
                                onChange={(e) => setVeinsScale(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100)}
                                className="parameter-value"
                              />
                            </div>
                          </div>

                          <div className="parameter-group">
                            <label className="parameter-label">Color</label>
                            <input
                              type="color"
                              value={veinsColor}
                              onChange={(e) => setVeinsColor(e.target.value)}
                              className="color-input"
                            />
                          </div>

                          <div className="parameter-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label className="parameter-label" style={{ marginBottom: 0 }}>Seed</label>
                              <button
                                onClick={randomizeVeinsSeed}
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
                                max="1000000"
                                step="1"
                                value={Math.round(veinsSeed * 1000000)}
                                onChange={(e) => setVeinsSeed(parseFloat(e.target.value) / 1000000)}
                                className="parameter-slider"
                              />
                              <input
                                type="number"
                                min="0"
                                max="1000000"
                                value={Math.round(veinsSeed * 1000000)}
                                onChange={(e) => setVeinsSeed(Math.max(0, Math.min(1000000, parseInt(e.target.value) || 0)) / 1000000)}
                                className="parameter-value"
                              />
                            </div>
                          </div>

                          <div className="parameter-group">
                            <label className="parameter-label">Blend Mode</label>
                            <select
                              className="parameter-select"
                              value={veinsBlendMode}
                              onChange={(e) => setVeinsBlendMode(e.target.value)}
                            >
                              <option value="normal">Normal</option>
                              <option value="multiply">Multiply</option>
                              <option value="screen">Screen</option>
                              <option value="overlay">Overlay</option>
                              <option value="darken">Darken</option>
                              <option value="lighten">Lighten</option>
                              <option value="soft-light">Soft Light</option>
                              <option value="color-dodge">Color Dodge</option>
                              <option value="color-burn">Color Burn</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        <div className="parameter-group">
                          <button
                            onClick={randomizeVeinsSeed}
                            className="randomize-button"
                            title="Randomize veins"
                          >
                            <Shuffle size={16} />
                            <span>Randomize Veins</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}


                  {item.type === 'splatter' && (
                    <>
                      {/* Show all splatter layers in a grouped format */}
                      {splatterLayers.map((splatterLayer, index) => {
                        const isLayerExpanded = expandedSplatterLayers.has(splatterLayer.id);

                        return (
                          <div key={splatterLayer.id} style={{
                            marginBottom: 'var(--space-4)',
                            paddingBottom: 'var(--space-3)',
                            borderBottom: index < splatterLayers.length - 1 ? '1px solid var(--color-border-light)' : 'none'
                          }}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: isLayerExpanded ? 'var(--space-2)' : '0',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: 'var(--radius-sm)',
                                transition: 'background-color var(--transition-fast)',
                              }}
                              onClick={() => {
                                const newExpanded = new Set(expandedSplatterLayers);
                                if (isLayerExpanded) {
                                  newExpanded.delete(splatterLayer.id);
                                } else {
                                  newExpanded.add(splatterLayer.id);
                                }
                                setExpandedSplatterLayers(newExpanded);
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <span style={{
                                fontSize: '11px',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--color-text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}>
                                {isLayerExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                Layer {index + 1}
                              </span>

                              {/* Inline Opacity Control for Splatter Layer */}
                              <div className="inline-opacity-control">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={Math.round(splatterLayer.opacity * 100)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const value = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100;
                                    updateSplatterLayer(splatterLayer.id, { opacity: value });
                                  }}
                                  onMouseDown={(e) => {
                                    if (e.button === 0) {
                                      handleOpacityDrag(
                                        e,
                                        Math.round(splatterLayer.opacity * 100),
                                        (newValue) => updateSplatterLayer(splatterLayer.id, { opacity: newValue / 100 })
                                      );
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-opacity-input"
                                />
                                <span className="inline-opacity-percent">%</span>
                              </div>
                            </div>

                            {isLayerExpanded && (
                              <>
                                {controlMode === 'manual' ? (
                                  <>
                                    <div className="parameter-group">
                                      <label className="parameter-label">Intensity</label>
                                      <div className="parameter-control">
                                        <input
                                          type="range"
                                          min="0"
                                          max="100"
                                          value={splatterLayer.intensity * 100}
                                          onChange={(e) => updateSplatterLayer(splatterLayer.id, { intensity: parseFloat(e.target.value) / 100 })}
                                          className="parameter-slider"
                                        />
                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          value={Math.round(splatterLayer.intensity * 100)}
                                          onChange={(e) => updateSplatterLayer(splatterLayer.id, { intensity: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100 })}
                                          className="parameter-value"
                                        />
                                      </div>
                                    </div>

                                    <div className="parameter-group">
                                      <label className="parameter-label">Scale</label>
                                      <div className="parameter-control">
                                        <input
                                          type="range"
                                          min="0"
                                          max="100"
                                          value={splatterLayer.scale * 100}
                                          onChange={(e) => updateSplatterLayer(splatterLayer.id, { scale: parseFloat(e.target.value) / 100 })}
                                          className="parameter-slider"
                                        />
                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          value={Math.round(splatterLayer.scale * 100)}
                                          onChange={(e) => updateSplatterLayer(splatterLayer.id, { scale: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100 })}
                                          className="parameter-value"
                                        />
                                      </div>
                                    </div>

                                    <div className="parameter-group">
                                      <label className="parameter-label">Color</label>
                                      <input
                                        type="color"
                                        value={splatterLayer.color}
                                        onChange={(e) => updateSplatterLayer(splatterLayer.id, { color: e.target.value })}
                                        className="color-input"
                                      />
                                    </div>

                                    <div className="parameter-group">
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label className="parameter-label" style={{ marginBottom: 0 }}>Seed</label>
                                        <button
                                          onClick={() => updateSplatterLayer(splatterLayer.id, { seed: Math.random() })}
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
                                          max="1000000"
                                          step="1"
                                          value={Math.round(splatterLayer.seed * 1000000)}
                                          onChange={(e) => updateSplatterLayer(splatterLayer.id, { seed: parseFloat(e.target.value) / 1000000 })}
                                          className="parameter-slider"
                                        />
                                        <input
                                          type="number"
                                          min="0"
                                          max="1000000"
                                          value={Math.round(splatterLayer.seed * 1000000)}
                                          onChange={(e) => updateSplatterLayer(splatterLayer.id, { seed: Math.max(0, Math.min(1000000, parseInt(e.target.value) || 0)) / 1000000 })}
                                          className="parameter-value"
                                        />
                                      </div>
                                    </div>

                                    <div className="parameter-group">
                                      <label className="parameter-label">Blend Mode</label>
                                      <select
                                        className="parameter-select"
                                        value={splatterLayer.blendMode}
                                        onChange={(e) => updateSplatterLayer(splatterLayer.id, { blendMode: e.target.value })}
                                      >
                                        <option value="normal">Normal</option>
                                        <option value="multiply">Multiply</option>
                                        <option value="screen">Screen</option>
                                        <option value="overlay">Overlay</option>
                                        <option value="darken">Darken</option>
                                        <option value="lighten">Lighten</option>
                                        <option value="soft-light">Soft Light</option>
                                      </select>
                                    </div>
                                  </>
                                ) : (
                                  <div className="parameter-group">
                                    <button
                                      onClick={() => updateSplatterLayer(splatterLayer.id, { seed: Math.random() })}
                                      className="randomize-button"
                                      title="Randomize splatter layer"
                                    >
                                      <Shuffle size={16} />
                                      <span>Randomize Layer {index + 1}</span>
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}

                  {item.type === 'brushswooshs' && (
                    <>
                      {controlMode === 'manual' ? (
                        <>
                          <div className="parameter-group">
                            <label className="parameter-label">Intensity</label>
                            <div className="parameter-control">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={brushStrokesIntensity * 100}
                                onChange={(e) => setBrushStrokesIntensity(parseFloat(e.target.value) / 100)}
                                className="parameter-slider"
                              />
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={Math.round(brushStrokesIntensity * 100)}
                                onChange={(e) => setBrushStrokesIntensity(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100)}
                                className="parameter-value"
                              />
                            </div>
                          </div>

                          <div className="parameter-group">
                            <label className="parameter-label">Scale</label>
                            <div className="parameter-control">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={brushStrokesScale * 100}
                                onChange={(e) => setBrushStrokesScale(parseFloat(e.target.value) / 100)}
                                className="parameter-slider"
                              />
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={Math.round(brushStrokesScale * 100)}
                                onChange={(e) => setBrushStrokesScale(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100)}
                                className="parameter-value"
                              />
                            </div>
                          </div>

                          <div className="parameter-group">
                            <label className="parameter-label">Grain</label>
                            <div className="parameter-control">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={brushStrokesGrain * 100}
                                onChange={(e) => setBrushStrokesGrain(parseFloat(e.target.value) / 100)}
                                className="parameter-slider"
                              />
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={Math.round(brushStrokesGrain * 100)}
                                onChange={(e) => setBrushStrokesGrain(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) / 100)}
                                className="parameter-value"
                              />
                            </div>
                          </div>

                          <div className="parameter-group">
                            <label className="parameter-label">Color</label>
                            <input
                              type="color"
                              value={brushStrokesColor}
                              onChange={(e) => setBrushStrokesColor(e.target.value)}
                              className="color-input"
                            />
                          </div>

                          <div className="parameter-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label className="parameter-label" style={{ marginBottom: 0 }}>Seed</label>
                              <button
                                onClick={randomizeBrushStrokesSeed}
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
                                max="1000000"
                                step="1"
                                value={Math.round(brushStrokesSeed * 1000000)}
                                onChange={(e) => setBrushStrokesSeed(parseFloat(e.target.value) / 1000000)}
                                className="parameter-slider"
                              />
                              <input
                                type="number"
                                min="0"
                                max="1000000"
                                value={Math.round(brushStrokesSeed * 1000000)}
                                onChange={(e) => setBrushStrokesSeed(Math.max(0, Math.min(1000000, parseInt(e.target.value) || 0)) / 1000000)}
                                className="parameter-value"
                              />
                            </div>
                          </div>

                          <div className="parameter-group">
                            <label className="parameter-label">Blend Mode</label>
                            <select
                              className="parameter-select"
                              value={brushStrokesBlendMode}
                              onChange={(e) => setBrushStrokesBlendMode(e.target.value)}
                            >
                              <option value="normal">Normal</option>
                              <option value="multiply">Multiply</option>
                              <option value="screen">Screen</option>
                              <option value="overlay">Overlay</option>
                              <option value="darken">Darken</option>
                              <option value="lighten">Lighten</option>
                              <option value="soft-light">Soft Light</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        <div className="parameter-group">
                          <button
                            onClick={randomizeBrushStrokesSeed}
                            className="randomize-button"
                            title="Randomize brush strokes"
                          >
                            <Shuffle size={16} />
                            <span>Randomize Brush Strokes</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {item.type === 'swoosh' && (
                    <>
                      {/* Swoosh mode toggle and action buttons - moved to top */}
                      <div style={{
                        marginBottom: swooshes.length > 0 ? 'var(--space-3)' : '0',
                        display: 'flex',
                        gap: 'var(--space-2)',
                      }}>
                        {/* Mode toggle button */}
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

                        {/* Add Swoosh button - only show in generate mode */}
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

                      {/* Show all swoosh layers in a simple list */}
                      {swooshes.map((swoosh, index) => {
                        return (
                          <div key={swoosh.id} style={{
                            marginBottom: 'var(--space-2)',
                          }}>
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
                                // Toggle selection
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
                                Swoosh {index + 1}
                              </span>

                              {/* Inline Opacity Control for Swoosh Layer */}
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

                                {/* Remove button next to opacity */}
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
                                  title="Remove this swoosh layer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

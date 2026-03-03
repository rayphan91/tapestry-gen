import React from 'react';
import { useTapestryStore } from '@/store/useTapestryStore';
import { useSwooshStore } from '@/store/useSwooshStore';
import { REGIONAL_GRADIENTS } from '@/types';
import { Moon, Sun, Eye, EyeOff, Lock, Unlock, Trash2, GripVertical, Shuffle, ChevronDown } from 'lucide-react';
import { generateRandomSwoosh } from '@/utils/swooshGenerator';
import './RightSidebar.css';

interface RightSidebarProps {
  collapsed: boolean;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ collapsed }) => {
  const selectedRegion = useTapestryStore((state) => state.selectedRegion);
  const selectionType = useTapestryStore((state) => state.selectionType);
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
  const canvasSize = useTapestryStore((state) => state.canvas.size);
  const setCanvasSize = useTapestryStore((state) => state.setCanvasSize);
  const layers = useTapestryStore((state) => state.layers);
  const addLayer = useTapestryStore((state) => state.addLayer);
  const removeLayer = useTapestryStore((state) => state.removeLayer);
  const selectedLayerId = useTapestryStore((state) => state.selectedLayerId);
  const updateLayer = useTapestryStore((state) => state.updateLayer);
  const selectLayer = useTapestryStore((state) => state.selectLayer);
  const toggleLayerVisibility = useTapestryStore((state) => state.toggleLayerVisibility);
  const toggleLayerLock = useTapestryStore((state) => state.toggleLayerLock);
  const reorderLayers = useTapestryStore((state) => state.reorderLayers);

  const swooshes = useSwooshStore((state) => state.swooshes);
  const selectedSwooshId = useSwooshStore((state) => state.selectedSwooshId);
  const selectSwoosh = useSwooshStore((state) => state.selectSwoosh);
  const removeSwoosh = useSwooshStore((state) => state.removeSwoosh);
  const addSwoosh = useSwooshStore((state) => state.addSwoosh);

  const collageImages = useTapestryStore((state) => state.collageImages);
  const collageSeed = useTapestryStore((state) => state.collageSeed);
  const collageParams = useTapestryStore((state) => state.collageParams);
  const collageBlendMode = useTapestryStore((state) => state.collageBlendMode);
  const addCollageImage = useTapestryStore((state) => state.addCollageImage);
  const removeCollageImage = useTapestryStore((state) => state.removeCollageImage);
  const setCollageSeed = useTapestryStore((state) => state.setCollageSeed);
  const randomizeCollageSeed = useTapestryStore((state) => state.randomizeCollageSeed);
  const setCollageParam = useTapestryStore((state) => state.setCollageParam);
  const setCollageBlendMode = useTapestryStore((state) => state.setCollageBlendMode);

  const selectedLayer = layers.find(l => l.id === selectedLayerId) as any;

  const [draggedLayerId, setDraggedLayerId] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const collageFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleWidthChange = (value: string) => {
    const width = parseInt(value);
    if (!isNaN(width) && width > 0 && width <= 10000) {
      setCanvasSize(width, canvasSize.height);
    }
  };

  const handleHeightChange = (value: string) => {
    const height = parseInt(value);
    if (!isNaN(height) && height > 0 && height <= 10000) {
      setCanvasSize(canvasSize.width, height);
    }
  };

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const img = new Image();

        img.onload = () => {
          // Create an ImageLayer
          const imageLayer: any = {
            id: `image-${Date.now()}-${Math.random()}`,
            name: file.name,
            type: 'image',
            visible: true,
            locked: false,
            order: layers.length,
            imageUrl,
            originalWidth: img.width,
            originalHeight: img.height,
            fileName: file.name,
            transform: {
              position: { x: canvasSize.width / 2, y: canvasSize.height / 2 },
              dimensions: { width: img.width, height: img.height },
              rotation: 0,
              scaleX: 1,
              scaleY: 1,
              flipX: false,
              flipY: false,
            },
            appearance: {
              blendMode: 'normal' as const,
              opacity: 100,
              feather: 0,
              hue: 0,
              saturation: 0,
              brightness: 0,
              contrast: 0,
            },
          };

          addLayer(imageLayer);
        };

        img.src = imageUrl;
      };

      reader.readAsDataURL(file);
    });
  };

  const handleCollageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          addCollageImage(file.name, url, img);
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragStart = (e: React.DragEvent, layerId: string) => {
    setDraggedLayerId(layerId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault();
    if (!draggedLayerId || draggedLayerId === targetLayerId) return;

    const allLayerIds = layers.map(l => l.id);
    const draggedIndex = allLayerIds.indexOf(draggedLayerId);
    const targetIndex = allLayerIds.indexOf(targetLayerId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLayerIds = [...allLayerIds];
    newLayerIds.splice(draggedIndex, 1);
    newLayerIds.splice(targetIndex, 0, draggedLayerId);

    reorderLayers(newLayerIds);
    setDraggedLayerId(null);
  };

  const handleLayerSelect = (layerId: string, type: 'image' | 'swoosh') => {
    if (type === 'image') {
      selectLayer(layerId);
      selectSwoosh(null);
    } else {
      selectSwoosh(layerId);
      selectLayer(null);
    }
  };

  const handleLayerDelete = (layerId: string, type: 'image' | 'swoosh') => {
    if (type === 'image') {
      removeLayer(layerId);
    } else {
      removeSwoosh(layerId);
    }
  };

  const handleAddStroke = () => {
    const gradient = REGIONAL_GRADIENTS.find((g) => g.id === selectedRegion);
    const duotoneColors = customDuotoneColors || gradient?.duotone;
    const strokeColor = duotoneColors?.colorA || '#ffffff';

    const swoosh = generateRandomSwoosh(canvasSize.width, canvasSize.height, strokeColor);
    addSwoosh(swoosh);
    selectSwoosh(swoosh.id);
    selectLayer(null);
  };

  const handleExport = async () => {
    try {
      // Find the canvas-wrapper div which contains all layers
      const canvasWrapper = document.querySelector('.canvas-wrapper') as HTMLElement;
      if (!canvasWrapper) {
        console.error('Canvas wrapper not found');
        return;
      }

      // Create a temporary canvas to combine all layers
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvasSize.width;
      exportCanvas.height = canvasSize.height;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Get the WebGL canvas (background gradient)
      const webglCanvas = canvasWrapper.querySelector('canvas') as HTMLCanvasElement;
      if (webglCanvas) {
        ctx.drawImage(webglCanvas, 0, 0);
      }

      // Get all layer images and effects
      const layers = canvasWrapper.querySelectorAll('.image-layer, .effect-layer');
      for (const layer of Array.from(layers)) {
        const element = layer as HTMLElement;
        const img = element.querySelector('img');
        if (img && img.complete) {
          // Apply transforms and draw
          const transform = element.style.transform;
          ctx.save();
          // Note: For a complete implementation, you'd need to parse CSS transforms
          // This is a simplified version
          ctx.globalAlpha = parseFloat(element.style.opacity || '1');
          ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
          ctx.restore();
        }
      }

      // Convert to blob and download
      exportCanvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `tapestry-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (collapsed) return null;

  return (
    <div className="right-sidebar">
      {/* Collage Panel */}
      <div className="sidebar-section">
        <details className="collapsible-panel" open>
          <summary className="panel-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ChevronDown size={12} style={{ flexShrink: 0 }} />
              COLLAGE
            </span>
          </summary>
          <div className="panel-content">
            <input
              ref={collageFileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleCollageFileChange}
              style={{ display: 'none' }}
            />
            <button
              className="upload-button"
              onClick={() => collageFileInputRef.current?.click()}
            >
              + Add Images ({collageImages.length})
            </button>

            {/* Image thumbnails */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginTop: '8px' }}>
              {collageImages.length > 0 ? (
                collageImages.map((img) => (
                  <div
                    key={img.id}
                    style={{
                      aspectRatio: '1',
                      backgroundImage: `url(${img.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                    title={img.name}
                  >
                    <button
                      onClick={() => removeCollageImage(img.id)}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        border: 'none',
                        width: '18px',
                        height: '18px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        borderRadius: '3px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                // Empty placeholder thumbnails showing region-specific country suggestions
                <>
                  {(() => {
                    const regionCountries: Record<string, string[]> = {
                      'australasia_sasia': ['🇦🇺 AUS', '🇳🇿 NZ', '🇮🇳 IN', '🇵🇰 PK', '🇧🇩 BD', '🇱🇰 LK', '🇳🇵 NP', '🇫🇯 FJ', '🇵🇬 PG'],
                      'namerica_easia_pink': ['🇺🇸 USA', '🇨🇦 CA', '🇯🇵 JP', '🇰🇷 KR', '🇨🇳 CN', '🇹🇼 TW', '🇭🇰 HK', '🇲🇴 MO', '🇲🇳 MN'],
                      'europe_seasia': ['🇬🇧 UK', '🇫🇷 FR', '🇩🇪 DE', '🇹🇭 TH', '🇻🇳 VN', '🇸🇬 SG', '🇲🇾 MY', '🇵🇭 PH', '🇮🇩 ID'],
                      'neurope_wafrica': ['🇸🇪 SE', '🇳🇴 NO', '🇫🇮 FI', '🇳🇬 NG', '🇬🇭 GH', '🇸🇳 SN', '🇨🇮 CI', '🇲🇱 ML', '🇧🇯 BJ'],
                      'namerica_samerica': ['🇺🇸 USA', '🇨🇦 CA', '🇲🇽 MX', '🇧🇷 BR', '🇦🇷 AR', '🇨🇱 CL', '🇨🇴 CO', '🇵🇪 PE', '🇻🇪 VE'],
                      'namerica_easia_green': ['🇺🇸 USA', '🇨🇦 CA', '🇯🇵 JP', '🇰🇷 KR', '🇨🇳 CN', '🇹🇼 TW', '🇭🇰 HK', '🇲🇴 MO', '🇲🇳 MN'],
                      'nafrica_europe': ['🇪🇬 EG', '🇲🇦 MA', '🇹🇳 TN', '🇬🇧 UK', '🇫🇷 FR', '🇪🇸 ES', '🇮🇹 IT', '🇵🇹 PT', '🇬🇷 GR'],
                      'csamerica_europe': ['🇲🇽 MX', '🇬🇹 GT', '🇧🇷 BR', '🇬🇧 UK', '🇫🇷 FR', '🇩🇪 DE', '🇪🇸 ES', '🇮🇹 IT', '🇳🇱 NL'],
                      'middleeast_australasia': ['🇦🇪 UAE', '🇸🇦 SA', '🇶🇦 QA', '🇦🇺 AUS', '🇳🇿 NZ', '🇮🇱 IL', '🇯🇴 JO', '🇰🇼 KW', '🇴🇲 OM'],
                      'europe_uk': ['🇬🇧 UK', '🇫🇷 FR', '🇩🇪 DE', '🇮🇹 IT', '🇪🇸 ES', '🇳🇱 NL', '🇧🇪 BE', '🇨🇭 CH', '🇦🇹 AT'],
                      'custom': ['🇬🇧 UK', '🇺🇸 USA', '🇦🇺 AUS', '🇯🇵 JP', '🇧🇷 BR', '🇮🇳 IN', '🇿🇦 ZA', '🇩🇪 DE', '🇨🇳 CN'],
                    };
                    const countries = regionCountries[selectedRegion] || regionCountries['custom'];
                    return countries.map((country) => (
                    <div
                      key={country}
                      onClick={() => collageFileInputRef.current?.click()}
                      style={{
                        aspectRatio: '1',
                        background: 'var(--color-surface-secondary)',
                        border: '1px dashed var(--color-border)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '9px',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-tertiary)',
                        transition: 'all var(--transition-fast)',
                        textAlign: 'center',
                        padding: '4px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-surface-hover)';
                        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--color-surface-secondary)';
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                        e.currentTarget.style.color = 'var(--color-text-tertiary)';
                      }}
                      title={`Add ${country.split(' ')[1]} images`}
                    >
                      {country}
                    </div>
                    ));
                  })()}
                </>
              )}
            </div>

            <div className="property-group" style={{ marginTop: '12px' }}>
              <label className="property-label">Fog</label>
              <div className="parameter-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={collageParams.fog * 100}
                  onChange={(e) => setCollageParam('fog', parseFloat(e.target.value) / 100)}
                  className="parameter-slider"
                />
                <span className="parameter-value">{Math.round(collageParams.fog * 100)}%</span>
              </div>
            </div>

            <div className="property-group">
              <label className="property-label">Vignette</label>
              <div className="parameter-control">
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={collageParams.vignette * 100}
                  onChange={(e) => setCollageParam('vignette', parseFloat(e.target.value) / 100)}
                  className="parameter-slider"
                />
                <span className="parameter-value">{Math.round(collageParams.vignette * 100)}%</span>
              </div>
            </div>

            <div className="property-group">
              <label className="property-label">Scale Spread</label>
              <div className="parameter-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={collageParams.scaleSpread * 100}
                  onChange={(e) => setCollageParam('scaleSpread', parseFloat(e.target.value) / 100)}
                  className="parameter-slider"
                />
                <span className="parameter-value">{Math.round(collageParams.scaleSpread * 100)}%</span>
              </div>
            </div>

            <div className="property-group">
              <label className="property-label">Rotation</label>
              <div className="parameter-control">
                <input
                  type="range"
                  min="0"
                  max="45"
                  value={collageParams.rotation}
                  onChange={(e) => setCollageParam('rotation', parseFloat(e.target.value))}
                  className="parameter-slider"
                />
                <span className="parameter-value">{Math.round(collageParams.rotation)}°</span>
              </div>
            </div>

            <div className="property-group">
              <label className="property-label">Grain</label>
              <div className="parameter-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={collageParams.grain * 100}
                  onChange={(e) => setCollageParam('grain', parseFloat(e.target.value) / 100)}
                  className="parameter-slider"
                />
                <span className="parameter-value">{Math.round(collageParams.grain * 100)}%</span>
              </div>
            </div>

            <div className="property-group">
              <label className="property-label">Saturation</label>
              <div className="parameter-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={collageParams.saturation * 100}
                  onChange={(e) => setCollageParam('saturation', parseFloat(e.target.value) / 100)}
                  className="parameter-slider"
                />
                <span className="parameter-value">{Math.round(collageParams.saturation * 100)}%</span>
              </div>
            </div>

            <div className="property-group">
              <label className="property-label">Seed</label>
              <div className="parameter-control" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  value={collageSeed * 1000000}
                  onChange={(e) => setCollageSeed(parseFloat(e.target.value) / 1000000)}
                  className="parameter-slider"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={randomizeCollageSeed}
                  className="layer-control-btn"
                  title="Randomize seed"
                >
                  <Shuffle size={14} />
                </button>
              </div>
            </div>

            <div className="property-group">
              <label className="property-label">Blend Mode</label>
              <select
                className="property-select"
                value={collageBlendMode}
                onChange={(e) => setCollageBlendMode(e.target.value)}
              >
                <option value="source-over">Normal</option>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="soft-light">Soft Light</option>
                <option value="luminosity">Luminosity</option>
              </select>
            </div>
          </div>
        </details>
      </div>

      {/* Position - Only show when image layer is selected */}
      {selectedLayer && selectedLayer.type === 'image' && (
        <div className="sidebar-section">
          <details className="collapsible-panel" open>
            <summary className="panel-header">POSITION</summary>
            <div className="panel-content">
              <div className="property-group">
                <label className="property-label">Position</label>
                <div className="property-row">
                  <div className="property-input-wrapper">
                    <span className="input-label">X</span>
                    <input
                      type="number"
                      value={Math.round(selectedLayer.transform.position.x)}
                      onChange={(e) => updateLayer(selectedLayer.id, {
                        transform: {
                          ...selectedLayer.transform,
                          position: { ...selectedLayer.transform.position, x: parseFloat(e.target.value) || 0 }
                        }
                      })}
                      className="property-input"
                    />
                  </div>
                  <div className="property-input-wrapper">
                    <span className="input-label">Y</span>
                    <input
                      type="number"
                      value={Math.round(selectedLayer.transform.position.y)}
                      onChange={(e) => updateLayer(selectedLayer.id, {
                        transform: {
                          ...selectedLayer.transform,
                          position: { ...selectedLayer.transform.position, y: parseFloat(e.target.value) || 0 }
                        }
                      })}
                      className="property-input"
                    />
                  </div>
                </div>
              </div>

              <div className="property-group">
                <label className="property-label">Rotation</label>
                <div className="parameter-control">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedLayer.transform.rotation}
                    onChange={(e) => updateLayer(selectedLayer.id, {
                      transform: { ...selectedLayer.transform, rotation: parseFloat(e.target.value) }
                    })}
                    className="parameter-slider"
                  />
                  <span className="parameter-value">{Math.round(selectedLayer.transform.rotation)}°</span>
                </div>
              </div>

              <div className="property-group">
                <label className="property-label">Dimensions</label>
                <div className="property-row">
                  <div className="property-input-wrapper">
                    <span className="input-label">W</span>
                    <input
                      type="number"
                      value={Math.round(selectedLayer.transform.dimensions.width)}
                      onChange={(e) => updateLayer(selectedLayer.id, {
                        transform: {
                          ...selectedLayer.transform,
                          dimensions: { ...selectedLayer.transform.dimensions, width: parseFloat(e.target.value) || 50 }
                        }
                      })}
                      className="property-input"
                    />
                  </div>
                  <div className="property-input-wrapper">
                    <span className="input-label">H</span>
                    <input
                      type="number"
                      value={Math.round(selectedLayer.transform.dimensions.height)}
                      onChange={(e) => updateLayer(selectedLayer.id, {
                        transform: {
                          ...selectedLayer.transform,
                          dimensions: { ...selectedLayer.transform.dimensions, height: parseFloat(e.target.value) || 50 }
                        }
                      })}
                      className="property-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      )}

      {/* Appearance - Only show when image layer is selected */}
      {selectedLayer && selectedLayer.type === 'image' && (
        <div className="sidebar-section">
          <details className="collapsible-panel" open>
            <summary className="panel-header">APPEARANCE</summary>
            <div className="panel-content">
              <div className="property-group">
                <label className="property-label">Blending Mode</label>
                <select
                  className="property-select"
                  value={selectedLayer.appearance.blendMode}
                  onChange={(e) => updateLayer(selectedLayer.id, {
                    appearance: { ...selectedLayer.appearance, blendMode: e.target.value as any }
                  })}
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

              <div className="property-group">
                <label className="property-label">Opacity</label>
                <div className="parameter-control">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedLayer.appearance.opacity}
                    onChange={(e) => updateLayer(selectedLayer.id, {
                      appearance: { ...selectedLayer.appearance, opacity: parseFloat(e.target.value) }
                    })}
                    className="parameter-slider"
                  />
                  <span className="parameter-value">{Math.round(selectedLayer.appearance.opacity)}%</span>
                </div>
              </div>

              <div className="property-group">
                <label className="property-label">Hue</label>
                <div className="parameter-control">
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={selectedLayer.appearance.hue}
                    onChange={(e) => updateLayer(selectedLayer.id, {
                      appearance: { ...selectedLayer.appearance, hue: parseFloat(e.target.value) }
                    })}
                    className="parameter-slider"
                  />
                  <span className="parameter-value">{Math.round(selectedLayer.appearance.hue)}°</span>
                </div>
              </div>

              <div className="property-group">
                <label className="property-label">Saturation</label>
                <div className="parameter-control">
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={selectedLayer.appearance.saturation}
                    onChange={(e) => updateLayer(selectedLayer.id, {
                      appearance: { ...selectedLayer.appearance, saturation: parseFloat(e.target.value) }
                    })}
                    className="parameter-slider"
                  />
                  <span className="parameter-value">{Math.round(selectedLayer.appearance.saturation)}%</span>
                </div>
              </div>

              <div className="property-group">
                <label className="property-label">Brightness</label>
                <div className="parameter-control">
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={selectedLayer.appearance.brightness}
                    onChange={(e) => updateLayer(selectedLayer.id, {
                      appearance: { ...selectedLayer.appearance, brightness: parseFloat(e.target.value) }
                    })}
                    className="parameter-slider"
                  />
                  <span className="parameter-value">{Math.round(selectedLayer.appearance.brightness)}%</span>
                </div>
              </div>

              <div className="property-group">
                <label className="property-label">Contrast</label>
                <div className="parameter-control">
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={selectedLayer.appearance.contrast}
                    onChange={(e) => updateLayer(selectedLayer.id, {
                      appearance: { ...selectedLayer.appearance, contrast: parseFloat(e.target.value) }
                    })}
                    className="parameter-slider"
                  />
                  <span className="parameter-value">{Math.round(selectedLayer.appearance.contrast)}%</span>
                </div>
              </div>

              <div className="property-group">
                <label className="property-label">Feather</label>
                <div className="parameter-control">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedLayer.appearance.feather}
                    onChange={(e) => updateLayer(selectedLayer.id, {
                      appearance: { ...selectedLayer.appearance, feather: parseFloat(e.target.value) }
                    })}
                    className="parameter-slider"
                  />
                  <span className="parameter-value">{Math.round(selectedLayer.appearance.feather)}</span>
                </div>
              </div>

              <div className="property-group">
                <label className="property-label">Flip</label>
                <div className="flip-buttons">
                  <button
                    className="flip-button"
                    onClick={() => updateLayer(selectedLayer.id, {
                      transform: { ...selectedLayer.transform, flipX: !selectedLayer.transform.flipX }
                    })}
                  >
                    Horizontal
                  </button>
                  <button
                    className="flip-button"
                    onClick={() => updateLayer(selectedLayer.id, {
                      transform: { ...selectedLayer.transform, flipY: !selectedLayer.transform.flipY }
                    })}
                  >
                    Vertical
                  </button>
                </div>
              </div>
            </div>
          </details>
        </div>
      )}


      {/* Canvas Dimensions & Export - at bottom */}
      <div className="bottom-controls">
        <div className="dimensions-control">
          <input
            type="number"
            min="1"
            max="10000"
            value={canvasSize.width}
            onChange={(e) => handleWidthChange(e.target.value)}
            onBlur={(e) => {
              if (!e.target.value || parseInt(e.target.value) <= 0) {
                setCanvasSize(800, canvasSize.height);
              }
            }}
            className="dimension-input"
            placeholder="Width"
          />
          <span className="dimension-separator">×</span>
          <input
            type="number"
            min="1"
            max="10000"
            value={canvasSize.height}
            onChange={(e) => handleHeightChange(e.target.value)}
            onBlur={(e) => {
              if (!e.target.value || parseInt(e.target.value) <= 0) {
                setCanvasSize(canvasSize.width, 600);
              }
            }}
            className="dimension-input"
            placeholder="Height"
          />
        </div>

        <button className="export-button" onClick={handleExport} title="Export">
          Export
        </button>
      </div>
    </div>
  );
};

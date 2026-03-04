import React from 'react';
import { useTapestryStore } from '@/store/useTapestryStore';
import { useSwooshStore } from '@/store/useSwooshStore';
import { REGIONAL_GRADIENTS } from '@/types';
import { Moon, Sun, Eye, EyeOff, Lock, Unlock, Trash2, GripVertical, Shuffle, Sparkles } from 'lucide-react';
import { generateRandomSwoosh } from '@/utils/swooshGenerator';
import { generateImagesWithDALLE, getCountryNameFromFlag, type MasterPromptTheme } from '@/services/imageGeneration';
import { ExportModal } from '../Export/ExportModal';
import { Flag } from '../common/Flag';
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
  const clearAllCollageImages = useTapestryStore((state) => state.clearAllCollageImages);
  const setCollageSeed = useTapestryStore((state) => state.setCollageSeed);
  const randomizeCollageSeed = useTapestryStore((state) => state.randomizeCollageSeed);
  const setCollageParam = useTapestryStore((state) => state.setCollageParam);
  const setCollageBlendMode = useTapestryStore((state) => state.setCollageBlendMode);
  const controlMode = useTapestryStore((state) => state.controlMode);

  const selectedLayer = layers.find(l => l.id === selectedLayerId) as any;

  const [draggedLayerId, setDraggedLayerId] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generateCount, setGenerateCount] = React.useState(3);
  const [generateTheme, setGenerateTheme] = React.useState<MasterPromptTheme>('mixed');
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);
  const [showCountryDropdown, setShowCountryDropdown] = React.useState(false);
  // API key - users need to provide their own OpenAI API key
  // You can set this via environment variable or user input
  const [apiKey, setApiKey] = React.useState('');
  const [generationProgress, setGenerationProgress] = React.useState(0);
  const [generationTotal, setGenerationTotal] = React.useState(0);
  const [showExportModal, setShowExportModal] = React.useState(false);

  const countryDropdownRef = React.useRef<HTMLDivElement>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  // Close country dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          // Add to procedural collage system instead of as a layer
          addCollageImage(file.name, imageUrl, img);
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

  const handleGenerateImages = async () => {
    if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_API_KEY_HERE') {
      alert('API key not configured. Please contact the developer.');
      return;
    }

    setIsGenerating(true);
    try {
      // Available themes for randomization when "mixed" is selected
      const themes: MasterPromptTheme[] = ['nature', 'cities', 'textures', 'culture'];

      // Determine which countries to generate from
      let countriesToGenerate: string[];

      if (selectedCountries.length > 0) {
        // Select mode: Use manually selected countries
        countriesToGenerate = selectedCountries;
      } else {
        // Random mode: Randomly select countries from the gradient's countries list
        const gradient = REGIONAL_GRADIENTS.find(g => g.id === selectedRegion);
        if (!gradient || !gradient.countries || gradient.countries.length === 0) {
          throw new Error('Selected region has no countries defined');
        }

        // Randomly pick N countries from the region (without replacement)
        const shuffled = [...gradient.countries].sort(() => Math.random() - 0.5);
        countriesToGenerate = shuffled.slice(0, Math.min(generateCount, gradient.countries.length));
      }

      setGenerationTotal(countriesToGenerate.length);
      setGenerationProgress(0);

      let currentProgress = 0;

      // Generate one image per country
      for (const country of countriesToGenerate) {
        // Determine theme: use selected theme, or randomize if "mixed" is selected
        const themeToUse = generateTheme === 'mixed'
          ? themes[Math.floor(Math.random() * themes.length)]
          : generateTheme;

        const images = await generateImagesWithDALLE({
          region: selectedRegion,
          country: country,
          count: 1, // One image per country
          theme: themeToUse,
          size: '1024x1024',
          apiKey: apiKey,
        });

        // Add generated images to collage
        for (const image of images) {
          try {
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = () => {
                addCollageImage(image.name, image.url, img);
                resolve(null);
              };
              img.onerror = reject;
              img.src = image.url; // base64 data URL
            });
          } catch (err) {
            console.error(`Failed to load image ${image.name}:`, err);
          }
        }
        currentProgress++;
        setGenerationProgress(currentProgress);
      }
    } catch (error: any) {
      console.error('Failed to generate images:', error);
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      alert(`Failed to generate images: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationTotal(0);
    }
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

  const handleExport = async (format: 'png' | 'jpg' | 'webp', quality: number, scale: number) => {
    // Temporarily deselect all swooshes to hide control points during export
    const swooshStore = (await import('@/store/useSwooshStore')).useSwooshStore;
    const previousSelectedSwooshId = swooshStore.getState().selectedSwooshId;

    try {
      swooshStore.getState().selectSwoosh(null);

      // Wait for render to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Find the canvas-wrapper div which contains all layers
      const canvasWrapper = document.querySelector('.canvas-wrapper') as HTMLElement;
      if (!canvasWrapper) {
        console.error('Canvas wrapper not found');
        // Restore selection
        if (previousSelectedSwooshId) {
          swooshStore.getState().selectSwoosh(previousSelectedSwooshId);
        }
        return;
      }

      // Create a temporary canvas to combine all layers with scaling
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvasSize.width * scale;
      exportCanvas.height = canvasSize.height * scale;
      const ctx = exportCanvas.getContext('2d', {
        willReadFrequently: true,
        alpha: true,
        colorSpace: 'srgb',
      });
      if (!ctx) return;

      // Scale the context
      ctx.scale(scale, scale);

      // Only fill with white if no gradient is selected
      if (!selectedRegion || selectedRegion === '') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      }

      // Helper function to convert SVG data URL to image
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      // Helper function to render a div with background-image or background to canvas
      const renderBackgroundImage = async (element: HTMLElement) => {
        const bgImage = element.style.backgroundImage;
        const background = element.style.background;

        // Check if it's a background with gradient (like scanlines)
        if (background && background.includes('gradient')) {
          const opacity = parseFloat(element.style.opacity || '1');
          const blendMode = element.style.mixBlendMode;

          ctx.save();
          ctx.globalAlpha = opacity;
          if (blendMode && blendMode !== '' && blendMode !== 'normal') {
            ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;
          }

          // Create a temporary canvas to render the gradient
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvasSize.width;
          tempCanvas.height = canvasSize.height;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            // Fill with the gradient/background
            tempCtx.fillStyle = background;
            tempCtx.fillRect(0, 0, canvasSize.width, canvasSize.height);
            ctx.drawImage(tempCanvas, 0, 0);
          }

          ctx.restore();
          return;
        }

        // Otherwise handle as backgroundImage
        if (!bgImage || bgImage === 'none') return;

        // Extract URL from backgroundImage style
        const match = bgImage.match(/url\(["']?([^"']*)["']?\)/);
        if (!match) return;

        const imageUrl = match[1];
        try {
          const img = await loadImage(imageUrl);
          const opacity = parseFloat(element.style.opacity || '1');
          const blendMode = element.style.mixBlendMode;

          ctx.save();
          ctx.globalAlpha = opacity;
          if (blendMode && blendMode !== '' && blendMode !== 'normal') {
            ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;
          }
          ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
          ctx.restore();
        } catch (err) {
          console.warn('Failed to load background image:', err);
        }
      };

      // Collect all elements with z-index and sort them
      const allElements: Array<{ element: HTMLElement | HTMLCanvasElement; zIndex: number; type: 'canvas' | 'div' }> = [];

      // Get the WebGL gradient canvas (should be first, z-index 0 or negative)
      const webglCanvas = canvasWrapper.querySelector('.canvas') as HTMLCanvasElement;
      if (webglCanvas) {
        allElements.push({ element: webglCanvas, zIndex: -1, type: 'canvas' });
      }

      // Get all canvas elements (collage, swooshes)
      const allCanvases = canvasWrapper.querySelectorAll('canvas');
      allCanvases.forEach((canvas) => {
        if (canvas === webglCanvas) return; // Already added
        const parent = canvas.parentElement;
        if (!parent) return;

        const style = window.getComputedStyle(parent);
        const zIndex = parseInt(style.zIndex || '0');

        allElements.push({ element: canvas as HTMLCanvasElement, zIndex, type: 'canvas' });
      });

      // Get all divs with backgroundImage or background (effects including scanlines)
      const allDivs = canvasWrapper.querySelectorAll('div');
      allDivs.forEach((div) => {
        const htmlDiv = div as HTMLElement;
        const hasBackgroundImage = htmlDiv.style.backgroundImage && htmlDiv.style.backgroundImage !== 'none';
        const hasBackground = htmlDiv.style.background && htmlDiv.style.background !== 'none';

        if (!hasBackgroundImage && !hasBackground) return;

        const zIndex = parseInt(htmlDiv.style.zIndex || '0');
        allElements.push({ element: htmlDiv, zIndex, type: 'div' });
      });

      // Sort by z-index
      allElements.sort((a, b) => a.zIndex - b.zIndex);

      // Render all elements in order
      for (const { element, type } of allElements) {
        if (type === 'canvas') {
          const canvas = element as HTMLCanvasElement;

          // Get styles from the canvas element itself (for swooshes)
          // and from parent (for other canvases)
          const canvasStyle = window.getComputedStyle(canvas);
          const parent = canvas.parentElement;
          const parentStyle = parent ? window.getComputedStyle(parent) : null;

          // Blend mode is on the canvas element itself for swooshes
          const blendMode = canvasStyle.mixBlendMode !== 'normal'
            ? canvasStyle.mixBlendMode
            : (parentStyle ? parentStyle.mixBlendMode : 'normal');

          // Opacity could be on either element
          const canvasOpacity = parseFloat(canvasStyle.opacity || '1');
          const parentOpacity = parentStyle ? parseFloat(parentStyle.opacity || '1') : 1;
          const opacity = canvasOpacity * parentOpacity;

          ctx.save();
          ctx.globalAlpha = opacity;

          // Apply blend mode if not normal
          if (blendMode && blendMode !== 'normal') {
            ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;
          }

          // Draw canvas at full size
          ctx.drawImage(canvas, 0, 0, canvasSize.width, canvasSize.height);
          ctx.restore();
        } else {
          await renderBackgroundImage(element as HTMLElement);
        }
      }

      // Determine MIME type and quality
      const mimeType = format === 'png' ? 'image/png' : format === 'jpg' ? 'image/jpeg' : 'image/webp';
      const qualityValue = format === 'png' ? undefined : quality / 100;

      // Convert to blob and download
      exportCanvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `tapestry-${Date.now()}.${format}`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);

        // Restore swoosh selection after export
        if (previousSelectedSwooshId) {
          swooshStore.getState().selectSwoosh(previousSelectedSwooshId);
        }
      }, mimeType, qualityValue);
    } catch (error) {
      console.error('Export failed:', error);
      // Restore swoosh selection on error
      if (previousSelectedSwooshId) {
        swooshStore.getState().selectSwoosh(previousSelectedSwooshId);
      }
    }
  };

  if (collapsed) return null;

  return (
    <div className="right-sidebar">
      {/* Collage Generator Section */}
      <div className="sidebar-section" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
        <div className="section-header">
          <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Sparkles size={14} />
            COLLAGE GENERATOR
          </h3>
        </div>
        <div style={{ marginTop: 'var(--space-4)' }}>
          {/* Description */}
          <div style={{
            fontSize: '11px',
            color: 'var(--color-text-tertiary)',
            marginBottom: 'var(--space-4)',
            lineHeight: 1.4
          }}>
            Generate AI images from countries around the world
          </div>

          {/* Generation Mode Selection - Only show in Manual mode */}
          <div className="property-group">
              {controlMode === 'manual' ? (
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <button
                    onClick={() => {
                      setSelectedCountries([]);
                      setShowCountryDropdown(false);
                    }}
                    className="parameter-button"
                    style={{
                      flex: 1,
                      background: selectedCountries.length === 0 && !showCountryDropdown ? '#163300' : 'var(--color-surface-secondary)',
                      color: selectedCountries.length === 0 && !showCountryDropdown ? '#ffffff' : 'var(--color-text-primary)',
                      border: selectedCountries.length === 0 && !showCountryDropdown ? '1px solid #163300' : '1px solid var(--color-border-light)'
                    }}
                  >
                    Random countries
                  </button>
                  <button
                    onClick={() => {
                      setShowCountryDropdown(true);
                    }}
                    className="parameter-button"
                    style={{
                      flex: 1,
                      background: selectedCountries.length > 0 || showCountryDropdown ? '#163300' : 'var(--color-surface-secondary)',
                      color: selectedCountries.length > 0 || showCountryDropdown ? '#ffffff' : 'var(--color-text-primary)',
                      border: selectedCountries.length > 0 || showCountryDropdown ? '1px solid #163300' : '1px solid var(--color-border-light)'
                    }}
                  >
                    Select countries
                  </button>
                </div>
              ) : null}

              {/* API Key Input */}
              <label className="property-label" style={{ marginTop: 'var(--space-2)' }}>OpenAI API Key</label>
              <input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="property-input"
                style={{
                  width: '100%',
                  padding: 'var(--space-2)',
                  background: 'var(--color-surface-secondary)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-primary)',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }}
              />

              {/* Theme selector - always visible */}
              <label className="property-label" style={{ marginTop: 'var(--space-2)' }}>Theme</label>
              <select
                className="property-select"
                value={generateTheme}
                onChange={(e) => setGenerateTheme(e.target.value as MasterPromptTheme)}
              >
                <option value="mixed">Mixed</option>
                <option value="nature">Nature</option>
                <option value="cities">Cities</option>
                <option value="textures">Textures</option>
                <option value="culture">Culture</option>
              </select>

              {/* Random Mode - Show count when not in Select mode (or always in Auto mode) */}
              {(controlMode === 'auto' || (selectedCountries.length === 0 && !showCountryDropdown)) && (
                <>
                  <label className="property-label" style={{ marginTop: 'var(--space-3)' }}>Count</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={generateCount}
                    onChange={(e) => setGenerateCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                    className="property-input"
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      background: 'var(--color-surface-secondary)',
                      border: '1px solid var(--color-border-light)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                      fontSize: '11px'
                    }}
                  />
                </>
              )}

              {/* Show countries selector when in Select mode OR dropdown is open (Manual mode only) */}
              {controlMode === 'manual' && (selectedCountries.length > 0 || showCountryDropdown) && (
                <div style={{ position: 'relative', marginTop: 'var(--space-3)' }} ref={countryDropdownRef}>
                  <label className="property-label">Countries</label>
                  <button
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="property-select"
                    style={{
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%'
                    }}
                  >
                    <span>
                      {selectedCountries.length === 0
                        ? 'Select countries...'
                        : `${selectedCountries.length} selected`}
                    </span>
                    <span style={{ fontSize: '8px' }}>{showCountryDropdown ? '▲' : '▼'}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showCountryDropdown && gradient?.countries && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: '0',
                      right: '0',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border-light)',
                      borderRadius: 'var(--radius-md)',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}>
                      {gradient.countries.map((country) => (
                        <label
                          key={country}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 'var(--space-2)',
                            fontSize: '11px',
                            cursor: 'pointer',
                            gap: 'var(--space-2)',
                            transition: 'background var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-secondary)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCountries.includes(country)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCountries([...selectedCountries, country]);
                              } else {
                                setSelectedCountries(selectedCountries.filter(c => c !== country));
                              }
                            }}
                            style={{ cursor: 'pointer', flexShrink: 0 }}
                          />
                          <Flag country={country} size={20} style={{ flexShrink: 0 }} />
                          <span>{country}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              className="upload-button"
              onClick={() => handleGenerateImages()}
              disabled={isGenerating}
              style={{
                opacity: isGenerating ? 0.5 : 1,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)'
              }}
            >
              {isGenerating ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    border: '2px solid currentColor',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  {selectedCountries.length > 0
                    ? `Generate ${selectedCountries.length} Image${selectedCountries.length > 1 ? 's' : ''}`
                    : `Generate ${generateCount} Image${generateCount > 1 ? 's' : ''}`}
                </>
              )}
            </button>

            {/* Progress Bar */}
            {isGenerating && generationTotal > 0 && (
              <div className="property-group">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-2)',
                  fontSize: '10px',
                  color: 'var(--color-text-tertiary)'
                }}>
                  <span>Generating {generationProgress} of {generationTotal}</span>
                  <span>{Math.round((generationProgress / generationTotal) * 100)}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'var(--color-surface-secondary)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border-light)'
                }}>
                  <div style={{
                    width: `${(generationProgress / generationTotal) * 100}%`,
                    height: '100%',
                    background: theme === 'dark'
                      ? 'linear-gradient(90deg, var(--color-primary-dark), var(--color-primary))'
                      : 'linear-gradient(90deg, #163300, #9fe870)',
                    transition: 'width 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Animated shimmer effect */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'shimmer 1.5s infinite'
                    }} />
                  </div>
                </div>
              </div>
            )}

            {/* Clear Images Button */}
            {collageImages.length > 0 && !isGenerating && (
              <button
                onClick={clearAllCollageImages}
                className="parameter-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)'
                }}
              >
                <Trash2 size={12} />
                Clear All Images ({collageImages.length})
              </button>
            )}

            {/* Collage Controls - Only show when images exist */}
            {collageImages.length > 0 && (
              <>
                {controlMode === 'manual' ? (
                  <>
                    <div className="property-group" style={{ marginTop: '12px' }}>
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
                        <option value="soft-light">Soft Light</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="property-group" style={{ marginTop: '12px' }}>
                    <button
                      onClick={randomizeCollageSeed}
                      className="randomize-button"
                      title="Randomize all collage parameters"
                    >
                      <Shuffle size={16} />
                      <span>Randomize Collage</span>
                    </button>
                  </div>
                )}
              </>
            )}
        </div>
      </div>

      {/* Image Upload Section - Only show in Manual mode */}
      {controlMode === 'manual' && (
        <div className="sidebar-section" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
          <div className="section-header">
            <h3 className="section-title">ADD YOUR OWN IMAGES</h3>
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              onClick={handleUploadClick}
              className="parameter-button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                width: '100%'
              }}
            >
              Upload to Collage
            </button>
            <div style={{
              fontSize: '10px',
              color: 'var(--color-text-tertiary)',
              marginTop: 'var(--space-2)',
              textAlign: 'center',
              lineHeight: 1.4
            }}>
              Images will be scattered procedurally
            </div>
          </div>
        </div>
      )}

      {/* Position - Only show when image layer is selected */}
      {selectedLayer && selectedLayer.type === 'image' && (
        <div className="sidebar-section" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
          <div className="section-header">
            <h3 className="section-title">POSITION</h3>
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
              {controlMode === 'manual' ? (
                <>
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
                </>
              ) : (
                <div className="property-group">
                  <button
                    onClick={() => {
                      updateLayer(selectedLayer.id, {
                        transform: {
                          ...selectedLayer.transform,
                          position: {
                            x: Math.random() * canvasSize.width,
                            y: Math.random() * canvasSize.height
                          },
                          rotation: Math.random() * 360
                        }
                      });
                    }}
                    className="randomize-button"
                    title="Randomize position and rotation"
                  >
                    <Shuffle size={16} />
                    <span>Randomize Position</span>
                  </button>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Appearance - Only show when image layer is selected */}
      {selectedLayer && selectedLayer.type === 'image' && (
        <div className="sidebar-section" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
          <div className="section-header">
            <h3 className="section-title">APPEARANCE</h3>
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
              {controlMode === 'manual' ? (
                <>
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
                </>
              ) : (
                <>
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
                    <button
                      onClick={() => {
                        updateLayer(selectedLayer.id, {
                          appearance: {
                            ...selectedLayer.appearance,
                            opacity: 50 + Math.random() * 50,
                            hue: Math.random() * 360 - 180,
                            saturation: Math.random() * 100 - 50,
                          }
                        });
                      }}
                      className="randomize-button"
                      title="Randomize appearance"
                    >
                      <Shuffle size={16} />
                      <span>Randomize Appearance</span>
                    </button>
                  </div>
                </>
              )}
          </div>
        </div>
      )}


      {/* Export - at bottom */}
      <div className="bottom-controls">
        <button className="export-button" onClick={() => setShowExportModal(true)} title="Export">
          Export
        </button>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        currentWidth={canvasSize.width}
        currentHeight={canvasSize.height}
      />
    </div>
  );
};

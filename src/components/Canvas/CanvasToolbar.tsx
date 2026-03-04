import React from 'react';
import { useTapestryStore } from '@/store/useTapestryStore';
import { Play, Pause, ChevronDown, Sun, Moon } from 'lucide-react';
import { ControlModeToggle } from './ControlModeToggle';
import './CanvasToolbar.css';

export const CanvasToolbar: React.FC = () => {
  const zoom = useTapestryStore((state) => state.canvas.viewport.zoom);
  const setZoom = useTapestryStore((state) => state.setZoom);
  const canvasSize = useTapestryStore((state) => state.canvas.size);
  const setCanvasSize = useTapestryStore((state) => state.setCanvasSize);
  const isAnimating = useTapestryStore((state) => state.isAnimating);
  const toggleAnimation = useTapestryStore((state) => state.toggleAnimation);
  const theme = useTapestryStore((state) => state.theme);
  const toggleTheme = useTapestryStore((state) => state.toggleTheme);
  const [showZoomMenu, setShowZoomMenu] = React.useState(false);

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

  const handleFitToCanvas = () => {
    // Calculate zoom to fit canvas in viewport
    const canvasArea = document.querySelector('.canvas-area');
    if (!canvasArea) return;

    const viewportWidth = canvasArea.clientWidth;
    const viewportHeight = canvasArea.clientHeight;

    // Account for toolbar height and padding
    const toolbarHeight = 80;
    const padding = 40;
    const availableWidth = viewportWidth - padding * 2;
    const availableHeight = viewportHeight - toolbarHeight - padding * 2;

    // Calculate zoom that fits both dimensions
    const zoomWidth = availableWidth / canvasSize.width;
    const zoomHeight = availableHeight / canvasSize.height;
    const fitZoom = Math.min(zoomWidth, zoomHeight, 1); // Cap at 100%

    setZoom(Math.max(0.1, fitZoom));
    setShowZoomMenu(false);
  };

  const handleSetZoom = (zoomLevel: number) => {
    setZoom(zoomLevel);
    setShowZoomMenu(false);
  };

  return (
    <div className="canvas-toolbar">
      {/* Zoom Dropdown */}
      <div className="toolbar-group" style={{ position: 'relative' }}>
        <button
          className="toolbar-zoom-dropdown"
          onClick={() => setShowZoomMenu(!showZoomMenu)}
          title="Zoom options"
        >
          <span>{Math.round(zoom * 100)}%</span>
          <ChevronDown size={14} />
        </button>

        {showZoomMenu && (
          <>
            <div
              className="zoom-menu-backdrop"
              onClick={() => setShowZoomMenu(false)}
            />
            <div className="zoom-menu">
              <button onClick={() => handleSetZoom(Math.min(2, zoom + 0.1))}>Zoom in</button>
              <button onClick={() => handleSetZoom(Math.max(0.1, zoom - 0.1))}>Zoom out</button>
              <button onClick={handleFitToCanvas}>Zoom to fit</button>
              <div className="zoom-menu-divider" />
              <button onClick={() => handleSetZoom(0.5)}>Zoom to 50%</button>
              <button onClick={() => handleSetZoom(1.0)}>Zoom to 100%</button>
              <button onClick={() => handleSetZoom(2.0)}>Zoom to 200%</button>
            </div>
          </>
        )}
      </div>

      {/* Canvas Dimensions */}
      <div className="toolbar-dimensions">
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
          className="toolbar-dimension-input"
          placeholder="W"
        />
        <span className="toolbar-dimension-separator">×</span>
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
          className="toolbar-dimension-input"
          placeholder="H"
        />
      </div>

      {/* Control Mode Toggle */}
      <ControlModeToggle />

      {/* Play/Pause Button */}
      <button
        className={`toolbar-play-button ${isAnimating ? 'playing' : ''}`}
        onClick={toggleAnimation}
        title={isAnimating ? 'Pause animation' : 'Play animation'}
      >
        {isAnimating ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* Theme Toggle */}
      <button
        className="toolbar-button toolbar-theme-btn"
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  );
};

import React from 'react';
import { useTapestryStore } from '@/store/useTapestryStore';
import './Topbar.css';

export const Topbar: React.FC = () => {
  const canvasMode = useTapestryStore((state) => state.canvas.mode);
  const setCanvasMode = useTapestryStore((state) => state.setCanvasMode);
  const zoom = useTapestryStore((state) => state.canvas.viewport.zoom);
  const setZoom = useTapestryStore((state) => state.setZoom);

  const handleZoomChange = (delta: number) => {
    const newZoom = Math.max(0.1, Math.min(2, zoom + delta));
    setZoom(newZoom);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-logo">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              fill="var(--color-primary)"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="var(--color-primary)"
              strokeWidth="2"
            />
          </svg>
          <span className="topbar-logo-text">Wise</span>
          <span className="topbar-logo-separator">·</span>
          <span className="topbar-logo-subtitle">Tapestry Generator</span>
        </div>
      </div>

      <div className="topbar-center">
        <span className="topbar-title">Canvas Area</span>
      </div>

      <div className="topbar-right">
        {/* Zoom Controls */}
        <div className="topbar-zoom">
          <button
            className="topbar-button"
            onClick={() => handleZoomChange(-0.1)}
            aria-label="Zoom out"
          >
            -
          </button>
          <span className="topbar-zoom-value">{Math.round(zoom * 100)}%</span>
          <button
            className="topbar-button"
            onClick={() => handleZoomChange(0.1)}
            aria-label="Zoom in"
          >
            +
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="topbar-mode-toggle">
          <button
            className={`topbar-mode-button ${
              canvasMode === 'static' ? 'active' : ''
            }`}
            onClick={() => setCanvasMode('static')}
          >
            Static
          </button>
          <button
            className={`topbar-mode-button ${
              canvasMode === 'animate' ? 'active' : ''
            }`}
            onClick={() => setCanvasMode('animate')}
          >
            Animate
          </button>
        </div>

        {/* Export Button */}
        <button className="topbar-button-primary">Export</button>
      </div>
    </div>
  );
};

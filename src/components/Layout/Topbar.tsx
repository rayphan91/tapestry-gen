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
            width="70"
            height="16"
            viewBox="0 0 87 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="topbar-logo-svg"
          >
            <path fill="currentColor" d="M9.5,2.5 L9.5,17.5 L12,17.5 L12,11.5 L16,11.5 L20.5,17.5 L23.5,17.5 L18.5,11 C20.5,10 22,8.5 22,6 C22,3 19.5,2.5 17,2.5 L9.5,2.5 Z M12,5 L16.5,5 C18,5 19.5,5.5 19.5,6.5 C19.5,8 18,8.5 16.5,8.5 L12,8.5 L12,5 Z M26,2.5 L26,17.5 L28.5,17.5 L28.5,2.5 L26,2.5 Z M32,6 L32,8.5 L39,8.5 C39,9.5 38.5,11 37,11.5 C35.5,12 34,11.5 33,10.5 L31,12 C32.5,14 34.5,14.5 37,14 C39.5,13.5 41.5,11.5 41.5,9 C41.5,6.5 39.5,6 37.5,6 L32,6 Z M45,6 L45,17.5 L54,17.5 L54,15 L47.5,15 L47.5,12.5 L53,12.5 L53,10 L47.5,10 L47.5,8.5 L54,8.5 L54,6 L45,6 Z M58,2.5 L58,17.5 L67,17.5 L67,15 L60.5,15 L60.5,2.5 L58,2.5 Z M70,2.5 L70,17.5 L79,17.5 L79,15 L72.5,15 L72.5,2.5 L70,2.5 Z"/>
          </svg>
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

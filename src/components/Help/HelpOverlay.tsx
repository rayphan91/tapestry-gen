import React from 'react';
import { HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import './HelpOverlay.css';

interface HelpOverlayProps {
  isActive: boolean;
  onClose: () => void;
}

const TOOLTIP_ORDER = [
  'region',
  'noise',
  'swoosh',
  'effects',
  'collage',
  'collage-controls',
  'upload',
  'export',
  'control-mode',
  'dimensions',
  'toolbar',
];

export const HelpOverlay: React.FC<HelpOverlayProps> = ({ isActive, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!isActive) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : TOOLTIP_ORDER.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < TOOLTIP_ORDER.length - 1 ? prev + 1 : 0));
  };

  const currentTooltip = TOOLTIP_ORDER[currentIndex];

  return (
    <>
      {/* Dark overlay */}
      <div className="help-overlay-backdrop" onClick={onClose} />

      {/* Navigation */}
      <div className="help-navigation">
        <button className="help-nav-button" onClick={handlePrevious}>
          <ChevronLeft size={24} />
        </button>
        <span className="help-nav-counter">
          {currentIndex + 1} / {TOOLTIP_ORDER.length}
        </span>
        <button className="help-nav-button" onClick={handleNext}>
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Tooltips */}
      <div className="help-tooltips">
        {/* Left Sidebar - Region */}
        {currentTooltip === 'region' && (
          <div className="help-tooltip help-tooltip-region">
            <div className="help-tooltip-content">
              <h4>Region</h4>
              <p>Select a regional gradient palette. Each region combines countries with unique color schemes.</p>
              <p>Choose "Custom" to create your own gradient with custom colors.</p>
            </div>
          </div>
        )}

        {/* Left Sidebar - Noise Parameters */}
        {currentTooltip === 'noise' && (
          <div className="help-tooltip help-tooltip-noise">
            <div className="help-tooltip-content">
              <h4>Noise Parameters</h4>
              <p><strong>Manual:</strong> Adjust scale, octaves, lacunarity, gain, and contrast for precise control.</p>
              <p><strong>Auto:</strong> Click "Randomize Noise" to generate new patterns instantly.</p>
            </div>
          </div>
        )}

        {/* Left Sidebar - Draw Swoosh */}
        {currentTooltip === 'swoosh' && (
          <div className="help-tooltip help-tooltip-swoosh">
            <div className="help-tooltip-content">
              <h4>Draw Swoosh</h4>
              <p><strong>Manual:</strong> Toggle "Draw" mode to manually draw swooshes, or "Generate" random swooshes. Select individual swooshes to edit.</p>
              <p><strong>Auto:</strong> Simply click "Generate Swoosh" to create random swooshes instantly.</p>
              <p>Control visibility and opacity for each swoosh layer.</p>
            </div>
          </div>
        )}

        {/* Left Sidebar - Effects */}
        {currentTooltip === 'effects' && (
          <div className="help-tooltip help-tooltip-effects">
            <div className="help-tooltip-content">
              <h4>Effects</h4>
              <p><strong>Manual:</strong> Fine-tune each effect (film grain, scanlines, veins, brush strokes, etc.) individually.</p>
              <p><strong>Auto:</strong> Click "Randomize All Effects" to shuffle all effects at once.</p>
            </div>
          </div>
        )}

        {/* Right Sidebar - Collage Generator */}
        {currentTooltip === 'collage' && (
          <div className="help-tooltip help-tooltip-collage">
            <div className="help-tooltip-content">
              <h4>Collage Generator</h4>
              <p>Generate AI images from countries around the world.</p>
              <p><strong>Manual:</strong> Choose random or select specific countries.</p>
              <p><strong>Auto:</strong> Uses random countries for simplicity.</p>
              <p><strong>Tip:</strong> Click and drag images on the canvas to reposition them manually!</p>
            </div>
          </div>
        )}

        {/* Right Sidebar - Collage Controls */}
        {currentTooltip === 'collage-controls' && (
          <div className="help-tooltip help-tooltip-collage-controls">
            <div className="help-tooltip-content">
              <h4>Collage Controls</h4>
              <p><strong>Manual:</strong> Fine-tune vignette, scale spread, rotation, and more.</p>
              <p><strong>Auto:</strong> Click "Randomize Collage" for instant layout variations.</p>
            </div>
          </div>
        )}

        {/* Right Sidebar - Image Upload */}
        {currentTooltip === 'upload' && (
          <div className="help-tooltip help-tooltip-upload">
            <div className="help-tooltip-content">
              <h4>Add Your Own Images</h4>
              <p>Upload your own images to be scattered procedurally in the collage system.</p>
              <p>Available in Manual mode only. Drag & drop onto canvas also works!</p>
              <p><strong>Tip:</strong> Once placed, drag images around to customize positions.</p>
            </div>
          </div>
        )}

        {/* Export */}
        {currentTooltip === 'export' && (
          <div className="help-tooltip help-tooltip-export">
            <div className="help-tooltip-content">
              <h4>Export</h4>
              <p>Export your tapestry in various formats (PNG, JPG, WebP) and quality settings.</p>
              <p>The validation checklist ensures all required elements are present before export.</p>
            </div>
          </div>
        )}

        {/* Canvas Toolbar - Control Mode */}
        {currentTooltip === 'control-mode' && (
          <div className="help-tooltip help-tooltip-control-mode">
            <div className="help-tooltip-content">
              <h4>Control Mode</h4>
              <p><strong>Auto Mode:</strong> Simplified interface with "Randomize" buttons for quick creativity. Perfect for rapid experimentation - just click buttons to generate random variations!</p>
              <p><strong>Manual Mode:</strong> Full control with all sliders and detailed parameters. Adjust every aspect precisely for fine-tuned results.</p>
              <p>Toggle between modes anytime in the Canvas Toolbar.</p>
            </div>
          </div>
        )}

        {/* Canvas Toolbar - Dimensions */}
        {currentTooltip === 'dimensions' && (
          <div className="help-tooltip help-tooltip-dimensions">
            <div className="help-tooltip-content">
              <h4>Canvas Dimensions</h4>
              <p>Set the width and height of your canvas. Adjust before exporting for desired output size.</p>
            </div>
          </div>
        )}

        {/* Canvas Toolbar */}
        {currentTooltip === 'toolbar' && (
          <div className="help-tooltip help-tooltip-toolbar">
            <div className="help-tooltip-content">
              <h4>Canvas Toolbar</h4>
              <p>Zoom in/out, toggle animation mode, and switch between light/dark themes.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const HelpButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button className="help-button" onClick={onClick} title="Show help">
      <HelpCircle size={20} />
    </button>
  );
};

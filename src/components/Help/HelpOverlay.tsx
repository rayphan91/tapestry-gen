import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import './HelpOverlay.css';

interface HelpOverlayProps {
  isActive: boolean;
  onClose: () => void;
}

export const HelpOverlay: React.FC<HelpOverlayProps> = ({ isActive, onClose }) => {
  if (!isActive) return null;

  return (
    <>
      {/* Dark overlay */}
      <div className="help-overlay-backdrop" onClick={onClose} />

      {/* Tooltips */}
      <div className="help-tooltips">
        {/* Canvas Toolbar - Control Mode */}
        <div className="help-tooltip help-tooltip-control-mode">
          <div className="help-tooltip-content">
            <h4>Control Mode</h4>
            <p><strong>Auto Mode:</strong> Simplified interface with "Randomize" buttons for quick creativity. Perfect for rapid experimentation - just click buttons to generate random variations!</p>
            <p><strong>Manual Mode:</strong> Full control with all sliders and detailed parameters. Adjust every aspect precisely for fine-tuned results.</p>
            <p>Toggle between modes anytime in the Canvas Toolbar.</p>
          </div>
        </div>

        {/* Canvas Toolbar - Dimensions */}
        <div className="help-tooltip help-tooltip-dimensions">
          <div className="help-tooltip-content">
            <h4>Canvas Dimensions</h4>
            <p>Set the width and height of your canvas. Adjust before exporting for desired output size.</p>
          </div>
        </div>

        {/* Left Sidebar - Region */}
        <div className="help-tooltip help-tooltip-region">
          <div className="help-tooltip-content">
            <h4>Region</h4>
            <p>Select a regional gradient palette. Each region combines countries with unique color schemes.</p>
            <p>Choose "Custom" to create your own gradient with custom colors.</p>
          </div>
        </div>

        {/* Left Sidebar - Draw Swoosh */}
        <div className="help-tooltip help-tooltip-swoosh">
          <div className="help-tooltip-content">
            <h4>Draw Swoosh</h4>
            <p><strong>Manual:</strong> Toggle "Draw" mode to manually draw swooshes, or "Generate" random swooshes. Select individual swooshes to edit.</p>
            <p><strong>Auto:</strong> Simply click "Generate Swoosh" to create random swooshes instantly.</p>
            <p>Control visibility and opacity for each swoosh layer.</p>
          </div>
        </div>

        {/* Left Sidebar - Noise Parameters */}
        <div className="help-tooltip help-tooltip-noise">
          <div className="help-tooltip-content">
            <h4>Noise Parameters</h4>
            <p><strong>Manual:</strong> Adjust scale, octaves, lacunarity, gain, and contrast for precise control.</p>
            <p><strong>Auto:</strong> Click "Randomize Noise" to generate new patterns instantly.</p>
          </div>
        </div>

        {/* Left Sidebar - Effects */}
        <div className="help-tooltip help-tooltip-effects">
          <div className="help-tooltip-content">
            <h4>Effects</h4>
            <p><strong>Manual:</strong> Fine-tune each effect (film grain, scanlines, veins, brush strokes, etc.) individually.</p>
            <p><strong>Auto:</strong> Click "Randomize All Effects" to shuffle all effects at once.</p>
          </div>
        </div>

        {/* Right Sidebar - Collage Generator */}
        <div className="help-tooltip help-tooltip-collage">
          <div className="help-tooltip-content">
            <h4>Collage Generator</h4>
            <p>Generate AI images from countries around the world.</p>
            <p><strong>Manual:</strong> Choose random or select specific countries.</p>
            <p><strong>Auto:</strong> Uses random countries for simplicity.</p>
          </div>
        </div>

        {/* Right Sidebar - Collage Controls */}
        <div className="help-tooltip help-tooltip-collage-controls">
          <div className="help-tooltip-content">
            <h4>Collage Controls</h4>
            <p><strong>Manual:</strong> Fine-tune vignette, scale spread, rotation, and more.</p>
            <p><strong>Auto:</strong> Click "Randomize Collage" for instant layout variations.</p>
          </div>
        </div>

        {/* Right Sidebar - Image Upload */}
        <div className="help-tooltip help-tooltip-upload">
          <div className="help-tooltip-content">
            <h4>Add Your Own Images</h4>
            <p>Upload your own images to be scattered procedurally in the collage system, just like AI-generated images.</p>
            <p>Available in Manual mode only. Drag & drop also works!</p>
          </div>
        </div>

        {/* Canvas Toolbar */}
        <div className="help-tooltip help-tooltip-toolbar">
          <div className="help-tooltip-content">
            <h4>Canvas Toolbar</h4>
            <p>Zoom in/out, toggle animation mode, and switch between light/dark themes.</p>
          </div>
        </div>

        {/* Export */}
        <div className="help-tooltip help-tooltip-export">
          <div className="help-tooltip-content">
            <h4>Export</h4>
            <p>Export your tapestry in various formats (PNG, JPG, WebP) and quality settings.</p>
            <p>The validation checklist ensures all required elements are present before export.</p>
          </div>
        </div>

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

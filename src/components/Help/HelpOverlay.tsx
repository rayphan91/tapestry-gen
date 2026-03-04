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
        {/* Left Sidebar - Region */}
        <div className="help-tooltip help-tooltip-region">
          <div className="help-tooltip-content">
            <h4>Region</h4>
            <p>Select a regional gradient palette. Each region combines countries with unique color schemes.</p>
          </div>
        </div>

        {/* Left Sidebar - Noise Parameters */}
        <div className="help-tooltip help-tooltip-noise">
          <div className="help-tooltip-content">
            <h4>Noise Parameters</h4>
            <p>Adjust the procedural noise that creates the background texture. Control scale, octaves, and contrast.</p>
          </div>
        </div>

        {/* Left Sidebar - Effects */}
        <div className="help-tooltip help-tooltip-effects">
          <div className="help-tooltip-content">
            <h4>Effects</h4>
            <p>Add visual effects like film grain, scanlines, veins, and swoosh strokes to enhance your tapestry.</p>
          </div>
        </div>

        {/* Right Sidebar - Collage Generator */}
        <div className="help-tooltip help-tooltip-collage">
          <div className="help-tooltip-content">
            <h4>Collage Generator</h4>
            <p>Generate AI images from countries. Choose Random for auto-selection or Select to pick specific countries.</p>
          </div>
        </div>

        {/* Right Sidebar - Collage Controls */}
        <div className="help-tooltip help-tooltip-collage-controls">
          <div className="help-tooltip-content">
            <h4>Collage Controls</h4>
            <p>Fine-tune your collage layout with vignette, scale spread, rotation, and blend modes.</p>
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
            <p>Export your tapestry in various formats and sizes. Canvas dimensions can be adjusted here.</p>
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

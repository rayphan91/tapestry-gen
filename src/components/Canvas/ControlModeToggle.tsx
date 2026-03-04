import React from 'react';
import { useTapestryStore } from '@/store/useTapestryStore';
import { Sliders, Wand2 } from 'lucide-react';

export const ControlModeToggle: React.FC = () => {
  const controlMode = useTapestryStore((state) => state.controlMode);
  const setControlMode = useTapestryStore((state) => state.setControlMode);

  return (
    <div className="control-mode-toggle">
      <button
        className={`mode-button ${controlMode === 'manual' ? 'active' : ''}`}
        onClick={() => setControlMode('manual')}
        title="Manual mode - Full control with all sliders"
      >
        <Sliders size={16} />
        <span>Manual</span>
      </button>
      <button
        className={`mode-button ${controlMode === 'auto' ? 'active' : ''}`}
        onClick={() => setControlMode('auto')}
        title="Auto mode - Simplified with randomize buttons"
      >
        <Wand2 size={16} />
        <span>Auto</span>
      </button>
    </div>
  );
};

import React from 'react';
import { useTapestryStore } from '@/store/useTapestryStore';
import { Play, Pause } from 'lucide-react';
import './AnimationModeToggle.css';

export const AnimationModeToggle: React.FC = () => {
  const isAnimating = useTapestryStore((state) => state.isAnimating);
  const toggleAnimation = useTapestryStore((state) => state.toggleAnimation);

  return (
    <button
      className="animation-mode-toggle"
      onClick={toggleAnimation}
      title={isAnimating ? 'Switch to Static Mode' : 'Switch to Animate Mode'}
    >
      {isAnimating ? <Pause size={16} /> : <Play size={16} />}
      <span>{isAnimating ? 'Animate Mode' : 'Static Mode'}</span>
    </button>
  );
};

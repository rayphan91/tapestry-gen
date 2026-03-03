import React, { useEffect, useRef } from 'react';
import { useTapestryStore } from '@/store/useTapestryStore';
import { Play, Pause } from 'lucide-react';
import './AnimationControls.css';

export const AnimationControls: React.FC = () => {
  const isAnimating = useTapestryStore((state) => state.isAnimating);
  const animationDuration = useTapestryStore((state) => state.animationDuration);
  const currentAnimationTime = useTapestryStore((state) => state.currentAnimationTime);
  const animationSpeed = useTapestryStore((state) => state.animationSpeed);
  const toggleAnimation = useTapestryStore((state) => state.toggleAnimation);
  const setAnimationDuration = useTapestryStore((state) => state.setAnimationDuration);
  const setCurrentAnimationTime = useTapestryStore((state) => state.setCurrentAnimationTime);
  const setAnimationSpeed = useTapestryStore((state) => state.setAnimationSpeed);

  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  // Animation loop - optimized with throttling
  useEffect(() => {
    if (!isAnimating) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const TARGET_FPS = 30; // Reduced from 60fps for better performance
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
        lastUpdateRef.current = timestamp;
      }

      // Throttle updates to target FPS
      const timeSinceLastUpdate = timestamp - lastUpdateRef.current;

      if (timeSinceLastUpdate >= FRAME_INTERVAL) {
        const deltaTime = (timestamp - lastTimeRef.current) / 1000; // Convert to seconds
        lastTimeRef.current = timestamp;
        lastUpdateRef.current = timestamp;

        setCurrentAnimationTime((currentAnimationTime + deltaTime * animationSpeed) % animationDuration);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimeRef.current = 0;
      lastUpdateRef.current = 0;
    };
  }, [isAnimating, currentAnimationTime, animationDuration, animationSpeed, setCurrentAnimationTime]);

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentAnimationTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animation-controls">
      <div className="animation-top-row">
        <button
          className="animation-play-button"
          onClick={toggleAnimation}
          title={isAnimating ? 'Pause' : 'Play'}
        >
          {isAnimating ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <div className="animation-time-display">
          {formatTime(currentAnimationTime)} / {formatTime(animationDuration)}
        </div>

        <div className="animation-duration-control">
          <label>Duration</label>
          <input
            type="number"
            min="1"
            max="60"
            value={animationDuration}
            onChange={(e) => setAnimationDuration(parseFloat(e.target.value) || 8)}
            className="animation-duration-input"
          />
          <span>s</span>
        </div>

        <div className="animation-duration-control">
          <label>Speed</label>
          <input
            type="number"
            min="0.25"
            max="4"
            step="0.25"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value) || 1)}
            className="animation-duration-input"
          />
          <span>x</span>
        </div>
      </div>

      <div className="animation-scrubber-container">
        <input
          type="range"
          min="0"
          max={animationDuration}
          step="0.01"
          value={currentAnimationTime}
          onChange={handleScrubberChange}
          className="animation-scrubber"
        />
      </div>
    </div>
  );
};

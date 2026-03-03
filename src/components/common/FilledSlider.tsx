import React from 'react';
import './FilledSlider.css';

interface FilledSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const FilledSlider: React.FC<FilledSliderProps> = ({
  min,
  max,
  value,
  onChange,
  className = '',
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={`filled-slider ${className}`}
      style={{
        background: `linear-gradient(to right, var(--slider-fill-color, #9fe870) 0%, var(--slider-fill-color, #9fe870) ${percentage}%, var(--color-border-light) ${percentage}%, var(--color-border-light) 100%)`,
      }}
    />
  );
};

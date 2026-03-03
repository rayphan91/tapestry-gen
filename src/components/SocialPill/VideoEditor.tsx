import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialPill } from './SocialPill';
import {
  MoveRight,
  Sparkles,
  Zap,
  Heart,
  Star,
  TrendingUp,
  Award,
  Rocket,
  Target,
  CheckCircle,
  Play,
} from 'lucide-react';
import './VideoEditor.css';

const iconOptions = [
  { name: 'Move Right', icon: MoveRight },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Zap', icon: Zap },
  { name: 'Heart', icon: Heart },
  { name: 'Star', icon: Star },
  { name: 'Trending Up', icon: TrendingUp },
  { name: 'Award', icon: Award },
  { name: 'Rocket', icon: Rocket },
  { name: 'Target', icon: Target },
  { name: 'Check', icon: CheckCircle },
];

const DEMO_SEQUENCE = [
  'Hi',
  'Hello',
  'Hello World',
  'Amazing',
  'Check this out',
  'Social Media',
  'Design',
];

export const VideoEditor: React.FC = () => {
  const [text, setText] = useState('Your Text Here');
  const [selectedIconName, setSelectedIconName] = useState('Move Right');
  const [pillColor, setPillColor] = useState('#163300');
  const [iconColor, setIconColor] = useState('#9fe870');
  const [textColor, setTextColor] = useState('#9fe870');
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedIcon = iconOptions.find((opt) => opt.name === selectedIconName)?.icon || MoveRight;

  const playAnimation = () => {
    if (isPlaying) return;

    setIsPlaying(true);
    let index = 0;
    setText(DEMO_SEQUENCE[0]);

    const interval = setInterval(() => {
      index++;
      if (index >= DEMO_SEQUENCE.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setText('Your Text Here');
      } else {
        setText(DEMO_SEQUENCE[index]);
      }
    }, 800);
  };

  return (
    <div className="video-editor">
      {/* Editor Panel - Left Side */}
      <div className="editor-panel">
        {/* Content */}
        <div className="property-section">
          <label className="property-label">Text Content</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="property-input"
            placeholder="Type here..."
            autoFocus
            disabled={isPlaying}
          />
        </div>

        {/* Icon Selector */}
        <div className="property-section">
          <label className="property-label">Icon</label>
          <select
            value={selectedIconName}
            onChange={(e) => setSelectedIconName(e.target.value)}
            className="property-select"
            disabled={isPlaying}
          >
            {iconOptions.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Colors Section */}
        <div className="property-section">
          <h4 className="property-section-title">Colors</h4>
        </div>

        {/* Pill Background */}
        <div className="property-section">
          <label className="property-label">Pill Background</label>
          <div className="color-input-group">
            <input
              type="color"
              value={pillColor}
              onChange={(e) => setPillColor(e.target.value)}
              className="color-swatch"
              disabled={isPlaying}
            />
            <input
              type="text"
              value={pillColor}
              onChange={(e) => setPillColor(e.target.value)}
              className="color-text-input"
              disabled={isPlaying}
            />
          </div>
        </div>

        {/* Icon Circle */}
        <div className="property-section">
          <label className="property-label">Icon Circle</label>
          <div className="color-input-group">
            <input
              type="color"
              value={iconColor}
              onChange={(e) => setIconColor(e.target.value)}
              className="color-swatch"
              disabled={isPlaying}
            />
            <input
              type="text"
              value={iconColor}
              onChange={(e) => setIconColor(e.target.value)}
              className="color-text-input"
              disabled={isPlaying}
            />
          </div>
        </div>

        {/* Text Color */}
        <div className="property-section">
          <label className="property-label">Text Color</label>
          <div className="color-input-group">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="color-swatch"
              disabled={isPlaying}
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="color-text-input"
              disabled={isPlaying}
            />
          </div>
        </div>

        {/* Presets Section */}
        <div className="property-section">
          <h4 className="property-section-title">Presets</h4>
        </div>

        <div className="property-section">
          <div className="preset-buttons">
            <button
              onClick={() => {
                setPillColor('#163300');
                setIconColor('#9fe870');
                setTextColor('#9fe870');
              }}
              className="preset-button"
              style={{ backgroundColor: '#163300', color: '#9fe870' }}
              disabled={isPlaying}
            >
              Wise Green
            </button>
            <button
              onClick={() => {
                setPillColor('#000000');
                setIconColor('#ffffff');
                setTextColor('#ffffff');
              }}
              className="preset-button"
              style={{ backgroundColor: '#000000', color: '#ffffff' }}
              disabled={isPlaying}
            >
              Classic
            </button>
            <button
              onClick={() => {
                setPillColor('#3b82f6');
                setIconColor('#dbeafe');
                setTextColor('#ffffff');
              }}
              className="preset-button"
              style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}
              disabled={isPlaying}
            >
              Blue
            </button>
            <button
              onClick={() => {
                setPillColor('#ec4899');
                setIconColor('#fce7f3');
                setTextColor('#ffffff');
              }}
              className="preset-button"
              style={{ backgroundColor: '#ec4899', color: '#ffffff' }}
              disabled={isPlaying}
            >
              Pink
            </button>
          </div>
        </div>

        {/* Animation Section */}
        <div className="property-section">
          <h4 className="property-section-title">Animation</h4>
        </div>

        <div className="property-section">
          <button
            onClick={playAnimation}
            disabled={isPlaying}
            className="play-button"
          >
            <Play size={16} />
            <span>{isPlaying ? 'Playing...' : 'Play Demo'}</span>
          </button>
        </div>
      </div>

      {/* Canvas Area - Right Side */}
      <div className="canvas-area">
        {/* Center Crosshair */}
        <div className="center-marker">
          <div className="center-marker-vertical" />
          <div className="center-marker-horizontal" />
        </div>

        {/* Animated Pill - Perfectly Centered */}
        <AnimatePresence mode="wait">
          <motion.div
            key="pill-wrapper"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
          >
            <SocialPill
              text={text}
              icon={selectedIcon}
              pillColor={pillColor}
              iconColor={iconColor}
              textColor={textColor}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

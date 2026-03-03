import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, MoveRight } from 'lucide-react';
import './SocialPill.css';

interface SocialPillProps {
  text: string;
  icon?: LucideIcon;
  iconColor?: string;
  pillColor?: string;
  textColor?: string;
}

export const SocialPill: React.FC<SocialPillProps> = ({
  text,
  icon: Icon = MoveRight,
  iconColor = '#9fe870',
  pillColor = '#163300',
  textColor = '#9fe870',
}) => {
  return (
    <motion.div
      layout
      className="social-pill"
      style={{ backgroundColor: pillColor }}
      transition={{
        layout: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        },
      }}
    >
      {/* Icon Circle - Fixed Size Anchor */}
      <motion.div
        className="social-pill__icon"
        style={{ backgroundColor: iconColor }}
        layout="position"
      >
        <Icon size={16} strokeWidth={2.5} style={{ color: pillColor }} />
      </motion.div>

      {/* Text Content - Dynamic Width */}
      <motion.span
        layout="position"
        className="social-pill__text"
        style={{ color: textColor }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

import React from 'react';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Glass icon (250ml - small drink)
export const GlassIcon: React.FC<IconProps> = ({ size = 32, color = '#74B9FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 3H18L16.5 20C16.5 20.5523 16.0523 21 15.5 21H8.5C7.94772 21 7.5 20.5523 7.5 20L6 3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.5 9L16.5 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M8.5 14C8.5 14 10 15.5 12 15.5C14 15.5 15.5 14 15.5 14"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.6"
    />
  </Svg>
);

// Bottle icon (500ml - standard bottle)
export const BottleIcon: React.FC<IconProps> = ({ size = 32, color = '#74B9FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 2H15V4C15 4.55228 15.4477 5 16 5H16.5C17.0523 5 17.5 5.44772 17.5 6V8L17 21C17 21.5523 16.5523 22 16 22H8C7.44772 22 7 21.5523 7 21L6.5 8V6C6.5 5.44772 6.94772 5 7.5 5H8C8.55228 5 9 4.55228 9 4V2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.5 11H16.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M8.5 15C8.5 15 10 17 12 17C14 17 15.5 15 15.5 15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.6"
    />
    <Circle cx="12" cy="3" r="0.5" fill={color} />
  </Svg>
);

// Jug/Pitcher icon (750ml - large container)
export const JugIcon: React.FC<IconProps> = ({ size = 32, color = '#74B9FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 6H16C17.1046 6 18 6.89543 18 8V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V6Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 6L5 4C4.72386 3.44772 5.17157 3 5.8 3H16.2C16.8284 3 17.2761 3.44772 17 4L16 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 9H20C20.5523 9 21 9.44772 21 10V13C21 13.5523 20.5523 14 20 14H18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 10H17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M9 15C9 15 10.5 17 12 17C13.5 17 15 15 15 15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.6"
    />
  </Svg>
);

// Custom drop icon (for custom amount)
export const DropIcon: React.FC<IconProps> = ({ size = 32, color = '#74B9FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C12 2 6 9 6 14C6 17.3137 8.68629 20 12 20C15.3137 20 18 17.3137 18 14C18 9 12 2 12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 14C9 15.6569 10.3431 17 12 17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.6"
    />
  </Svg>
);

// Undo icon
export const UndoIcon: React.FC<IconProps> = ({ size = 24, color = '#FF7675' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 7V13H9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 13L7.5 8.5C9.15685 6.84315 11.3431 6 14 6C18.4183 6 22 9.58172 22 14C22 18.4183 18.4183 22 14 22C10.1935 22 6.99253 19.3629 6.18988 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Tab bar icons
export const HomeIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 24,
  color = '#6C5CE7',
  filled = false
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <Path
        d="M12 2L3 9V21C3 21.5523 3.44772 22 4 22H9V16C9 15.4477 9.44772 15 10 15H14C14.5523 15 15 15.4477 15 16V22H20C20.5523 22 21 21.5523 21 21V9L12 2Z"
        fill={color}
      />
    ) : (
      <Path
        d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </Svg>
);

export const HistoryIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 24,
  color = '#6C5CE7',
  filled = false
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="12"
      r="9"
      stroke={color}
      strokeWidth="2"
      fill={filled ? color : 'none'}
    />
    <Path
      d="M12 7V12L15 15"
      stroke={filled ? '#FFFFFF' : color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SettingsIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 24,
  color = '#6C5CE7',
  filled = false
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="12"
      r="3"
      stroke={color}
      strokeWidth="2"
      fill={filled ? color : 'none'}
    />
    <Path
      d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Plus icon for custom add
export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M5 12H19"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </Svg>
);

// Check icon for success states
export const CheckIcon: React.FC<IconProps> = ({ size = 24, color = '#00B894' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 13L9 17L19 7"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

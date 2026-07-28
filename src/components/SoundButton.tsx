import React from 'react';
import { playClick } from '../utils/sounds';

interface SoundButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  soundType?: 'click' | 'none';
}

const SoundButton: React.FC<SoundButtonProps> = ({ 
  children, 
  onClick, 
  soundType = 'click',
  ...props 
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (soundType === 'click') {
      playClick();
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
};

export default SoundButton;
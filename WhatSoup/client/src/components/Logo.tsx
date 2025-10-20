import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`logo-container ${className}`}>
      <img 
        src="/assets/IMG_6684.webp" 
        alt="WhatSoup Logo" 
        className="h-16 md:h-20" 
      />
    </div>
  );
};
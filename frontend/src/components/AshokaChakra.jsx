import React from 'react';
import '../css/AshokaChakra.css';

export default function AshokaChakra({ isActive = false, size = 40 }) {
  const spokes = Array.from({ length: 12 }); // 12 elements, each representing a line across, so 24 radii
  
  return (
    <div className="chakra-wrapper" style={{ width: size, height: size }}>
      {isActive && <div className="chakra-pulse" />}
      <div className="ashoka-chakra" style={{ width: size, height: size }}>
        {spokes.map((_, i) => (
          <div 
            key={i} 
            className="ashoka-spoke" 
            style={{ transform: `rotate(${i * (180 / 12)}deg)` }} 
          />
        ))}
        <div className="ashoka-center" />
      </div>
    </div>
  );
}

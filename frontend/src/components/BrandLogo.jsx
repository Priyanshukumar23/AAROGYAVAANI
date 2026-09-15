import React from 'react';
import AshokaChakra from './AshokaChakra';

export function BrandText({ darkBg = false }) {
  return (
    <span style={{ fontWeight: 900, whiteSpace: 'nowrap' }}>
      <span style={{ color: 'var(--saffron)' }}>AARO</span>
      <span style={{ color: darkBg ? '#FFFFFF' : 'var(--navy-text)' }}>GYAV</span>
      <span style={{ color: 'var(--blue)' }}>AANI</span>
    </span>
  );
}

export default function BrandLogo({ isListening = false, size = 40 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', userSelect: 'none' }}>
      <AshokaChakra isActive={isListening} size={size} />
      <div style={{ 
        fontFamily: 'var(--font-head)', 
        fontWeight: 800, 
        letterSpacing: '0.15em', 
        fontSize: size * 0.6,
        display: 'flex',
        alignItems: 'baseline'
      }}>
        <BrandText />
      </div>
    </div>
  );
}

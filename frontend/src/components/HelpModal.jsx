import { useState } from 'react';
import { BrandText } from './BrandLogo';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="ui-3d-card" style={{ background: 'var(--card)', padding: 32, borderRadius: 24, maxWidth: 500, width: '90%', position: 'relative', animation: 'modal-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--ink)' }}>✖</button>
        <h2 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 10 }}>❓ About <BrandText darkBg={false} /></h2>
        
        <p style={{ fontSize: 18, lineHeight: 1.6 }}>
          This is an advanced AI-powered health kiosk designed to accurately capture your medical history.
        </p>
        
        <ul style={{ fontSize: 16, lineHeight: 1.8, paddingLeft: 20, marginBottom: 24, color: 'var(--ink)' }}>
          <li><strong>Tap "Start Patient Check-In"</strong> to begin your intake safely.</li>
          <li><strong>Use the 🌐 Language button</strong> to seamlessly switch between English, Hindi, and Punjabi.</li>
          <li><strong>Turn on 🔊 Audio</strong> to hear the AI speak all instructions aloud.</li>
        </ul>

        <div style={{ padding: 16, background: 'var(--blue-soft)', borderRadius: 12, marginBottom: 24, border: '1px solid var(--blue)' }}>
          <strong style={{ color: 'var(--blue-dark)' }}>For Hospital Staff:</strong>
          <p className="small" style={{ margin: '4px 0 0 0', color: 'var(--blue-dark)' }}>
            Tap the "Staff" button or navigate to <code>/staff/login</code> to access Doctor, Triage, and Admin dashboards.
          </p>
        </div>

        <button className="btn btn-primary btn-block ui-3d-btn" onClick={onClose} style={{ fontSize: 20 }}>Awesome, Got it!</button>
      </div>
      <style>{`
        @keyframes modal-pop {
          0% { transform: scale(0.9) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
